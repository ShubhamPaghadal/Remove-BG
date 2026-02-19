import { useEffect, useRef } from 'react';
import {
	ReactCompareSlider,
	ReactCompareSliderImage
} from 'react-compare-slider';

import { CompareSliderHandle } from './CompareSliderHandle';

/**
 * CompareSlider component
 * @param {import('react-compare-slider').ReactCompareSliderProps} props
 * @param {object} props.itemOne
 * @param {object} props.itemTwo
 *
 */
export function CompareSlider({ itemOne, itemTwo, ...props }) {
	const sliderRef = useRef(null);

	useEffect(() => {
		const handleElement = sliderRef.current?.rootContainer?.querySelector(
			'[data-rcs="handle-container"]'
		);
		if (handleElement) {
			// SEO improvement
			handleElement.removeAttribute('role');
		}
	}, []);

	return (
		<ReactCompareSlider
			{...props}
			ref={sliderRef}
			handle={<CompareSliderHandle />}
			itemOne={
				<ReactCompareSliderImage src={itemOne?.src} alt={itemOne?.alt} />
			}
			itemTwo={
				<ReactCompareSliderImage src={itemTwo?.src} alt={itemTwo?.alt} />
			}
		/>
	);
}
