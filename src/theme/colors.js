import { alpha } from '@mui/system/colorManipulator';

const withAlphas = color => {
	return {
		...color,
		alpha4: alpha(color.main, 0.04),
		alpha8: alpha(color.main, 0.08),
		alpha12: alpha(color.main, 0.12),
		alpha30: alpha(color.main, 0.3),
		alpha50: alpha(color.main, 0.5)
	};
};

export const primary = withAlphas({
	lightest: '#F3EFFF',
	light: '#A182F3',
	main: '#A182F3',
	dark: '#7657C9',
	darkest: '#5C41A5',
	contrastText: '#ffffff'
});

export const secondary = withAlphas({
	lightest: '#616161',
	light: '#323232',
	main: '#141414',
	dark: '#0C0C0C',
	darkest: '#0C0C0C',
	contrastText: '#ffffff'
});

export const neutral = {
	50: '#F8F9FA',
	100: '#F3F4F6',
	150: '#F7F7F7',
	200: '#E5E7EB',
	300: '#D2D6DB',
	400: '#9DA4AE',
	500: '#6C737F',
	600: '#4D5761',
	700: '#2F3746',
	800: '#1C2536',
	900: '#111927'
};

export const success = withAlphas({
	lightest: '#e7f4cd',
	light: '#b5e350',
	main: '#A9E32C',
	dark: '#88bc18',
	darkest: '#67910c',
	contrastText: '#000'
});

export const info = withAlphas({
	lightest: '#ECFDFF',
	light: '#CFF9FE',
	main: '#06AED4',
	dark: '#0E7090',
	darkest: '#164C63',
	contrastText: '#FFFFFF'
});

export const warning = withAlphas({
	lightest: '#FFFAEB',
	light: '#FEF0C7',
	main: '#F79009',
	dark: '#B54708',
	darkest: '#7A2E0E',
	contrastText: '#FFFFFF'
});

export const error = withAlphas({
	lightest: '#fff5f7',
	light: '#ffe1e5',
	main: '#FE4256',
	dark: '#AD1519',
	darkest: '#AD1519',
	contrastText: '#FFFFFF'
});
