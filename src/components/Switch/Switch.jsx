import { Switch as MuiSwitch } from '@mui/material';
import { styled } from '@mui/material/styles';

import thumbIcons from './thumb-icons';

const getEncodedSvgUri = (name, color = '#000000') => {
	return `data:image/svg+xml,${encodeURIComponent(thumbIcons?.[name]?.replace(/{{color}}/g, color))}`;
};

export const Switch = styled(MuiSwitch)(({ theme, iconColor, iconName }) => ({
	width: 54,
	height: 30,
	padding: 7,
	overflow: 'visible',

	'& .MuiSwitch-switchBase': {
		margin: 1,
		padding: 0,
		transform: 'translateX(6px)',

		'&.Mui-checked': {
			color: '#fff',
			transform: 'translateX(19px)',

			'& + .MuiSwitch-track': {
				opacity: 1,
				backgroundColor: theme.palette.primary.main
			}
		}
	},

	'& .MuiSwitch-thumb': {
		backgroundColor: '#fff',
		width: 28,
		height: 28,
		filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))',

		...(iconName
			? {
					'&::before': {
						content: "''",
						position: 'absolute',
						width: '100%',
						height: '100%',
						left: 0,
						top: 0,
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						backgroundImage: `url('${getEncodedSvgUri(iconName, iconColor)}')`
					}
				}
			: {})
	},
	'& .MuiSwitch-track': {
		opacity: 1,
		backgroundColor: theme.palette.text.disabled,
		borderRadius: 20 / 2
	}
}));
