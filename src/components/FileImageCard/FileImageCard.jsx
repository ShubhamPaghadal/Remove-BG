import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editImage } from '@/store/editor/thunks';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useSubscribed } from '@/hooks';
import routes from '@/routes';
import {
	Box,
	CircularProgress,
	Menu,
	MenuItem,
	Stack,
	Typography,
	useMediaQuery
} from '@mui/material';
import { getGridBackgroundStyles, downloadImage, showError } from '@/utils';
import transactionModel from '@/models/transaction';
import { InfoIcon } from '@/components/Icons/InfoIcon';
import { MenuItemFlag } from '@/components/MenuItemFlag';

import { useMedia } from '@/hooks/responsive';
import { getErrorParams } from '@/utils/transaction';

import { PLAUSIBLE_EVENTS, sendPlausible } from '@/utils/plausible';
import { useAuthMe } from '@/store/auth/selectors';
import { useAvailableCredits } from '@/pages/private/editor/hooks';
import { useUserPermissions } from '@/pages/private/hooks/hooks';

import { getValueIfRtl } from '@/utils/rtlStyle';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { ChevronDownIcon, DeleteIcon, DownloadIcon, EditIcon } from '../Icons';
import { getImageCardUrl, getQualityTag, trimFileName } from './utils';
import { Timer } from './Timer';
import { TimerTooltip } from './TimerTooltip';
import QualityChip from './QualityChip';
import { showNoCredits } from '../NoCreditsModal/utils';

const GRID_SIZE_LG = 388;
const GRID_SIZE_MD = 320;
const LIST_SIZE = 80;

