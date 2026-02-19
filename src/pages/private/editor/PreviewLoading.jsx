import { Card } from '@/components/Card';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Stack } from '@mui/material';
import { MagicLoading } from '@/components/MagicLoading';

import { useInitFabricImg } from './hooks';

export function PreviewLoading({ tempBlob = '' }) {
	const canvasRef = useRef(null);

	const { localFiles = [] } = useSelector(state => state.editor);

	const { blob = '', path = '' } = localFiles?.length
		? localFiles[localFiles.length - 1]
		: {};

	useInitFabricImg({
		imgUrl: tempBlob || blob,
		canvasRef,
		imgSetSettings: { opacity: 0.3 }
	});

	return (
		<Card
			variant="standard"
			sx={{
				position: 'relative',
				...(!blob ? { minHeight: { xs: 100, md: 485 } } : {})
			}}
		>
			<canvas
				ref={canvasRef}
				id={`originalCanvas-loading-${path || blob}`}
			/>
			<Stack
				alignItems="center"
				justifyContent="center"
				sx={{
					width: '100%',
					height: '100%',
					position: 'absolute',
					left: 0,
					top: 0,
					zIndex: 1,
					background: 'rgba(255,255,255, 0.5)'
				}}
			>
				{localFiles?.length ? (
					<MagicLoading />
				) : (
					<CircularProgress size={30} />
				)}
			</Stack>
		</Card>
	);
}
