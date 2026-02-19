import { Scrollbars } from 'react-custom-scrollbars-2';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { useMedia } from '@/hooks/responsive';

import { getValueIfRtl } from '@/utils/rtlStyle';
import { useColors } from './hooks';
import { ImageButton } from './ImageButton';
import { ColorPicker } from './ColorPicker';
import { COLOR_ROWS_QUANTITY, TOOLBAR_COLOR_BUTTONS_SIZE } from './constants';
import { getTransparencyImage } from './utils';

function getMobileItemsQty(items = []) {
	const extraItems = 2;
	const quantity = Math.ceil((items.length + extraItems) / 2);

	return Math.max(COLOR_ROWS_QUANTITY, quantity);
}

export function ColorSelector({ handleChange = () => {}, value }) {
	const colors = useColors();
	const mdDown = useMedia('mdDown');

	const handleColor = (color = null) => {
		handleChange(color);
	};

	return (
		<Box pt={3} pb={0} height="100%">
			<Scrollbars
				style={{
					width: '100%',
					height: mdDown ? 'auto' : 'calc(100% - 40px)'
				}}
				{...(mdDown ? { autoHeight: true, autoHeightMax: 120 } : {})}
				hideTracksWhenNotNeeded
				renderTrackHorizontal={props => (
					<div
						{...props}
						style={{ display: 'none' }}
						className="track-horizontal"
					/>
				)}
				renderView={props => (
					<div
						{...props}
						style={{
							...props.style,
							marginLeft: getValueIfRtl({
								defaultValue: 0,
								value: '-17px'
							}),
							marginRight: getValueIfRtl({
								value: 0,
								defaultValue: '-17px'
							})
						}}
					/>
				)}
			>
				<Stack
					direction="row"
					alignItems="center"
					gap={1.25}
					flexWrap={{ xs: 'nowrap', md: 'wrap' }}
					justifyContent="flex-start"
					sx={{
						pr: 1.5
					}}
					{...(mdDown
						? {
								display: 'grid',
								gridTemplateColumns: `repeat(${getMobileItemsQty(colors)}, ${TOOLBAR_COLOR_BUTTONS_SIZE}px)`
							}
						: {})}
				>
					<ImageButton
						size={TOOLBAR_COLOR_BUTTONS_SIZE}
						selected={!value}
						onClick={() => {
							handleColor(null);
						}}
					>
						<Box
							sx={{
								width: '100%',
								height: '100%',
								backgroundRepeat: 'repeat',
								backgroundSize: '20px 20px',
								backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
								backgroundImage: getTransparencyImage(),
								m: 0
							}}
						/>
					</ImageButton>
					<ColorPicker
						selected={value && !colors?.includes(value)}
						size={TOOLBAR_COLOR_BUTTONS_SIZE}
						onChange={handleColor}
						value={value}
					/>
					{!!colors?.length &&
						colors.map(color => (
							<ImageButton
								key={`color-presets-${color}`}
								size={TOOLBAR_COLOR_BUTTONS_SIZE}
								selected={value === color}
								onClick={() => {
									handleColor(color);
								}}
							>
								<Box
									sx={{
										width: '100%',
										height: '100%',
										backgroundColor: color,
										m: 0
									}}
								/>
							</ImageButton>
						))}
				</Stack>
			</Scrollbars>
		</Box>
	);
}
