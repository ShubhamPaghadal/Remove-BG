import { alpha } from '@mui/system/colorManipulator';
import {
	error,
	info,
	neutral,
	primary,
	secondary,
	success,
	warning
} from './colors';

export const palette = {
	primary,
	secondary,
	neutral,
	text: {
		primary: '#141414',
		secondary: '#656565',
		disabled: '#B8B8B8'
	},
	warning,
	background: {
		default: '#fff',
		paper: '#fff'
	},
	action: {
		active: neutral[500],
		disabled: alpha(neutral[900], 0.38),
		disabledBackground: alpha(neutral[900], 0.12),
		focus: alpha(neutral[900], 0.16),
		hover: alpha(neutral[900], 0.04),
		selected: alpha(neutral[900], 0.12)
	},
	divider: '#E8E8E8',
	error,
	info,
	success,
	lime: '#DFF265'
};