export function FileImageCard({
	view = 'list',
	name,
	transaction,
	onDelete,
	sx,
	downloadCallback = () => {}
}) {
	const smDown = useMedia('smDown');
	const mdDown = useMedia('mdDown');
	const down1130 = useMediaQuery('(max-width: 1130px)');

	const isSubscribed = useSubscribed();
	const { availableCredits } = useAvailableCredits();

	const { id, pipeline } = transaction;
	const { t } = useTranslation();
	const [fetchingImage, setFetchingImage] = useState(false);
	const imageUrl = getImageCardUrl(transaction);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const authMe = useSelector(useAuthMe);
	const { getIsAdminOrOwner } = useUserPermissions();

	const qualityTag = getQualityTag(transaction.pipeline);
	const imageStyles = imageUrl
		? {
				backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center'
			}
		: {};

	const gridFileNameMaxLength = mdDown ? 30 : 35;
	const listFileNameMaxLength = mdDown ? 14 : 19;
	const isAdminOrOwner = getIsAdminOrOwner();
	const canDelete = isAdminOrOwner || authMe.data?.deletePermission;
	const canEdit = isAdminOrOwner || authMe.data?.editPermission;
	const openDropdown = Boolean(anchorEl);

	const handleOpenDropdown = event => {
		if (isSubscribed || availableCredits) {
			return setAnchorEl(event.currentTarget);
		}

		showNoCredits();
	};
	const handleCloseDropdown = () => {
		setAnchorEl(null);
	};
	async function handleDownload(quality) {
		try {
			sendPlausible(
				quality === 'high'
					? PLAUSIBLE_EVENTS.clickHD
					: PLAUSIBLE_EVENTS.clickSD
			);

			setFetchingImage(true);
			await downloadImage(
				transactionModel.downloadUrl(id, quality),
				transaction.originalFileName
			);

			/**
			 * this setTimeout is needed because mobile devices may
			 * pop a confirmation dialog on downloads, blocking the
			 * browser and causing fetch failures.
			 */
			// eslint-disable-next-line no-promise-executor-return
			await new Promise(resolve => setTimeout(resolve, 100));
			downloadCallback(quality);
		} catch (error) {
			showError(...getErrorParams(error, t, navigate));
		} finally {
			setFetchingImage(false);
		}
	}

	const downloadOptions = [
		{ label: t('common.lowQuality'), value: 'low' },
		{
			label: t('common.highQuality'),
			value: 'high',
			disabled: transaction.quality !== 'high',
			endFlag: <MenuItemFlag text="HD" />
		}
	];

	const actions = (
		<Stack direction="row" alignItems="center" spacing={1} useFlexGap>
			<IconButton
				disabled={!canDelete}
				variant="outlined"
				onClick={onDelete}
			>
				<DeleteIcon />
			</IconButton>
			<IconButton
				disabled={!canEdit}
				variant="outlined"
				onClick={async () => {
					try {
						await dispatch(editImage(id)).unwrap();
						navigate(routes.editor);
					} catch (error) {
						showError(error);
					}
				}}
			>
				<EditIcon />
			</IconButton>
			<>
				{smDown ? (
					<IconButton
						variant="contained"
						disabled={!pipeline?.transformed?.path || fetchingImage}
						onClick={handleOpenDropdown}
						sx={{ width: 42, height: 42 }}
					>
						{fetchingImage ? (
							<CircularProgress size={20} />
						) : (
							<DownloadIcon />
						)}
					</IconButton>
				) : (
					<Box>
						<Button
							variant="contained"
							startIcon={<DownloadIcon />}
							endIcon={<ChevronDownIcon />}
							disabled={!pipeline?.transformed?.path}
							loading={fetchingImage}
							onClick={handleOpenDropdown}
							sx={theme => ({
								'&& svg': {
									fontSize: 24
								},
								textWrap: 'nowrap',
								gap: getValueIfRtl({ theme, value: 1 })
							})}
						>
							{t('common.download')}
						</Button>
					</Box>
				)}
				<Menu
					open={openDropdown}
					anchorEl={anchorEl}
					onClose={handleCloseDropdown}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left'
					}}
					sx={{
						'&& .MuiPaper-root': {
							width: smDown ? 130 : anchorEl?.clientWidth || 169,
							maxWidth: 164,
							marginTop: 1,
							border: '1px solid #E8E8E8'
						},

						'&& .MuiMenuItem-root': {
							py: { xs: 1, sm: 0 },
							pl: 1,
							pr: 0.5,
							minHeight: 24,
							display: 'flex',
							justifyContent: 'space-between',

							'&:hover': {
								backgroundColor: '#F3EFFF'
							}
						}
					}}
				>
					{downloadOptions.map(
						({ label, value: optionValue, endFlag, disabled }) => (
							<MenuItem
								disabled={disabled}
								key={optionValue}
								onClick={() => {
									handleDownload(optionValue);
									handleCloseDropdown();
								}}
							>
								<Typography variant="body0" fontSize={15}>
									{label}
								</Typography>
								{endFlag}
							</MenuItem>
						)
					)}
				</Menu>
			</>
		</Stack>
	);

	switch (view) {
		case 'grid':
			return (
				<Box
					height="auto"
					width={down1130 ? GRID_SIZE_MD : GRID_SIZE_LG}
					sx={{ position: 'relative' }}
				>
					{qualityTag && (
						<QualityChip size="medium" quality={qualityTag} />
					)}
					<Box
						sx={{
							position: 'absolute',
							top: 20,
							right: 20,
							zIndex: 2,
							backgroundColor: 'white',
							borderRadius: '4px',
							width: '61px',
							height: '32px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<Timer
							tooltip
							createdAt={transaction.createdAt}
							sx={{
								fontSize: 16,
								fontWeight: 700,
								'&:hover': {
									cursor: 'help'
								}
							}}
						/>
					</Box>
					<Box sx={{ ...getGridBackgroundStyles(10) }}>
						<Box
							borderRadius={2}
							overflow="hidden"
							position="relative"
							height={down1130 ? GRID_SIZE_MD : GRID_SIZE_LG}
							width="100%"
							sx={{
								...sx,
								...imageStyles,
								border: '2px solid transparent',
								'&:hover': {
									borderColor: ({ palette }) => palette.primary.main
								}
							}}
						>
							<Box
								bgcolor="common.white"
								position="absolute"
								bottom={({ spacing }) => spacing(2.5)}
								left="50%"
								p={1}
								borderRadius={3}
								sx={{
									transform: 'translateX(-50%)'
								}}
							>
								{actions}
							</Box>
						</Box>
					</Box>
					<Box mt={2}>
						{name && (
							<Typography variant="body1" fontWeight="semi">
								{trimFileName(name, gridFileNameMaxLength)}
							</Typography>
						)}
						<Typography
							variant="body0"
							color="text.secondary"
							fontWeight="medium"
							mt={name ? 0.5 : undefined}
						>
							{t('common.createdAt', {
								value: dayjs.unix(transaction.createdAt).format('ll')
							})}
						</Typography>
					</Box>
				</Box>
			);
		case 'list':
		default:
			return (
				<Stack
					alignItems="center"
					direction="row"
					justifyContent="space-between"
					py={2}
					spacing={5}
				>
					<Stack
						direction="row"
						alignItems={smDown ? 'start' : 'center'}
						spacing={3}
						useFlexGap
					>
						<Box
							height={LIST_SIZE}
							width={LIST_SIZE}
							sx={{
								...getGridBackgroundStyles(5)
							}}
						>
							<Box
								borderRadius={2}
								height="100%"
								width="100%"
								sx={{
									...imageStyles,
									backgroundRepeat: 'no-repeat'
								}}
							/>
						</Box>
						<Box sx={{ display: 'grid', gap: 0.5 }}>
							{name && (
								<Typography variant="body1" fontWeight="semi">
									{trimFileName(name, listFileNameMaxLength)}
								</Typography>
							)}
							<Typography
								variant="body0"
								color="text.secondary"
								fontWeight="medium"
								sx={{
									mt: name ? 0.5 : undefined
								}}
							>
								{t('common.createdAt', {
									value: dayjs.unix(transaction.createdAt).format('ll')
								})}
							</Typography>
							<Typography
								variant="body0"
								color="text.secondary"
								fontWeight="medium"
								sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
							>
								{t('myImages.timeRemaining')}{' '}
								<Timer
									component="span"
									variant="body0"
									fontWeight="medium"
									createdAt={transaction.createdAt}
								/>
								<TimerTooltip>
									<InfoIcon sx={{ fontSize: 12 }} />
								</TimerTooltip>
							</Typography>
							{qualityTag && (
								<Box display="flex">
									<QualityChip size="small" quality={qualityTag} />
								</Box>
							)}

							{smDown && <Box mt={1.5}>{actions}</Box>}
						</Box>
					</Stack>

					{!smDown && actions}
				</Stack>
			);
	}
}
