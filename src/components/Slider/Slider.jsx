import { getValueIfRtl } from '@/utils/rtlStyle';
import { Slider as MuiSlider } from '@mui/material';

export function Slider(props) {
	return (
		<MuiSlider
			{...props}
			sx={theme => ({
				height: 8,
				'&&.MuiSlider-root': {
					padding: '15px 0'
				},

				'.MuiSlider-thumb': {
					background: '#fff',
					width: 28,
					height: 28,
					filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))',
					transform: getValueIfRtl({
						value: 'translate(10px, -13px)',
						theme,
						defaultValue: 'translate(-10px, -13px)'
					})
				},

				...(typeof props.sx === 'function' ? props.sx(theme) : props.sx)
			})}
		/>
	);
}
