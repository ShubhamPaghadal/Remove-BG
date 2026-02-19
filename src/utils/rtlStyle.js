export const isRtl = theme =>
	theme ? theme.direction === 'rtl' : document.dir === 'rtl';

export const reverseRightLeft = ({ theme, direction }) => {
	if (isRtl(theme)) {
		return direction === 'right' ? 'left' : 'right';
	}
	return direction;
};

export const getValueIfRtl = ({ theme, value, defaultValue }) => {
	if (isRtl(theme)) {
		return value;
	}
	return defaultValue || 'unset';
};

export const removeValueIfRtl = ({ theme, value, defaultValue }) => {
	if (isRtl(theme)) {
		return defaultValue || 'unset';
	}
	return value;
};

export const getReverseDirectionIfRtl = ({ theme } = {}) => {
	if (isRtl(theme)) {
		return 'row-reverse';
	}
	return 'row';
};
