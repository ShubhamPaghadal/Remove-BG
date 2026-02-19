import { useEffect, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { useMedia } from '@/hooks/responsive';

import { AnimatedSparkle } from '../AnimatedSparkle';
import { useSparkles } from './hooks';

export function MagicLoading({ sparkleColor, duration = 2, ...rest }) {
	const [showAnimation, setShowAnimation] = useState(false);

	const smDown = useMedia('smDown');
	const sparkles = useSparkles(duration);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setShowAnimation(true);
		}, 200);

		return () => {
			clearTimeout(timeout);
			setShowAnimation(false);
		};
	}, []);

	return (
		<Fade in={showAnimation} unmountOnExit>
			<Box width="100%" height="100%" overflow="hidden">
				<Box
					width="100%"
					height="100%"
					position="relative"
					minWidth={250}
					minHeight={250}
					{...rest}
				>
					{!!sparkles?.length &&
						sparkles.map(({ delay, size, ...item }, idx) => (
							<AnimatedSparkle
								key={`MagicLoading-Sparkle--${idx}`}
								duration={duration}
								color={sparkleColor || 'primary'}
								delay={delay}
								sx={{
									position: 'absolute',
									fontSize: smDown ? size * 0.7 : size,
									opacity: 0,
									...item
								}}
							/>
						))}
				</Box>
			</Box>
		</Fade>
	);
}
