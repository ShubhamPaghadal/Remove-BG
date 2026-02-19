import { storage } from '@/utils/browser';
import { createAsyncThunk } from '@reduxjs/toolkit';
import transactionModel from '@/models/transaction';
import { IMAGES_LIMIT } from '@/pages/private/editor/constants';
import creditModel from '@/models/credit';
import EditorError from '@/errors/editorError';
import { getCustomBgPath } from '@/pages/private/editor/utils';
import ResponseError from '@/errors/responseError';

import {
	STORAGE_IMAGE_EXP_MINS,
	STORAGE_IMAGE_SELECTED_PREFIX,
	clearStorageImages,
	defaultSettings,
	getCurrentSettings,
	getStoreLastSelected,
	getStoredImages,
	getUpdatedImage,
	localBackgrounds,
	orderAndLimit,
	removeStoredImage
} from './utils';

const INITIAL_DELAY = 300;
const EXPONENTIAL_MAX = 5;
const MIN_EXP_TRIGGER = 2;
const TOTAL_MAX_TIME = 60;
const TRANSACTION_RETRY_COUNT = 1;

export function getMergedSettings(serverSettings = {}) {
	const backgroundId =
		serverSettings?.background?.id !== null
			? serverSettings?.background?.id
			: defaultSettings.background;

	const localBg = localBackgrounds.find(item => item.id === backgroundId);

	return {
		...defaultSettings,
		backgroundColor:
			serverSettings?.background?.color || defaultSettings.color,
		background: backgroundId,
		blur: serverSettings?.background?.blur || defaultSettings.blur,
		activeBlur:
			!Number.isNaN(parseInt(serverSettings?.background?.blur, 10)) ||
			defaultSettings.activeBlur,

		...(backgroundId && typeof localBg === 'undefined'
			? {
					customBackgrounds: [
						{
							id: backgroundId,
							path: getCustomBgPath(backgroundId)
						}
					]
				}
			: {}),
		angle: serverSettings?.position?.angle,
		scale: serverSettings?.position?.scale,
		origin: serverSettings?.position?.origin,
		crop: serverSettings?.position?.crop || null,
		coords: serverSettings?.position?.coords
	};
}

async function fetchTransaction(
	transactionId,
	{ exp = 1, totalSeconds = 0, retryCount = 0 } = {}
) {
	let exponential = exp;
	let seconds = totalSeconds;

	const transaction = await transactionModel.getTransactionById(transactionId);

	if (transaction.status === 'PENDING') {
		if (seconds >= TOTAL_MAX_TIME) {
			throw new EditorError('Transaction took too long to process');
		}

		if (seconds >= MIN_EXP_TRIGGER) {
			exponential = Math.min(EXPONENTIAL_MAX, exponential * 2);
		}

		const delay = INITIAL_DELAY * exponential;

		await new Promise(resolve => {
			setTimeout(resolve, delay);
		});

		seconds += exponential;

		return fetchTransaction(transactionId, {
			exponential,
			totalSeconds: seconds
		});
	}

	if (
		transaction.status === 'UPLOADED' &&
		!transactionModel.getBaseTransformItem(transaction)
	) {
		if (retryCount === TRANSACTION_RETRY_COUNT) {
			throw new EditorError('Transformed item not found');
		}

		await new Promise(resolve => {
			setTimeout(resolve, INITIAL_DELAY);
		});
		return fetchTransaction(transactionId, {
			retryCount: retryCount + 1
		});
	}

	if (transaction.status === 'UPLOAD_ERROR') {
		throw new EditorError('Upload error', transaction?.error);
	}

	return transaction;
}

export const getValidStoredImages = async loggedIn => {
	if (loggedIn) return [];

	const storedImages = getStoredImages() || [];

	const settled = await Promise.allSettled(
		storedImages.map(storedImage => {
			return new Promise((resolve, reject) => {
				fetchTransaction(storedImage.id)
					.then(() => resolve(storedImage))
					.catch(() => reject(storedImage.id));
			});
		})
	);

	return settled
		.map(localFile => {
			if (localFile.status === 'rejected') {
				removeStoredImage(localFile.reason);

				return null;
			}

			return localFile.value;
		})
		.filter(Boolean);
};

export const removeBackground = createAsyncThunk(
	'editor/removeBackground',
	async (
		{ localId, file, blobUrl, filename, imgUrl = '', transactionId = null },
		{ rejectWithValue }
	) => {
		try {
			let txId = transactionId;
			let transactionData = null;

			if (!txId) {
				const transaction = imgUrl
					? await transactionModel.downloadImgFromUrl(imgUrl)
					: await transactionModel.removeBg(file, filename);

				txId = transaction?.id;
				transactionData = transaction;
			}

			if (transactionData?.status === 'UPLOAD_ERROR') {
				throw new EditorError('Upload error', transactionData?.error);
			}

			if (transactionData?.status !== 'UPLOADED') {
				transactionData = await fetchTransaction(txId);
			}

			const { status, originalFileName, settings, pipeline, ...rest } =
				transactionData;

			return {
				...rest,
				id: txId,
				originalFileName,
				localId,
				tempBlob: blobUrl,
				status,
				...pipeline,
				base: transactionModel.getBaseImage(transactionData),
				latest: transactionModel.getBaseTransformItem(transactionData),
				settings
			};
		} catch (error) {
			if (error instanceof ResponseError || error instanceof EditorError) {
				error.localId = localId;
				error.blobUrl = blobUrl;
				return rejectWithValue(error);
			}

			throw error;
		}
	}
);

