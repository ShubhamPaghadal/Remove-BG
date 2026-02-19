const fontFamily =
	'"Karla", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

const body0 = {
	fontSize: '12px',
	fontWeight: 400,
	lineHeight: 1.5
};

const body1 = {
	fontSize: '14px',
	fontWeight: 400,
	lineHeight: 1.5
};

const body2 = {
	fontSize: '16px',
	fontWeight: 400,
	lineHeight: 1.5
};

const body3 = {
	fontSize: '20px',
	fontWeight: 400,
	lineHeight: 1.5
};

const lead = {
	display: 'block',
	fontSize: '88px',
	fontWeight: 700,
	lineHeight: '88px',
	letterSpacing: '-5px'
};

const h1 = {
	fontSize: '48px',
	fontWeight: 600,
	lineHeight: 'normal',
	component: 'p'
};

const h2 = {
	fontSize: '40px',
	fontWeight: 500,
	lineHeight: '56px',
	component: 'p'
};

const button = {
	cursor: 'pointer',
	padding: 0,
	border: 0,
	backgroundColor: 'transparent',
	textTransform: 'none'
};

export const typography = {
	fontFamily,
	fontWeightRegular: 400,
	fontWeightSemi: 600,
	fontWeightBold: 700,
	fontWeightExtraBold: 800,
	body0,
	body1,
	body2,
	body3,
	h1,
	h2,
	lead,
	button
};
