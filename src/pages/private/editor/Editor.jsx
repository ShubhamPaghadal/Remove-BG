import { Helmet } from 'react-helmet';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { saveAs } from 'file-saver';
import {
	Box,
	Divider,
	FormControlLabel,
	FormGroup,
	Stack
} from '@mui/material';
import {
	setZoom,
	setBulk,
	selectImage,
	setDownload,
	setEditView,
	clearLocal,
	centerImage,
	updateBaseBg
} from '@/store/editor';
import { MagicIcon } from '@/components/Icons/MagicIcon';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/Icons';
import { IconButton } from '@/components/IconButton';
import { fetchCredits, init, redo, undo } from '@/store/editor/thunks';
import { saveImage } from '@/store/editor/utils';
import { useBlocker, useLocation, useNavigate } from 'react-router-dom';
import routes from '@/routes';
import { useTranslation } from 'react-i18next';
import { useMedia } from '@/hooks/responsive';
import { palette } from '@/theme/palette';
import transactionModel from '@/models/transaction';

import { Switch } from '@/components/Switch';
import { getImageUrl, showError } from '@/utils';
import { useSubscribed } from '@/hooks';
import { PLAUSIBLE_EVENTS, sendPlausible } from '@/utils/plausible';
import {
	NoCreditsErrorListener,
	NoCreditsModal
} from '@/components/NoCreditsModal';
import { AUTH_MODAL_TYPES, setAuthModalOptions } from '@/store/auth';
import { useAuthMe } from '@/store/auth/selectors';
import { getValueIfRtl } from '@/utils/rtlStyle';
import { Preview } from './Preview';
import { Actions } from './Actions';
import { Toolbar } from './Toolbar';
import { ImagesStack } from './ImagesStack';
import { DownloadButton } from './DownloadButton';
import {
	ALL_CANVAS_WRAPPER_ID,
	CANVAS_WIDTH_MAX,
	MAX_ZOOM,
	MIN_ZOOM,
	BASE_BG_ID
} from './constants';
import { ToolbarMobile } from './ToolbarMobile';
import { FastCheckout } from './FastCheckout';
import { getDataToSave } from './utils';
import { ROLES } from '../users/constants';
import { useUserPermissions } from '../hooks/hooks';
import { UnsavedChangesModal } from './UnsavedChangesModal';
import ModalFullDiscount from './ModalFullDiscount';

