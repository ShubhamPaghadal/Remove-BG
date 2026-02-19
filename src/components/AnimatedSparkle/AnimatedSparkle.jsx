import { SparkleIcon } from '@/components/Icons';

export function AnimatedSparkle({
	sx = {},
	duration = 1,
	delay = 0,
	direction = 'normal',
	animationName = 'magic-rotate',
	...props
}) {
	return (
		<SparkleIcon
			{...props}
			sx={theme => ({
				'@keyframes magic-rotate': {
					'0%': {
						opacity: 1,
						transform: 'rotate(0deg)'
					},

					'30%': {
						opacity: 0.5,
						transform: 'rotate(-90deg) scale(0.5)'
					},

					'50%, 100%': {
						opacity: 0,
						transform: 'rotate(-90deg) scale(0.3)'
					}
				},

				animationDuration: `${duration}s`,
				animationName,
				animationIterationCount: 'infinite',
				animationDirection: direction,
				animationDelay: `${delay}s`,

				...(typeof sx === 'function' ? sx(theme) : sx)
			})}
		/>
	);
}
