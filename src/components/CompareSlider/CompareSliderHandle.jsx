import { Box, alpha } from '@mui/material';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';

export function CompareSliderHandle() {
	return (
		<Box
			className="compare-slider-handle-root"
			sx={{
				color: '#E8E8E8',
				cursor: 'ew-resize',
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				placeItems: 'center',
				pointerEvents: 'none',
				'.compare-slider-handle-line': {
					backgroundColor: 'currentColor',
					flex: 1,
					height: '100%',
					pointerEvents: 'auto',
					width: 2
				},
				'.compare-slider-handle-button': {
					height: 34,
					width: 34,
					background:
						'linear-gradient(90deg, #9747FF 0%, #F372C2 51%, #DFF265 100%)',
					borderRadius: '50%',
					padding: 0.25,
					'&::before': {
						backgroundColor: alpha('#FFF', 0.5),
						borderRadius: '50%',
						bottom: 0,
						boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
						content: "''",
						display: 'block',
						height: 56,
						left: '50%',
						m: 'auto',
						position: 'absolute',
						top: 0,
						transform: 'translateX(-50%)',
						width: 56,
						zIndex: -1
					}
				},
				'.compare-slider-handle-button-icons': {
					alignItems: 'center',
					bgcolor: 'secondary.main',
					borderRadius: '50%',
					display: 'flex',
					height: '100%',
					justifyContent: 'center',
					'> svg': {
						fontSize: 22,
						mx: -0.75
					}
				}
			}}
		>
			<Box className="compare-slider-handle-line" />
			<Box className="compare-slider-handle-button">
				<Box className="compare-slider-handle-button-icons">
					<ChevronLeftIcon />
					<ChevronRightIcon />
				</Box>
			</Box>
			<Box className="compare-slider-handle-line" />
		</Box>
	);
}
