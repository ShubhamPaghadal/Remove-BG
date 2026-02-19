const COLORS_RGBA = {
	blue: [0, 114, 189, 255],
	black: [0, 0, 0, 255],
	white: [255, 255, 255, 255]
};

// Convert the onnx model mask prediction to ImageData
function arrayToImageData(
	input,
	width,
	height,
	rgbaColor = COLORS_RGBA.blue,
	rgbaBackgroundFill
) {
	const [r, g, b, a] = rgbaColor;
	const arr = new Uint8ClampedArray(4 * width * height).fill(0);
	for (let i = 0; i < input.length; i++) {
		// Threshold the onnx model mask prediction at 0.0
		// This is equivalent to thresholding the mask using predictor.model.mask_threshold
		// in python
		if (input[i] > 0.0) {
			arr[4 * i + 0] = r;
			arr[4 * i + 1] = g;
			arr[4 * i + 2] = b;
			arr[4 * i + 3] = a;
		} else if (rgbaBackgroundFill) {
			const [br, bg, bb, ba] = rgbaBackgroundFill;

			arr[4 * i + 0] = br;
			arr[4 * i + 1] = bg;
			arr[4 * i + 2] = bb;
			arr[4 * i + 3] = ba;
		}
	}

	return new ImageData(arr, width, height);
}

function imageDataToCanvas(imageData, scaleX = 1, scaleY = 1) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = imageData.width / scaleX;
	canvas.height = imageData.height / scaleY;

	ctx?.putImageData(imageData, 0, 0);

	return canvas;
}

function imageDataToImage(imageData, scaleX, scaleY) {
	const canvas = imageDataToCanvas(imageData, scaleX, scaleY);
	const imgUrl = canvas.toDataURL();

	return imgUrl;
}

export function imageElementToBlob(imageData, fileType = 'image/png') {
	return new Promise(resolve => {
		const canvas = imageDataToCanvas(imageData);

		canvas.toBlob(blob => {
			if (blob) {
				resolve(blob);
			}
		}, fileType);
	});
}

export function onnxMaskToImage(input, width, height) {
	return imageDataToImage(arrayToImageData(input, width, height));
}

export async function onnxMaskToFile(input, height, width) {
	const file = await imageElementToBlob(
		arrayToImageData(
			input,
			width,
			height,
			COLORS_RGBA.black,
			COLORS_RGBA.white
		)
	);

	return file;
}

// SVG Utils
function getPathAndBoundsFromFloat32(float32Array, width, height, threshold) {
	let path = '';
	let minX = width;
	let minY = height;
	let maxX = 0;
	let maxY = 0;
	let found = false;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const value = float32Array[y * width + x];
			if (value > threshold) {
				path += `M ${x} ${y} h 1 v 1 h -1 Z `;
				found = true;
				minX = Math.min(minX, x);
				minY = Math.min(minY, y);
				maxX = Math.max(maxX, x);
				maxY = Math.max(maxY, y);
			}
		}
	}

	const bounds = found
		? {
				topLeft: { x: minX, y: minY },
				topRight: { x: maxX, y: minY },
				bottomRight: { x: maxX, y: maxY },
				bottomLeft: { x: minX, y: maxY },
				width: maxX - minX + 1,
				height: maxY - minY + 1,
				center: {
					x: minX + (maxX - minX) / 2,
					y: minY + (maxY - minY) / 2
				}
			}
		: null;

	return { path, bounds };
}

export function pathToSvg(path, width, height) {
	const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <path d="${path}" fill="#000000"/>
    </svg>`;

	return svg;
}

export function outputToSvgData(
	float32Array,
	width,
	height,
	threshold = 1,
	originalWidth
) {
	const { path: pathData, bounds } = getPathAndBoundsFromFloat32(
		float32Array,
		width,
		height,
		threshold
	);

	return {
		svg: pathToSvg(pathData, width, height),
		pathData,
		bounds,
		width,
		height,
		originalWidth
	};
}
