import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Box,
	FormControlLabel,
	RadioGroup,
	Stack,
	Typography
} from '@mui/material';
import { Radio } from '../Radio';
import { Button } from '../Button';

const MAX_ITEMS_COLLAPSED = 4;

const fontSizes = {
	small: { xs: 12, sm: 14 },
	medium: { xs: 14, sm: 16 }
};

const aligns = {
	left: 'flex-start',
	center: 'center',
	right: 'flex-end'
};

export function RadioGroupList({
	ariaLabelledby,
	options: optionsProp = [],
	name,
	size = 'medium',
	maxItemsCollapsed = MAX_ITEMS_COLLAPSED,
	seeMoreAlign = 'center',
	showSeeMore = true,
	value,
	sx,
	showMobileDivider,
	...props
}) {
	const [collapsed, setCollapsed] = useState(true);
	const { t } = useTranslation();

	const options = useMemo(() => {
		if (!showSeeMore) return optionsProp;
		if (collapsed) return optionsProp.slice(0, maxItemsCollapsed);

		return optionsProp;
	}, [optionsProp, collapsed]);

	useEffect(() => {
		if (!collapsed) {
			return;
		}
		if (
			optionsProp
				.slice(maxItemsCollapsed)
				.find(option => option.id === value)
		) {
			setCollapsed(false);
		}
	}, [optionsProp.length]);

	return (
		<Box sx={sx}>
			<RadioGroup
				aria-labelledby={ariaLabelledby}
				name={name}
				value={value || ''}
				{...props}
			>
				{options.map(({ id, label, rightLabel, rightLabelSuffix }) => {
					return (
						<FormControlLabel
							key={id}
							value={id}
							control={<Radio />}
							disableTypography
							label={
								<Stack
									direction="row"
									alignItems="center"
									spacing={1}
									width={1}
								>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ fontSize: fontSizes[size] }}
									>
										{label}
									</Typography>

									<Box
										sx={theme => ({
											flex: 1,
											height: '1px',
											bgcolor: '#B8B8B8',
											[theme.breakpoints.down(420)]: {
												bgcolor: showMobileDivider
													? '#B8B8B8'
													: 'transparent'
											}
										})}
									/>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 0.5
										}}
									>
										<Typography
											variant="body2"
											fontWeight="bold"
											sx={{ fontSize: fontSizes[size] }}
										>
											{rightLabel}
										</Typography>
										<Typography color="text.secondary" fontSize={12}>
											{rightLabelSuffix}
										</Typography>
									</Box>
								</Stack>
							}
							sx={{
								width: '100%',
								mx: 0
							}}
						/>
					);
				})}
				{optionsProp.length > maxItemsCollapsed && showSeeMore && (
					<Box
						sx={{
							display: 'flex',
							justifyContent: aligns[seeMoreAlign],
							mt: {
								xs: 0.5,
								md: 1.5
							}
						}}
					>
						<Button onClick={() => setCollapsed(!collapsed)}>
							{t(collapsed ? 'common.seeMore' : 'common.seeLess')}
						</Button>
					</Box>
				)}
			</RadioGroup>
		</Box>
	);
}
