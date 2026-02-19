import { forwardRef, useRef } from 'react';
import customColorImg from '@/images/color-selector.webp';
import { Box } from '@mui/material';
import { debounce } from '@/utils';

import { ImageButton } from './ImageButton';

export const ColorPicker = forwardRef(function ColorPicker(
	{ size, value, onChange, name, ...props },
	ref
) {
	const inputRef = useRef(null);

	const handleInputChange = debounce(evt => {
		onChange(evt.target.value);
	}, 200);

	return (
		<ImageButton
			ref={ref}
			size={size}
			onClick={() => {
				const input = inputRef?.current;

				input.focus();
				input.click();
			}}
			{...props}
		>
			<Box
				sx={{
					width: '100%',
					height: '100%',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundImage: `url(${customColorImg})`,
					m: 0
				}}
			/>
			<input
				ref={inputRef}
				type="color"
				name={name}
				onChange={handleInputChange}
				defaultValue={value}
				style={{
					width: 0,
					height: 0,
					padding: 0,
					border: 0,
					position: 'absolute',
					opacity: 0
				}}
			/>
		</ImageButton>
	);
});
