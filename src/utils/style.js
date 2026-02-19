export function getGridBackgroundStyles(
	size = 30,
	color1 = '#e8e8e8',
	color2 = 'transparent'
) {
	const transparencyImage = `linear-gradient(45deg, ${color1} 25%, ${color2} 25%), linear-gradient(-45deg, ${color1} 25%, ${color2} 25%), linear-gradient(45deg, ${color2} 75%, ${color1} 75%), linear-gradient(-45deg, ${color2} 75%, ${color1} 75%)`;

	return {
		backgroundSize: `${size * 2}px ${size * 2}px`,
		backgroundPosition: `0 0, 0 ${size}px, ${size}px -${size}px, -${size}px 0`,
		backgroundImage: transparencyImage
	};
}
