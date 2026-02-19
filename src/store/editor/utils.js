import { imageOrder } from '@/models/transaction';
import { IMAGES_LIMIT, MIN_ZOOM } from '@/pages/private/editor/constants';
import { storage } from '@/utils/browser';

export const STORAGE_PREFIX = 'image_';
export const STORAGE_IMAGE_SELECTED_PREFIX = 'lastSelectedImage';
export const STORAGE_IMAGE_EXP_MINS = 10;

export { localBackgrounds } from './backgrounds.js';

export const defaultPositions = {
	left: 0,
	top: 0
};

export const defaultSettings = {
	activeBlur: false,
	blur: 5,
	zoomLevel: MIN_ZOOM,
	background: null,
	backgroundColor: null,
	magicBrush: false,
	brushSize: 20,
	undoStack: [],
	redoStack: []
};

export const saveImage = (id, imageData, exp) => {
	if (!id) return;

	const { settings = {} } = imageData || {};

	const parsedData = {
		...imageData,
		settings: {
			...settings,
			...(settings?.background === 'custom' ? { background: null } : {}),
			customBackgrounds: [],
			aiBackground: null,
			zoomLevel: 1
		},
		positions: defaultPositions
	};

	delete parsedData.cropped;

	storage.save(`${STORAGE_PREFIX}${id}`, parsedData, exp);
};

export const removeStoredImage = id => {
	if (!id) return;

	storage.remove(`${STORAGE_PREFIX}${id}`);
};

export const getStoreLastSelected = () =>
	storage.get(STORAGE_IMAGE_SELECTED_PREFIX);

export const removeStoreLastSelected = () =>
	storage.remove(STORAGE_IMAGE_SELECTED_PREFIX);

export const getStoredImages = () => {
	const images = [];

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);

		if (key.startsWith(STORAGE_PREFIX)) {
			const id = key.substring(STORAGE_PREFIX.length);
			const data = storage.get(key);

			if (data) {
				images.push({ id, ...data, tempBlob: null });
			}
		}
	}

	return images.reverse();
};

export const clearStorageImages = () => {
	removeStoreLastSelected();

	for (let i = localStorage.length - 1; i >= 0; i--) {
		const key = localStorage.key(i);

		if (
			key.startsWith(STORAGE_PREFIX) ||
			key.startsWith(STORAGE_IMAGE_SELECTED_PREFIX)
		) {
			storage.remove(key);
		}
	}
};

export const orderAndLimit = (arr = [], limit = IMAGES_LIMIT) => {
	const orderedImages = [...arr].sort((a, b) => {
		const itemA = a.createdAt || a.updatedAt;
		const itemB = b.crebtedAt || b.updatedAt;

		return itemA - itemB;
	});

	return [...orderedImages].slice(-limit);
};

export const getCurrentImage = (images = [], currentId) => {
	return images.find(item => item.id === currentId);
};

export const getCurrentSettings = (images = [], currentId) => {
	const currentImage = getCurrentImage(images, currentId);

	return currentImage?.settings || {};
};

export const getUpdatedImage = (images = [], id, payload) => {
	return images.map(item => {
		if (item.id !== id) return item;

		return {
			...item,
			...(typeof payload === 'function' ? payload(item) : payload)
		};
	});
};

export const getUpdatedPositions = (images = [], id, payload = {}) => {
	return images.map(item => {
		if (item.id !== id) return item;

		return {
			...item,
			positions: {
				...(item.positions || defaultPositions),
				...payload
			}
		};
	});
};

export const getUpdatedSettings = (images = [], id, payload = {}) => {
	return images.map(item => {
		if (item.id !== id) return item;

		return {
			...item,
			settings: {
				...item.settings,
				...payload
			}
		};
	});
};

export const imageStateToPipeline = image => {
	const pipelineKeys = [...imageOrder, 'latest'];
	const pipeline = {};

	for (const type of pipelineKeys) {
		const item = image?.[type];

		if (item) {
			pipeline[type] = item;
		}
	}

	return pipeline;
};
