import { Box } from '@mui/material';
import logoImg from '@/images/logo.webp';
import logox2Img from '@/images/logo2x.webp';
import logoWhiteImg from '@/images/logo-white.webp';
import logoWhite2xImg from '@/images/logo-white2x.webp';
import isoLogoImg from '@/images/iso-logo.webp';
import isoLogo2xImg from '@/images/iso-logo2x.webp';
import { useTranslation } from 'react-i18next';

const logoSizes = {
	default: { width: 221, height: 38 },
	iso: { width: 38, height: 38 }
};

const images = {
	default: {
		src: logoImg,
		src2x: logox2Img,
		size: logoSizes.default
	},
	white: {
		src: logoWhiteImg,
		src2x: logoWhite2xImg,
		size: logoSizes.default
	},
	iso: {
		src: isoLogoImg,
		src2x: isoLogo2xImg,
		size: logoSizes.iso
	}
};

/**
 * @param {object} props
 * @param {'light' | 'dark'} props.mode
 */
export function Logo({ mode = 'light', iso = false, ...props }) {
	const { t } = useTranslation();

	let logo = mode === 'light' ? images.default : images.white;

	if (iso) {
		logo = images.iso;
	}

	return (
		<Box
			key={`${mode}-${iso ? 'iso' : ''}`}
			component="img"
			src={logo.src}
			srcSet={`${logo.src} 1x, ${logo.src2x} 2x`}
			alt={t('logo.alt')}
			title={t('logo.alt')}
			{...logo.size}
			{...props}
		/>
	);
}