export const editImage = createAsyncThunk(
	'editor/editImage',
	async (id, { rejectWithValue }) => {
		try {
			const transactionData = await fetchTransaction(id);

			const { status, pipeline, settings, originalFileName, ...rest } =
				transactionData;

			return {
				...rest,
				id,
				status,
				originalFileName,
				...pipeline,
				base: transactionModel.getBaseImage(transactionData),
				latest: transactionModel.getBaseTransformItem(transactionData),
				settings
			};
		} catch (error) {
			if (error instanceof ResponseError || error instanceof EditorError) {
				return rejectWithValue(error);
			}

			throw error;
		}
	}
);

export const init = createAsyncThunk(
	'editor/init',
	async (_, { rejectWithValue, getState }) => {
		try {
			const { auth } = getState();
			const { loggedIn } = auth;

			let lastSelected = getStoreLastSelected();

			const storedImages = await getValidStoredImages(loggedIn);

			let images = orderAndLimit(storedImages);

			if (loggedIn) {
				clearStorageImages();
				const { transactions } = await transactionModel.getTransactions({
					pageSize: IMAGES_LIMIT
				});

				images = transactions.map(item => {
					const { pipeline, settings, ...rest } = item;

					return {
						...pipeline,
						...rest,
						base: transactionModel.getBaseImage(item),
						latest: transactionModel.getBaseTransformItem(item),
						settings: getMergedSettings(settings)
					};
				});

				images = orderAndLimit(images);
			}

			if (!lastSelected || !images.some(item => item.id === lastSelected)) {
				lastSelected = images?.length
					? images[images.length - 1]?.id
					: null;
			}

			storage.save(
				STORAGE_IMAGE_SELECTED_PREFIX,
				lastSelected,
				STORAGE_IMAGE_EXP_MINS
			);

			return {
				images,
				selectedImage: lastSelected
			};
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue(error);
			}

			throw error;
		}
	}
);

export const resetImage = createAsyncThunk(
	'editor/resetImage',
	async (id, { rejectWithValue }) => {
		try {
			const transactionData = await transactionModel.reset(id);

			const { status, pipeline } = transactionData;

			return {
				id,
				status,
				...pipeline,
				base: transactionModel.getBaseImage(transactionData),
				latest: transactionModel.getBaseTransformItem(transactionData)
			};
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue(error);
			}

			throw error;
		}
	}
);

export const applyBrush = createAsyncThunk(
	'editor/applyBrush',
	async ({ type, id, file, boundingBox }, { rejectWithValue }) => {
		try {
			const transaction = await transactionModel.brush(type, id, file, {
				boundingBox
			});

			return {
				...transaction,
				...(transaction?.improved ? { latest: transaction.improved } : {})
			};
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue(error);
			}

			throw error;
		}
	}
);

export const undo = createAsyncThunk(
	'editor/undo',
	async ({ id }, { getState, rejectWithValue }) => {
		try {
			const { images = [], selectedImage } = getState().editor;

			const {
				undoStack: currentUndoStack = [],
				redoStack: currentRedoStack = []
			} = getCurrentSettings(images, selectedImage);

			const [prevStackItem, lastUndoItem] = currentUndoStack.slice(-2);

			const { pipeline } = prevStackItem;

			const { sync } = lastUndoItem;

			const { id: opId } = pipeline?.latest || {};

			if (sync) {
				await transactionModel.opRestore(selectedImage, opId);
			}

			const newImages = getUpdatedImage(images, selectedImage, {
				settings: {
					redoStack: [...currentRedoStack, lastUndoItem],
					undoStack: currentUndoStack.slice(0, -1),
					...(prevStackItem?.settings || {})
				},
				...(prevStackItem?.pipeline || {})
			});

			return {
				id,
				newImages
			};
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue(error);
			}

			throw error;
		}
	}
);

export const redo = createAsyncThunk(
	'editor/redo',
	async (_, { getState, rejectWithValue }) => {
		try {
			const { images = [], selectedImage } = getState().editor;

			const {
				undoStack: currentUndoStack = [],
				redoStack: currentRedoStack = []
			} = getCurrentSettings(images, selectedImage);

			const [nextStackItem] = currentRedoStack.slice(-1);

			const { pipeline, sync } = nextStackItem;

			const { id: opId } = pipeline?.latest || {};

			if (sync) {
				await transactionModel.opRestore(selectedImage, opId);
			}

			const newImages = getUpdatedImage(images, selectedImage, {
				settings: {
					redoStack: currentRedoStack.slice(0, -1),
					undoStack: [...currentUndoStack, nextStackItem],
					...(nextStackItem?.settings || {})
				},
				...(pipeline || {})
			});
			return {
				newImages
			};
		} catch (error) {
			if (error instanceof ResponseError) {
				return rejectWithValue(error);
			}

			throw error;
		}
	}
);

export const fetchCredits = createAsyncThunk(
	'editor/fetchCredits',
	async (_, { rejectWithValue }) => {
		try {
			const response = await creditModel.getCredits();
			return response;
		} catch (error) {
			if (error instanceof Response) {
				return rejectWithValue(error);
			}

			throw error;
		}
	}
);
