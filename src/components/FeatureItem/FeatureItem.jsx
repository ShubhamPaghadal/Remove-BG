import { Box, Stack, Typography } from '@mui/material';

import { useMedia } from '@/hooks/responsive';

export function FeatureItem({ isLeftImage, text, title, src }) {
	const mdDown = useMedia('mdDown');

	const featureFlexDirection = mdDown ? 'column' : 'row';
	const featureItemWidth = mdDown ? '100%' : '45%';
	const featureJustifyContent = mdDown ? 'center' : 'space-between';

	return isLeftImage || mdDown ? (
		<Stack
			gap={5.5}
			justifyContent={featureJustifyContent}
			sx={{ flexDirection: featureFlexDirection }}
		>
			<FeatureImage src={src} sx={{ width: featureItemWidth }} />
			<FeatureText
				text={text}
				title={title}
				sx={{ width: featureItemWidth }}
			/>
		</Stack>
	) : (
		<Stack
			justifyContent={featureJustifyContent}
			sx={{ flexDirection: featureFlexDirection }}
		>
			<FeatureText
				text={text}
				title={title}
				sx={{ width: featureItemWidth }}
			/>
			<FeatureImage src={src} sx={{ width: featureItemWidth }} />
		</Stack>
	);
}

function FeatureText({ text, title, sx }) {
	return (
		<Stack gap={3.5} justifyContent="center" sx={sx}>
			<Typography
				component="h2"
				fontWeight="bold"
				sx={{
					fontSize: 32,
					lineHeight: '36px'
				}}
			>
				{title}
			</Typography>
			<Typography color="text.secondary" variant="body2">
				{text}
			</Typography>
		</Stack>
	);
}

function FeatureImage({ src, sx }) {
	return (
		<Box
			sx={{
				alignItems: 'center',
				display: 'flex',
				justifyContent: 'center',
				...sx
			}}
		>
			<img alt="Product feature item" height="388px" src={src} />
		</Box>
	);
}
