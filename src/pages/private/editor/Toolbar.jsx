import { Path } from 'fabric';
import { useState, useEffect, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import trimIcon from '@/images/trim_icon.svg';
/* import { saveAs } from 'file-saver'; */
import { showError, showSuccess, debounce } from '@/utils';
import {
	Box,
	ButtonGroup,
	CardActions,
	CircularProgress,
	FormControlLabel,
	FormGroup,
	Stack,
	Tab,
	Tabs,
	Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import transactionModel from '@/models/transaction';

import { useVips } from '@/hooks/vips';

import {
	centerImage,
	saveInStack,
	setActiveBlur,
	setBackgroundColor,
	setBackgroundImg,
	setBlur,
	setBrushSize,
	// setMagicBrush,
	setSection,
	setSubSection,
	setTab,
	updateImageHasChanges
} from '@/store/editor';
import { Slider } from '@/components/Slider';
import { useMedia } from '@/hooks/responsive';
import { Switch } from '@/components/Switch';
import { applyBrush, resetImage } from '@/store/editor/thunks';
import { getErrorParams } from '@/utils/transaction';
import { Tooltip } from '@/components/Tooltip';
import { defaultSettings } from '@/store/editor/utils';
import { BrushIcon, DeleteIcon, SelectIcon } from '@/components/Icons';
import { IconButton } from '@/components/IconButton';

import { getValueIfRtl } from '@/utils/rtlStyle';
import { ColorSelector } from './ColorSelector';
import { BackgroundSelector } from './BackgroundSelector';

import { getBoundingBox, getDataToSave, pathToSvg, svgToPng } from './utils';
import { AvailableCredits } from './AvailableCredits';
import { BLUR_MAX_VALUE } from './constants';
import SamContext from './sam/createContext';
import SubSectionTab from './SubSectionTab';

export function Toolbar({
	handleCloseToolbar = () => {},
	saveDisabled = false
}) {
	const [doneLoading, setDoneLoading] = useState(false);
	const [samRemoveLoading, setSamRemoveLoading] = useState(false);
	const loggedIn = useSelector(state => state.auth.loggedIn);

	const {
		selectedImage,
		section,
		tab,
		subsection,
		images = [],
		resetImage: { loading: resetLoading = false } = {}
	} = useSelector(state => state.editor);
	const mdDown = useMedia('mdDown');

	const {
		maskSvgData: [, setMaskSvgData],
		fixedSvgData: [fixedSvgData, setFixedSvgData],
		embedding: [embeddingLoading]
	} = useContext(SamContext);

	const currentImage = images.find(item => item.id === selectedImage) || {};

	const { settings = {} } = currentImage;
	const {
		activeBlur,
		blur = defaultSettings.blur,
		/* magicBrush, */
		brushSize,
		backgroundColor,
		background
	} = settings || {};

	const [inputBlurValue, setInputBlurValue] = useState(blur);

	const { enabled: vipsEnabled } = useVips();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { t } = useTranslation();

	const handleChangeTabs = (_, newValue) => {
		dispatch(setSection(newValue));
	};

	const handleChangeSubTabs = (_, newValue) => {
		dispatch(setSubSection(newValue));
	};

	const handleChangeBgTabs = newValue => {
		dispatch(setTab(newValue));
	};

	/*
	const toggleMagicBrush = evt => {
		dispatch(setMagicBrush(evt.target.checked));
	};
	*/

	const onSetBrushSize = evt => {
		dispatch(setBrushSize(evt.target.value));
	};

	const toggleBlur = evt => {
		dispatch(setActiveBlur(evt.target.checked));

		const checkedValue = evt?.target?.checked;

		const settingsToSave = {
			activeBlur: checkedValue
		};

		if (!checkedValue && background === 'base') {
			dispatch(setBackgroundImg(null));

			settingsToSave.background = null;
		}

		dispatch(
			saveInStack({
				settings: settingsToSave
			})
		);
	};

	const onSetBlurValue = useCallback(
		debounce(value => {
			dispatch(setBlur(value));
			dispatch(
				saveInStack({
					settings: {
						blur: value
					}
				})
			);
		}, 200),
		[setBlur, saveInStack, dispatch]
	);

	const onChangeBlur = evt => {
		const { value } = evt.target;

		setInputBlurValue(value);
	};

	const handleReset = async () => {
		try {
			await dispatch(resetImage(selectedImage)).unwrap();
			dispatch(centerImage());
			dispatch(saveInStack());
			dispatch(updateImageHasChanges(false));
		} catch (error) {
			showError(...getErrorParams(error, t, navigate));
		}
	};

	const handleDone = async () => {
		try {
			setDoneLoading(true);

			const dataToSave = await getDataToSave(selectedImage, settings);

			await transactionModel.saveBGSettings(selectedImage, dataToSave);
			dispatch(updateImageHasChanges(false));

			if (mdDown && section === 'actions') {
				dispatch(setSection('bg'));
			}

			showSuccess(t('editor.toolbar.saveSuccess'));
		} catch (error) {
			showError(...getErrorParams(error, t, navigate));
		} finally {
			setDoneLoading(false);
			handleCloseToolbar();
		}
	};

	const handleSamDelete = async () => {
		setSamRemoveLoading(true);

		try {
			const { pathData, width, height, bounds, originalWidth } =
				fixedSvgData;

			const scaleFactor = originalWidth / width;

			const { topLeft = { x: 0, y: 0 } } = bounds || {};

			const bgColor = '#ffffff';
			const pathColor = '#000000';

			const path = new Path(pathData, {
				top: topLeft?.y,
				left: topLeft?.x,
				stroke: pathColor,
				selectable: false
			});

			path.setCoords();

			const boundingBox = getBoundingBox(path, scaleFactor);

			const svg = pathToSvg(path, {
				width,
				height,
				backgroundColor: bgColor
			});

			const blob = await svgToPng(
				svg,
				width * scaleFactor,
				height * scaleFactor,
				scaleFactor,
				false
			);

			const file = await blob.arrayBuffer();

			/* saveAs(blob, 'imagen-descargada.png'); */

			setMaskSvgData(null);
			setFixedSvgData(null);

			await dispatch(
				applyBrush({
					type: tab,
					id: selectedImage,
					file,
					boundingBox
				})
			).unwrap();

			showSuccess(t('editor.toolbar.segment.deleteSuccess'));
		} catch (error) {
			showError(error);

			return null;
		} finally {
			setSamRemoveLoading(false);
		}
	};

	useEffect(() => {
		onSetBlurValue(inputBlurValue);
	}, [inputBlurValue]);

	useEffect(() => {
		setInputBlurValue(blur);
	}, [selectedImage]);

	const bgTabs = [
		{
			id: 0,
			label: t('editor.toolbar.backgroundTabs.photo'),
			value: 'photo'
		},
		{
			id: 1,
			label: t('editor.toolbar.backgroundTabs.color'),
			value: 'color'
		},
		{
			id: 2,
			label: t('editor.toolbar.backgroundTabs.blur'),
			value: 'blur'
		}
	];

	const brushTabs = [
		{
			id: 0,
			label: t('editor.toolbar.actionsTabs.erase'),
			value: 'erase'
		},
		{
			id: 1,
			label: t('editor.toolbar.actionsTabs.restore'),
			value: 'restore'
		},
		{
			id: 2,
			label: t('editor.toolbar.actionsTabs.trim'),
			value: 'trim'
		}
	];

	const segmentRender = embeddingLoading ? (
		<Box
			sx={{
				width: '100%',
				height: 'auto',
				minHeight: 94,
				background: 'white',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				gap: '12px'
			}}
		>
			<CircularProgress />
			<Typography
				variant="body0"
				sx={{ whiteSpace: 'pre-line' }}
				color="primary.main"
				textAlign="center"
			>
				{t('editor.toolbar.segment.loading')}
			</Typography>
		</Box>
	) : (
		<Stack
			alignItems="center"
			gap={2}
			sx={{
				position: 'relative',
				display: 'flex',
				flexDirection: {
					xs: 'row',
					md: 'column'
				},
				justifyContent: {
					xs: 'space-between',
					md: 'initial'
				}
			}}
		>
			<Typography
				variant={mdDown ? 'body0' : 'body1'}
				textAlign={{ xs: 'left', md: 'center' }}
				color="text.secondary"
				sx={{
					px: { xs: 0, md: 3 },
					minWidth: { xs: 180, md: 'initial' }
				}}
			>
				{t('editor.toolbar.segment.description')}
			</Typography>
			{mdDown ? (
				<IconButton
					variant="outlined"
					onClick={handleSamDelete}
					disabled={!fixedSvgData || samRemoveLoading}
					loading={samRemoveLoading}
				>
					<DeleteIcon />
				</IconButton>
			) : (
				<Button
					variant="outlined"
					onClick={handleSamDelete}
					disabled={!fixedSvgData || samRemoveLoading}
					loading={samRemoveLoading}
				>
					{t('editor.toolbar.segment.action')}
				</Button>
			)}
		</Stack>
	);

	return (
		<Card
			variant="outlined"
			sx={theme => ({
				display: 'flex',
				flexDirection: 'column',
				minHeight: 485,
				height: '100%',
				width: 350,
				position: 'relative',
				overflow: 'visible',

				[theme.breakpoints.down('md')]: {
					width: '100%',
					height: 320,
					minHeight: 'initial',
					borderRadius: '12px 12px 0 0'
				}
			})}
		>
			{loggedIn && !mdDown && <AvailableCredits />}
			<Tabs
				value={section}
				centered
				sx={{ pt: { xs: 0, md: 1 }, maxHeight: { xs: 48, md: 'inherit' } }}
				onChange={handleChangeTabs}
			>
				<Tab value="bg" label={t('editor.toolbar.background')} />
				<Tab value="actions" label={t('editor.toolbar.actions')} />
			</Tabs>
			{section === 'bg' ? (
				<Box
					sx={{
						bgcolor: '#f7f7f7',
						flex: 1,
						p: 2.5,
						pr: 1,
						pt: { xs: 1.5, md: 2.5 },
						pb: { xs: 1, md: 2.5 },
						maxHeight: { xs: 'initial', md: 'calc(100% - 134px)' }
					}}
				>
					<ButtonGroup
						fullWidth
						sx={theme => ({
							width: '100%',
							pr: 1.5,
							'.MuiButtonGroup-firstButton': {
								borderTopLeftRadius: getValueIfRtl({
									theme,
									value: 0,
									defaultValue: '12px'
								}),
								borderBottomLeftRadius: getValueIfRtl({
									theme,
									value: 0,
									defaultValue: '12px'
								}),
								borderTopRightRadius: getValueIfRtl({
									theme,
									value: '12px',
									defaultValue: 0
								}),
								borderBottomRightRadius: getValueIfRtl({
									theme,
									value: '12px',
									defaultValue: 0
								})
							},
							'.MuiButtonGroup-lastButton': {
								borderTopLeftRadius: getValueIfRtl({
									theme,
									value: '12px',
									defaultValue: 0
								}),
								borderBottomLeftRadius: getValueIfRtl({
									theme,
									value: '12px',
									defaultValue: 0
								}),
								borderTopRightRadius: getValueIfRtl({
									theme,
									value: 0,
									defaultValue: '12px'
								}),
								borderBottomRightRadius: getValueIfRtl({
									theme,
									value: 0,
									defaultValue: '12px'
								})
							}
						})}
					>
						{!!bgTabs.length &&
							bgTabs.map(item => {
								const isSelected = item.value === tab;

								return (
									<Button
										key={item.id}
										className={isSelected ? 'selected' : ''}
										onClick={() => handleChangeBgTabs(item.value)}
										sx={{ flex: 1, height: 40 }}
									>
										{item.label}
									</Button>
								);
							})}
					</ButtonGroup>
					{tab === 'photo' && (
						<BackgroundSelector
							handleChange={val => {
								dispatch(setBackgroundImg(val));
								dispatch(
									saveInStack({
										settings: {
											backgroundColor: null,
											background: val,
											activeBlur,
											blur
										}
									})
								);
							}}
							value={background}
						/>
					)}
					{tab === 'color' && (
						<ColorSelector
							handleChange={val => {
								dispatch(setBackgroundColor(val));
								dispatch(
									saveInStack({
										settings: {
											backgroundColor: val || null,
											background: null,
											activeBlur: false
										}
									})
								);
							}}
							value={backgroundColor}
						/>
					)}
					{tab === 'blur' && (
						<Stack
							p={2}
							pt={{ xs: 2, md: 3 }}
							pb={{ xs: 0, md: 2 }}
							alignItems="flex-start"
							spacing={1}
						>
							<FormGroup
								onChange={toggleBlur}
								value={activeBlur}
								sx={{ flexDirection: 'row', alignItems: 'center' }}
							>
								<FormControlLabel
									control={
										<Switch
											checked={activeBlur}
											disabled={!vipsEnabled}
										/>
									}
									label={t('editor.toolbar.blur')}
								/>
								{!vipsEnabled && (
									<Tooltip
										icon
										iconSx={{ marginLeft: '-8px' }}
										title={t('editor.toolbar.disabledBlurTooltip')}
									/>
								)}
							</FormGroup>
							<Box width="100%">
								<Typography variant="body1">
									{t('editor.toolbar.blurAmount')}
								</Typography>
								<Slider
									max={BLUR_MAX_VALUE}
									valueLabelDisplay="auto"
									onChange={onChangeBlur}
									value={inputBlurValue}
									defaultValue={blur}
									disabled={!activeBlur}
									sx={{ py: 2.5 }}
								/>
							</Box>
						</Stack>
					)}
				</Box>
			) : (
				<Box
					sx={{
						bgcolor: '#f7f7f7',
						flex: 1,
						p: 2
					}}
				>
					<ButtonGroup
						fullWidth
						sx={theme => ({
							width: '100%',
							'.MuiButtonGroup-firstButton': {
								borderTopLeftRadius: getValueIfRtl({
									theme,
									value: 0,
									defaultValue: '12px'
								}),
								borderBottomLeftRadius: getValueIfRtl({
									theme,
									value: 0,
									defaultValue: '12px'
								}),
								borderTopRightRadius: getValueIfRtl({
									theme,
									value: '12px',
									defaultValue: 0
								}),
								borderBottomRightRadius: getValueIfRtl({
									theme,
									value: '12px',
									defaultValue: 0
								})
							},
							'.MuiButtonGroup-lastButton': {
								borderTopLeftRadius: getValueIfRtl({
									theme,
									value: '12px',
									defaultValue: 0
								}),
								borderBottomLeftRadius: getValueIfRtl({
									theme,
									value: '12px',
									defaultValue: 0
								}),
								borderTopRightRadius: getValueIfRtl({
									theme,
									value: 0,
									defaultValue: '12px'
								}),
								borderBottomRightRadius: getValueIfRtl({
									theme,
									value: 0,
									defaultValue: '12px'
								})
							}
						})}
					>
						{!!brushTabs.length &&
							brushTabs.map(item => {
								const isSelected = item.value === tab;

								return (
									<Button
										key={item.id}
										className={isSelected ? 'selected' : ''}
										onClick={() => handleChangeBgTabs(item.value)}
										sx={{ flex: 1, height: 40 }}
										startIcon={item.startIcon || null}
									>
										{item.label}
									</Button>
								);
							})}
					</ButtonGroup>
					{['erase', 'restore'].includes(tab) ? (
						<Box>
							{tab === 'erase' ? (
								<Stack
									sx={{
										mt: { xs: 1.5, md: 3 },
										borderRadius: 2,
										minHeight: { xs: 120, md: 220 },
										p: 1.5,
										gap: 2,
										background: ({ palette }) =>
											palette.background.paper,
										boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.15)'
									}}
								>
									<Box
										display="flex"
										borderRadius={2}
										overflow="hidden"
										sx={{
											border: `1px solid #E8E8E8`
										}}
									>
										<SubSectionTab
											selected={subsection === 'brush'}
											icon={<BrushIcon />}
											onClick={evt =>
												handleChangeSubTabs(evt, 'brush')
											}
											label={t(
												'editor.toolbar.subsectionTabs.brush'
											)}
										/>
										<SubSectionTab
											selected={subsection === 'segment'}
											icon={<SelectIcon />}
											onClick={evt =>
												handleChangeSubTabs(evt, 'segment')
											}
											label={t(
												'editor.toolbar.subsectionTabs.segment'
											)}
										/>
									</Box>
									{subsection === 'segment' ? (
										segmentRender
									) : (
										<Stack
											p={{ xs: 0, md: 2 }}
											pt={{ xs: 0, md: 3 }}
											alignItems="flex-start"
											spacing={1}
										>
											<Box
												width="100%"
												sx={{
													display: 'flex',
													alignItems: 'center',
													flexDirection: {
														xs: 'row',
														md: 'column'
													},
													gap: { xs: 1.5, md: 0 }
												}}
											>
												<Typography
													variant="body1"
													sx={{
														minWidth: { xs: 100, md: 'initial' }
													}}
												>
													{t('editor.toolbar.brushSize')}
												</Typography>
												<Slider
													valueLabelDisplay="auto"
													onChange={onSetBrushSize}
													min={1}
													value={brushSize}
													defaultValue={brushSize}
												/>
											</Box>
											{/* <FormGroup onChange={toggleMagicBrush} value={magicBrush}>
											<FormControlLabel
												control={<Switch defaultChecked={magicBrush} />}
												label={t('editor.toolbar.magicBrush')}
												/>
											</FormGroup> */}
										</Stack>
									)}
								</Stack>
							) : (
								<Stack p={2} pt={3} alignItems="flex-start" spacing={1}>
									<Box width="100%">
										<Typography variant="body1">
											{t('editor.toolbar.brushSize')}
										</Typography>
										<Slider
											valueLabelDisplay="auto"
											onChange={onSetBrushSize}
											min={1}
											value={brushSize}
											defaultValue={brushSize}
										/>
									</Box>
									{/* <FormGroup onChange={toggleMagicBrush} value={magicBrush}>
							<FormControlLabel
								control={<Switch defaultChecked={magicBrush} />}
								label={t('editor.toolbar.magicBrush')}
								/>
							</FormGroup> */}
								</Stack>
							)}
						</Box>
					) : (
						<Box py={{ xs: 4, md: 6 }}>
							<Box display="flex" gap={2}>
								<Box>
									<Box component="img" src={trimIcon} />
								</Box>
								<Typography
									variant="body1"
									color="text.secondary"
									fontWeight={500}
								>
									{t('editor.toolbar.trimDescription')}
								</Typography>
							</Box>
						</Box>
					)}
				</Box>
			)}

			<CardActions
				sx={theme => ({
					py: 2,
					justifyContent: 'end',

					[theme.breakpoints.down('md')]: {
						py: 1,
						px: 2.5,
						justifyContent: 'space-between'
					}
				})}
			>
				<Button
					color="secondary"
					onClick={handleReset}
					loading={resetLoading}
				>
					{t('common.reset')}
				</Button>
				<Button
					variant={mdDown ? 'text' : 'contained'}
					color="primary"
					onClick={handleDone}
					loading={doneLoading}
					disabled={saveDisabled}
				>
					{t('common.save')}
				</Button>
			</CardActions>
		</Card>
	);
}
