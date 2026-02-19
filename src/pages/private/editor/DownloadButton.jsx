import {
	Box,
	CircularProgress,
	Menu,
	MenuItem,
	Stack,
	Typography
} from '@mui/material';
import { useSubscribed } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from '@/components/Button';
import { useState } from 'react';
import { useMedia } from '@/hooks/responsive';
import { MenuItemFlag } from '@/components/MenuItemFlag';
import { ChevronDownIcon, DownloadIcon } from '@/components/Icons';
import { PLAUSIBLE_EVENTS, sendPlausible } from '@/utils/plausible';
import { showNoCredits } from '@/components/NoCreditsModal/utils';

import { getLowImageSize } from './utils';
import { useAvailableCredits } from './hooks';
import { SignUpMenu } from './SignUpMenu';

export function DownloadButton({
	onDownload,
	loading,
	disabled,
	showResolution = true,
	buttonProps = {},
	quality
}) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [signUpAnchor, setSignUpAnchor] = useState(null);
	const { t } = useTranslation();
	const mdDown = useMedia('mdDown');
	const isSubscribed = useSubscribed();
	const { loggedIn } = useSelector(state => state.auth);
	const { availableCredits } = useAvailableCredits();
	const imageSize = showResolution
		? useSelector(state => state.editor.imageSize)
		: null;

	const lowImageSize = imageSize && getLowImageSize(imageSize);

	const openDropdown = Boolean(anchorEl);

	const handleOpenDropdown = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseDropdown = () => {
		setAnchorEl(null);
	};

	const downloadOptions = [
		{ label: t('common.lowQuality'), value: 'low' },
		{
			label: t('common.highQuality'),
			value: 'high',
			endFlag: <MenuItemFlag text="HD" />,
			disabled: quality !== 'high'
		}
	];

	const resolutionTexts = imageSize
		? {
				low: lowImageSize
					? ` (${lowImageSize.width} x ${lowImageSize.height} px)`
					: '',
				high: imageSize
					? ` (${imageSize.width} x ${imageSize.height} px)`
					: ''
			}
		: null;

	return (
		<Box>
			<Button
				variant="contained"
				color="primary"
				endIcon={<ChevronDownIcon />}
				onClick={event => {
					if (isSubscribed || availableCredits) {
						return handleOpenDropdown(event);
					}

					if (loggedIn) {
						return showNoCredits();
					}

					setSignUpAnchor(event.currentTarget);
					sendPlausible(PLAUSIBLE_EVENTS.download);
					onDownload('high');
				}}
				disabled={disabled || loading}
				fullWidth
				sx={theme => ({
					height: 40,
					justifyContent: 'center',
					'&& svg': {
						fontSize: 24
					},
					'&& .MuiButton-endIcon': {
						marginInlineStart: 1,
						marginInlineEnd: -1
					},
					[theme.breakpoints.up('md')]: {
						'&& .MuiButton-endIcon': {
							position: 'absolute',
							insetInlineEnd: 16,
							marginInlineEnd: 0
						}
					}
				})}
				{...buttonProps}
			>
				<Box component="span" />
				<Stack component="span" direction="row" alignItems="center">
					{loading ? (
						<CircularProgress
							size={18}
							sx={{ mr: 1.75 }}
							color="inherit"
						/>
					) : (
						<DownloadIcon sx={{ marginInlineEnd: 1 }} />
					)}
					{t('common.download')}
				</Stack>
			</Button>
			<Menu
				open={openDropdown}
				anchorEl={anchorEl}
				onClose={handleCloseDropdown}
				anchorOrigin={{
					vertical: mdDown ? 'top' : 'bottom',
					horizontal: 'left'
				}}
				sx={{
					'&& .MuiPaper-root': {
						width: mdDown ? 150 : anchorEl?.clientWidth || '100%',
						maxWidth: 210,
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
					({ label, value: optionValue, endFlag, ...restOptProps }) => (
						<MenuItem
							key={optionValue}
							{...restOptProps}
							onClick={() => {
								sendPlausible(
									optionValue === 'high'
										? PLAUSIBLE_EVENTS.clickHD
										: PLAUSIBLE_EVENTS.clickSD
								);

								onDownload(optionValue);
								handleCloseDropdown();
							}}
						>
							<Stack>
								<Typography
									variant="body0"
									fontSize={15}
									fontWeight={700}
								>
									{label}
								</Typography>
								{resolutionTexts && (
									<Typography
										variant="body0"
										fontSize={10}
										color="text.secondary"
									>
										{resolutionTexts[optionValue] || ''}
									</Typography>
								)}{' '}
							</Stack>
							{endFlag}
						</MenuItem>
					)
				)}
			</Menu>
			<SignUpMenu
				open={!!signUpAnchor}
				anchorEl={signUpAnchor}
				onClose={() => {
					setSignUpAnchor(null);
				}}
			/>
		</Box>
	);
}
