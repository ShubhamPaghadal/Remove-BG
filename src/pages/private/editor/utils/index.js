import { FabricImage } from 'fabric';

export * from './controls';
export * from './selection';

/**
 * Get the low-quality (half-resolution) image size for preview/download labels.
 */
export function getLowImageSize(imageSize) {
    if (!imageSize || !imageSize.width || !imageSize.height) return null;
    return {
        width: Math.round(imageSize.width / 2),
        height: Math.round(imageSize.height / 2)
    };
}

/**
 * Get the custom background path for a given background ID.
 */
export function getCustomBgPath(backgroundId) {
    if (!backgroundId) return '';
    const base = import.meta.env.VITE_BASE_URL || '';
    return `${base}/backgrounds/${backgroundId}`;
}

/**
 * Load an image from a URL and return an HTMLImageElement.
 */
export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * Convert a canvas element to a Blob.
 */
export function canvasToBlob(canvas, type = 'image/png', quality = 1) {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            blob => {
                if (blob) resolve(blob);
                else reject(new Error('canvasToBlob failed'));
            },
            type,
            quality
        );
    });
}

/**
 * Build the full image URL from a relative path.
 */
export function getImageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) {
        return path;
    }
    const base = import.meta.env.VITE_BASE_URL || '';
    return `${base}${path}`;
}

/**
 * Extract the filename from a URL path.
 */
export function getNameFromPath(path) {
    if (!path) return '';
    const parts = path.split('/');
    return parts[parts.length - 1] || '';
}

/**
 * Returns a CSS gradient string used for the transparency checkerboard pattern.
 */
export function getTransparencyImage() {
    return `linear-gradient(45deg, #ccc 25%, transparent 25%),
		linear-gradient(-45deg, #ccc 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, #ccc 75%),
		linear-gradient(-45deg, transparent 75%, #ccc 75%)`;
}

/**
 * Load a fabric image from a URL.
 */
export async function fabricImageFromURL(url) {
    return FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
}

/**
 * Fetch an image as an ArrayBuffer.
 */
export async function fetchImageAsArrayBuffer(url) {
    const response = await fetch(url);
    return response.arrayBuffer();
}

/**
 * Convert a fabric image to a raw buffer (ArrayBuffer).
 */
export async function fabricImageToBuffer(path, signal) {
    const url = getImageUrl(path);
    const response = await fetch(url, { signal });
    return response.arrayBuffer();
}

/**
 * Convert an ArrayBuffer to a blob URL.
 */
export function bufferToUrl(buffer, mimeType = 'image/png') {
    const blob = new Blob([buffer], { type: mimeType });
    return URL.createObjectURL(blob);
}

/**
 * Center-crop a fabric image to fit within the canvas, using the original image as reference.
 */
export function centerCrop(img, referenceImg, canvas) {
    if (!img || !canvas) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.width;
    const imgHeight = img.height;

    const scaleRatioWidth = canvasWidth / imgWidth;
    const scaleRatioHeight = canvasHeight / imgHeight;
    const scaleRatio = Math.max(scaleRatioWidth, scaleRatioHeight);

    img.set({
        scaleX: scaleRatio,
        scaleY: scaleRatio,
        left: (canvasWidth - imgWidth * scaleRatio) / 2,
        top: (canvasHeight - imgHeight * scaleRatio) / 2,
        selectable: false
    });
}

/**
 * Extract the canvas image (first image object) from a fabric canvas.
 */
export function extractCanvasImg(canvas) {
    if (!canvas) return null;
    return canvas.getObjects('image')?.[0] || null;
}

/**
 * Get a low-quality canvas for preview/download.
 */
export async function getLQCanvas({ canvas, backgroundColor }) {
    if (!canvas) return null;

    const el = canvas.getElement();
    const lqCanvas = document.createElement('canvas');
    lqCanvas.width = el.width;
    lqCanvas.height = el.height;

    const ctx = lqCanvas.getContext('2d');

    if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, lqCanvas.width, lqCanvas.height);
    }

    ctx.drawImage(el, 0, 0);

    return { getElement: () => lqCanvas };
}

/**
 * Gather data needed to save/download the image with current settings.
 */
export async function getDataToSave(selectedImage, settings) {
    const { backgroundColor, angle = 0, scale = [1, 1], origin = [0, 0], crop = null } = settings || {};

    return JSON.stringify({
        selectedImage,
        backgroundColor,
        angle,
        scale,
        origin,
        crop
    });
}

/**
 * Get a CSS cursor SVG for the draw brush.
 */
export function getDrawCursor(size = 10) {
    const radius = Math.max(size / 2, 1);
    const svg = `
		<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
			<circle cx="${radius}" cy="${radius}" r="${radius - 1}" stroke="white" stroke-width="1.5" fill="rgba(161,130,243,0.4)"/>
		</svg>
	`;
    const encoded = encodeURIComponent(svg.trim());
    return `url("data:image/svg+xml,${encoded}") ${radius} ${radius}, crosshair`;
}

/**
 * Convert a fabric path to an SVG string.
 */
export function pathToSvg(path, { width, height, backgroundColor = '#ffffff' }) {
    const pathData = path.toSVG();
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
		<rect width="${width}" height="${height}" fill="${backgroundColor}"/>
		${pathData}
	</svg>`;
}

/**
 * Convert an SVG string to a PNG File object.
 */
export async function svgToPng(svg, width, height, scaleFactor = 1) {
    return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        const img = new Image();
        const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0, width * scaleFactor, height * scaleFactor);
            URL.revokeObjectURL(url);

            canvas.toBlob(blob => {
                resolve(new File([blob], 'brush.png', { type: 'image/png' }));
            }, 'image/png');
        };

        img.src = url;
    });
}

/**
 * Get the bounding box of a fabric path, scaled by a factor.
 */
export function getBoundingBox(path, scaleFactor = 1) {
    if (!path) return null;

    const { left, top, width, height } = path.getBoundingRect();

    return {
        left: Math.round(left * scaleFactor),
        top: Math.round(top * scaleFactor),
        width: Math.round(width * scaleFactor),
        height: Math.round(height * scaleFactor)
    };
}

/**
 * Get the visible bounding box data from a fabric image by analysing pixel alpha values.
 */
export function getVisibleBoundingBoxData(img, { alphaMin = 0 } = {}) {
    if (!img) {
        return { visibleWidth: 0, visibleHeight: 0, centerX: 0, centerY: 0 };
    }

    const el = img.getElement?.();
    const width = img.width || el?.naturalWidth || 0;
    const height = img.height || el?.naturalHeight || 0;

    if (!el || !width || !height) {
        return {
            visibleWidth: width,
            visibleHeight: height,
            centerX: width / 2,
            centerY: height / 2
        };
    }

    try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(el, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        let minX = width;
        let minY = height;
        let maxX = 0;
        let maxY = 0;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const alpha = data[(y * width + x) * 4 + 3];
                if (alpha > alphaMin) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (minX > maxX || minY > maxY) {
            return {
                visibleWidth: width,
                visibleHeight: height,
                centerX: width / 2,
                centerY: height / 2
            };
        }

        const visibleWidth = maxX - minX;
        const visibleHeight = maxY - minY;
        const centerX = minX + visibleWidth / 2;
        const centerY = minY + visibleHeight / 2;

        return { visibleWidth, visibleHeight, centerX, centerY };
    } catch {
        return {
            visibleWidth: width,
            visibleHeight: height,
            centerX: width / 2,
            centerY: height / 2
        };
    }
}
