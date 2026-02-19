import { createTheme as createMuiTheme } from '@mui/material/styles';
import { typography } from './typography';
import { palette } from './palette';
import { createComponents } from './createComponents';

export const createTheme = ({ direction = 'ltr' }) => {
	const theme = createMuiTheme({
		typography,
		palette,
		components: createComponents(palette),
		direction
	});

	return theme;
};
