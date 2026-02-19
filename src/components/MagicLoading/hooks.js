import { useMemo } from 'react';

const SPARKLE_SIZES = {
	big: 50,
	small: 30
};

export function useSparkles(duration) {
	const groupA = useMemo(
		() => [
			{
				top: '10%',
				left: '10%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '7.5%',
				left: '44%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '6%',
				left: '70%',
				size: SPARKLE_SIZES.small
			},
			{
				top: '31%',
				left: '22%',
				size: SPARKLE_SIZES.small
			},
			{
				top: '36%',
				left: '53%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '22%',
				left: '83%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '54%',
				left: '10%',
				size: SPARKLE_SIZES.small
			},
			{
				top: '57%',
				left: '30%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '47%',
				left: '84%',
				size: SPARKLE_SIZES.small
			},
			{
				top: '79%',
				left: '22%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '67%',
				left: '50%',
				size: SPARKLE_SIZES.small
			},
			{
				top: '68%',
				left: '78%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '86%',
				left: '70%',
				size: SPARKLE_SIZES.small
			}
		],
		[]
	);

	const groupB = useMemo(
		() => [
			{
				top: '6%',
				left: '15%',
				size: SPARKLE_SIZES.small
			},
			{
				top: '11%',
				left: '36%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '11%',
				left: '69%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '20%',
				left: '80%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '32%',
				left: '21%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '45%',
				left: '33%',
				size: SPARKLE_SIZES.small
			},
			{
				top: '32%',
				left: '43%',
				size: SPARKLE_SIZES.small
			},
			{
				top: '27%',
				left: '63%',
				size: SPARKLE_SIZES.small
			},
			{
				top: '60%',
				left: '6%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '67%',
				left: '50%',
				size: SPARKLE_SIZES.small
			},
			{
				top: '50%',
				left: '67%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '81%',
				left: '13%',
				size: SPARKLE_SIZES.small
			},
			{
				top: '83%',
				left: '41%',
				size: SPARKLE_SIZES.big
			},
			{
				top: '74%',
				left: '75%',
				size: SPARKLE_SIZES.big
			}
		],
		[]
	);

	return [
		...groupA,
		...groupB.map(item => ({ ...item, delay: duration / 2 }))
	];
}
