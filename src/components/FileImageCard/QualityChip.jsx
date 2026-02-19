import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const stylesBySize = {
	medium: {
		height: '32px',
		px: 1,
		position: 'absolute',
		top: 16,
		left: 34,
		fontSize: 16,
		fontWeight: 700
	},
	small: {
		height: '20px',
		px: 0.5,
		fontSize: 12,
		fontWeight: 500
	}
};

const stylesByQuality = {
	high: {
		bgcolor: 'lime'
	},
	low: {
		bgcolor: 'neutral.150',
		color: 'text.secondary'
	}
};

function QualityChip({ size = 'medium', quality }) {
	const { t } = useTranslation();

	return (
		<Box
			sx={{
				borderRadius: 1,
				zIndex: 2,
				display: 'flex',
				alignItems: 'center',
				...stylesByQuality[quality],
				...stylesBySize[size]
			}}
		>
			{t(
				quality === 'high' ? 'myImages.highQuality' : 'myImages.lowQuality'
			)}
		</Box>
	);
}

export default QualityChip;