export function Editor() {
	const {
		selectionView = false,
		editView,
		bulkMode,
		images = [],
		localFiles = [],
		selectedImage,
		removeBackground: { loading: removing = false } = {},
		init: { loading: fetching = false, data: initData } = {},
		downloadImage
	} = useSelector(state => state.editor);

	const { t } = useTranslation();
	const authMe = useSelector(useAuthMe);
	const loggedIn = useSelector(state => state.auth.loggedIn);
	const isSubscribed = useSubscribed();
	const containerRef = useRef(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const mdDown = useMedia('mdDown');
	const { pathname } = useLocation();
	const { redirectIfNoPermissions } = useUserPermissions();

	const [initialized, setInitialized] = useState(false);

	const currentImage = images.find(item => item.id === selectedImage) || {};

	const {
		settings = {},
		quality,
		resized,
		baseBackground = null
	} = currentImage;
	const {
		zoomLevel = 1,
		undoStack = [],
		redoStack = [],
		hasChanges
	} = settings || {};

	const [showOriginal, setShowOriginal] = useState(false);
	const [bulkDownloading, setBulkDownloading] = useState(false);
	const blocker = useBlocker(hasChanges);

	const disabledZoomOut = zoomLevel <= MIN_ZOOM || selectionView;
	const disabledZoomIn = zoomLevel > MAX_ZOOM || selectionView;

	const resizedUrl = getImageUrl(resized?.path);
	const disabledArrows = !(images.length > 1);

	const successImages = images.filter(item => !item.error && item.id);

	const bulkIds = successImages.map(item => item.id);

	const disabledBulk = !isSubscribed && loggedIn;
	const [bulkDisabledModalOpen, setBulkDisabledModalOpen] = useState(false);

	const isFastCheckout = [routes.fastCheckout].includes(pathname);

	const goPrev = () => {
		const currentIdx = images.findIndex(item => item.id === selectedImage);

		let prevIdx = currentIdx - 1;

		if (currentIdx < 1) {
			prevIdx = images.length - 1;
		}

		const prevImgId = images[prevIdx]?.id;

		dispatch(selectImage(prevImgId));
	};

	const goNext = () => {
		const currentIdx = images.findIndex(item => item.id === selectedImage);

		let nextIdx = 0;

		if (currentIdx < images.length - 1) {
			nextIdx = currentIdx + 1;
		}

		const nextImgId = images[nextIdx]?.id;

		dispatch(selectImage(nextImgId));
	};

	const undoFn = async () => {
		try {
			await dispatch(undo({ id: selectedImage })).unwrap();
		} catch (error) {
			showError(error);
		}
	};

	const redoFn = async () => {
		try {
			await dispatch(redo({ id: selectedImage })).unwrap();
		} catch (error) {
			showError(error);
		}
	};

	const onCenterImage = () => dispatch(centerImage());

	const zoomIn = () => {
		if (disabledZoomIn) return;

		dispatch(setZoom(settings.zoomLevel + 0.1));
	};

	const zoomOut = () => {
		if (disabledZoomOut) return;

		dispatch(setZoom(settings.zoomLevel - 0.1));
	};

	const onShowOriginalMouseDown = () => setShowOriginal(true);
	const onShowOriginalMouseUp = () => setShowOriginal(false);

	const download = (value = null) => {
		dispatch(setDownload(value));
	};

	const downloadBulk = async () => {
		try {
			setBulkDownloading(true);
			const response = await transactionModel.downloadBulk(bulkIds);
			const fileName = `remove-background-${uuid()}`;

			saveAs(new Blob([response]), `${fileName}.zip`);
		} catch (error) {
			showError(error);
		} finally {
			setBulkDownloading(false);
		}
	};

	const toggleBulk = evt => {
		if (!loggedIn || disabledBulk) {
			return setBulkDisabledModalOpen(true);
		}

		dispatch(setBulk(evt.target.checked));
	};

	const downloadBulkProps = {
		onDownload: downloadBulk,
		loading: bulkDownloading,
		disabled: !bulkIds.length
	};

	const dispatchSetAuthOptions = params =>
		dispatch(
			setAuthModalOptions({
				type: AUTH_MODAL_TYPES.FAST_SIGN_UP,
				editor: true,
				...params
			})
		);

	const downloadProps = {
		onDownload: async type => {
			if (!loggedIn && type === 'high') {
				const dataToSave = await getDataToSave(selectedImage, settings);
				await transactionModel.saveBGSettings(selectedImage, dataToSave);

				return;
			}

			sendPlausible(
				type === 'high'
					? PLAUSIBLE_EVENTS.clickHD
					: PLAUSIBLE_EVENTS.clickSD
			);

			download(type);
		},
		loading: !!downloadImage,
		disabled: removing,
		quality
	};

	useEffect(() => {
		(async () => {
			if (!initData && !removing && !localFiles.length && !editView) {
				await dispatch(init({ loggedIn })).unwrap();
			}

			setInitialized(true);
		})();

		return () => {
			dispatch(setEditView(false));
		};
	}, [removing, initData, localFiles]);

	useEffect(() => {
		if (
			initialized &&
			initData &&
			!fetching &&
			!removing &&
			!images.length &&
			!localFiles.length &&
			!isFastCheckout
		) {
			if (loggedIn) {
				navigate(routes.dashboard);
				return;
			}

			navigate(routes.upload);
		}
	}, [images, removing, loggedIn, fetching, initialized, isFastCheckout]);

	useEffect(() => {
		saveImage(selectedImage, currentImage);
	}, [currentImage]);

	useEffect(() => {
		if (loggedIn) {
			dispatch(fetchCredits());
		}
	}, [loggedIn]);

	useEffect(() => {
		return () => {
			dispatch(clearLocal());
		};
	}, []);

	useEffect(() => {
		(async () => {
			dispatch(updateBaseBg(null));

			if (selectedImage && resizedUrl) {
				let path = resizedUrl;

				try {
					const res = await fetch(resizedUrl);
					const blob = await res.blob();

					if (blob?.type?.includes('image/')) {
						path = URL.createObjectURL(blob);
					}
				} catch (e) {
					// eslint-disable-next-line no-console
					console.warn(e);
				}

				dispatch(updateBaseBg({ id: BASE_BG_ID, path }));
			}
		})();

		return () => {
			if (baseBackground) {
				URL.revokeObjectURL(baseBackground);
			}
		};
	}, [selectedImage]);

	useEffect(() => {
		if (authMe?.data?.role === ROLES.LIMITED) redirectIfNoPermissions();
	}, []);

	if (!removing && !images.length && !localFiles.length) {
		return (
			<>
				<FastCheckout />
				<ModalFullDiscount />
			</>
		);
	}

	return (
		<>
			{!loggedIn && (
				<Helmet defer={false}>
					<title>{t('seo.editorPublic.title')}</title>
				</Helmet>
			)}
			<NoCreditsErrorListener />
			<FastCheckout />
			<ModalFullDiscount />
			<NoCreditsModal
				open={bulkDisabledModalOpen}
				onClose={() => setBulkDisabledModalOpen(false)}
				title={t('editor.bulkDisabledModal.title')}
				description={t('editor.bulkDisabledModal.description')}
				onConfirm={event => {
					if (loggedIn) {
						return;
					}
					event.preventDefault();
					dispatchSetAuthOptions({
						scope: 'buyCredits'
					});
				}}
			/>
			<UnsavedChangesModal
				onConfirm={() => blocker.proceed()}
				onClose={() => blocker.reset()}
				open={blocker?.state === 'blocked'}
			/>
			<Stack pb={{ xs: 8.5, md: 0 }} width="100%">
				<Stack direction="row" alignItems="center" mb={3}>
					<Box sx={{ display: { xs: 'none', md: 'block' } }}>
						<FormGroup onChange={toggleBulk} value={bulkMode}>
							<FormControlLabel
								control={<Switch checked={bulkMode} />}
								label={t('editor.processInBulk')}
								sx={theme => ({
									ml: getValueIfRtl({ theme, value: 1 })
								})}
							/>
						</FormGroup>
						<MagicIcon color="primary" />
					</Box>
					<Box sx={{ display: { xs: 'block', md: 'none' } }}>
						<Stack
							direction="row"
							alignItems="center"
							justifyContent="center"
						>
							<Switch
								onChange={toggleBulk}
								checked={bulkMode}
								iconName="magic"
								iconColor={palette.primary.main}
							/>
							<Divider
								orientation="vertical"
								sx={{ height: 48, mr: 1.5 }}
							/>
							<ImagesStack />
						</Stack>
					</Box>
				</Stack>

				<Stack
					direction="row"
					spacing={2}
					width="100%"
					justifyContent={{
						xs: 'center',
						md: 'initial'
					}}
					maxWidth={{
						xs: 'unset',
						md: loggedIn ? '30vw' : 'unset',
						lg: 'unset'
					}}
					id={ALL_CANVAS_WRAPPER_ID}
					useFlexGap
				>
					<Stack
						gap={2}
						alignItems="center"
						justifyContent="center"
						sx={{ position: 'relative' }}
						ref={containerRef}
						width="100%"
						maxWidth={CANVAS_WIDTH_MAX}
					>
						{bulkMode && !mdDown && (
							<Stack
								sx={{
									position: 'absolute',
									top: 'calc(50% - 56px)',
									left: -73
								}}
							>
								<IconButton
									variant="outlined"
									color="secondary"
									onClick={goPrev}
									disabled={disabledArrows}
								>
									<ChevronLeftIcon fontSize="large" />
								</IconButton>
							</Stack>
						)}
						<Preview
							compare={showOriginal}
							currentImage={currentImage}
							initialComparePosition={isFastCheckout ? 0 : 100}
						/>
						{bulkMode && !mdDown && (
							<Stack
								sx={{
									position: 'absolute',
									top: 'calc(50% - 56px)',
									right: -73
								}}
							>
								<IconButton
									variant="outlined"
									color="secondary"
									onClick={goNext}
									disabled={disabledArrows}
								>
									<ChevronRightIcon fontSize="large" />
								</IconButton>
							</Stack>
						)}
						<Actions
							onZoomIn={zoomIn}
							onZoomOut={zoomOut}
							onUndo={undoFn}
							onRedo={redoFn}
							onShowOriginalMouseDown={onShowOriginalMouseDown}
							onShowOriginalMouseUp={onShowOriginalMouseUp}
							onCenterImage={onCenterImage}
							disabledZoomIn={disabledZoomIn}
							disabledZoomOut={disabledZoomOut}
							disabledUndo={undoStack.length < 2}
							disabledRedo={redoStack.length < 1}
							onDownload={download}
							downloadBulkProps={downloadBulkProps}
						/>
					</Stack>

					{!bulkMode && (
						<Box sx={{ display: { xs: 'none', md: 'block' } }}>
							<Stack spacing={2.25}>
								<Toolbar saveDisabled={removing} />
								<DownloadButton {...downloadProps} />
							</Stack>
						</Box>
					)}
				</Stack>
				<Box sx={{ display: { xs: 'none', md: 'block' } }}>
					<Box sx={{ mt: 4 }}>
						<ImagesStack />
					</Box>
				</Box>
				<Box sx={{ display: { xs: 'block', md: 'none' } }}>
					<ToolbarMobile
						downloadProps={downloadProps}
						downloadBulkProps={downloadBulkProps}
						goNext={goNext}
						goPrev={goPrev}
						disabledArrows={disabledArrows}
						saveDisabled={removing}
					/>
				</Box>
			</Stack>
		</>
	);
}
