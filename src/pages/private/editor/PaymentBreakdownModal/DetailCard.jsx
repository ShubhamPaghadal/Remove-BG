import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { Box, Collapse, Stack, Typography } from '@mui/material';
import { useMedia } from '@/hooks/responsive';
import {
	ChevronDownIcon,
	ChevronUpIcon,
	HomeStorageIcon,
	RemoveBgIcon,
	SupportIcon
} from '@/components/Icons';
import { IconButton } from '@/components/IconButton';

import DetailItem from './DetailItem';

const iconsMapping = {
	trial: RemoveBgIcon,
	service: SupportIcon,
	storage: HomeStorageIcon
};

function DetailCard({
	title,
	description,
	priceText,
	features = [],
	footerComponent = null,
	planKey
}) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const smDown = useMedia('smDown');

	const toggleOpen = () => setOpen(prevState => !prevState);

	const dropdownIcon = open ? (
		<ChevronUpIcon size={smDown ? 16 : 24} />
	) : (
		<ChevronDownIcon size={smDown ? 16 : 24} />
	);

	const IconComponent = planKey && iconsMapping[planKey];

	return (
		<Stack
			sx={{
				borderRadius: 2,
				border: '1px solid #E8E8E8',
				pt: { xs: 1.5, sm: 2 }
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'start',
					justifyContent: 'space-between',
					gap: { xs: 1, sm: 2 },
					px: { xs: 1.5, sm: 2 }
				}}
			>
				<Stack gap={0.5} maxWidth={{ xs: '360px', sm: 'initial' }}>
					{title && (
						<Typography variant="body1" fontWeight={700}>
							{title}
						</Typography>
					)}

					{description && (
						<Typography variant="body0" color="text.secondary">
							{description}
						</Typography>
					)}
				</Stack>

				{IconComponent && (
					<Box
						sx={{
							display: 'flex',
							height: { xs: 40, md: 48 },
							width: { xs: 40, md: 48 },
							flexShrink: 0,
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 1,
							background: '#F7F7F7',
							p: 1
						}}
						className=" rounded-sm bg-red-background p-2 text-red md:h-[48px] md:w-[48px]"
					>
						<IconComponent />
					</Box>
				)}
			</Box>

			<Collapse
				in={open}
				sx={{
					width: '100%',
					px: { xs: 1.5, sm: 2 }
				}}
			>
				<Stack
					sx={{
						gap: 1.5,
						mt: { xs: 1.5, sm: 2 }
					}}
				>
					{features?.length &&
						features.map((feature, index) => (
							<DetailItem key={`DetailItem--${index}`} {...feature} />
						))}
				</Stack>
			</Collapse>

			<Box
				sx={theme => ({
					display: 'flex',
					alignItems: 'center',
					width: '100%',
					justifyContent: 'space-between',
					borderTop: `1px solid ${theme.palette.divider}`,
					py: 1.5,
					px: 2,
					mt: { xs: 1.5, sm: open ? 2 : 1.5 }
				})}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 3
					}}
				>
					{priceText && (
						<Typography variant="body2" component="span" fontWeight={700}>
							{priceText}
						</Typography>
					)}

					{footerComponent}
				</Box>

				{smDown ? (
					<IconButton
						sx={{ width: 24, height: 24, borderRadius: 1 }}
						variant="outlined"
						color="primary"
						size="medium"
						onClick={toggleOpen}
					>
						{dropdownIcon}
					</IconButton>
				) : (
					<Button
						variant="text"
						sx={{
							height: 24,
							py: 0.5,
							px: 1.5,
							borderRadius: 1,
							color: 'text.primary'
						}}
						onClick={toggleOpen}
						endIcon={dropdownIcon}
					>
						<Typography component="span" variant="body0" fontWeight={500}>
							{t('paymentBreakdown.details')}
						</Typography>
					</Button>
				)}
			</Box>
		</Stack>
	);
}

export default DetailCard;
