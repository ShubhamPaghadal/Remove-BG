import { StaticCanvas } from 'fabric';
import { useContext, useEffect, useState, useRef } from 'react';
import { InferenceSession, Tensor } from 'onnxruntime-web';
import * as ort from 'onnxruntime-web';
import Npyjs from 'npyjs';
import SamContext from '@/pages/private/editor/sam/createContext';
import { throttle } from '@/utils';
import transactionModel from '@/models/transaction';

import { handleImageScale } from './helpers/scaleHelper';
import { modelData } from './helpers/onnxModelAPI';
import { onnxMaskToImage, outputToSvgData } from './helpers/maskUtils';

import modelOnnx from './models/sam_model.onnx';
import { useMedia } from '../responsive';

const MODEL_DIR = modelOnnx;

ort.env.wasm.wasmPaths = `${import.meta.env.VITE_BASE_URL}/`;

const TENSOR_DTYPE = 'float32';
const EVENTS_DELAY = 10;

export const useSamEvents = () => {
	const {
		clicks: [, setClicks],
		image: [image],
		maskSvgData: [maskSvgData, setMaskSvgData],
		resetMask,
		fixedSvgData: [, setFixedSvgData]
	} = useContext(SamContext);

	const mouseTarget = useRef('out');
	const outTimeout = useRef(null);

	const getClick = (x, y) => {
		return { x, y, clickType: 1 };
	};

	const throttledMove = throttle(evt => {
		if (mouseTarget.current === 'out') return;

		const el = evt.nativeEvent.target;
		const rect = el.getBoundingClientRect();

		let x = evt.clientX - rect.left;
		let y = evt.clientY - rect.top;

		const imageScale = image ? image.width / el.offsetWidth : 1;

		x *= imageScale;
		y *= imageScale;

		const click = getClick(x, y);

		setClicks([click]);
	}, EVENTS_DELAY);

	const handleMouseMove = evt => {
		mouseTarget.current = 'in';

		return throttledMove(evt);
	};

	const handleMouseOut = () => {
		clearTimeout(outTimeout.current);

		mouseTarget.current = 'out';

		outTimeout.current = setTimeout(() => {
			if (mouseTarget.current === 'in') return;

			resetMask?.();
		}, EVENTS_DELAY);
	};

	const handleMouseIn = () => {
		clearTimeout(outTimeout.current);
		mouseTarget.current = 'in';
	};

	const handleMaskClick = () => {
		setMaskSvgData(null);
		setFixedSvgData(maskSvgData);
	};

	return {
		handleMouseMove,
		handleMouseOut,
		handleMouseIn,
		handleMaskClick
	};
};

export const useSamEventsMobile = () => {
	const {
		clicks: [, setClicks],
		image: [image],
		maskSvgData: [maskSvgData],
		fixedSvgData: [, setFixedSvgData]
	} = useContext(SamContext);

	const mdDown = useMedia('mdDown');

	const getClick = (x, y) => {
		return { x, y, clickType: 1 };
	};

	const handleMaskClick = evt => {
		const el = evt.nativeEvent.target;
		const rect = el.getBoundingClientRect();

		let x = evt.clientX - rect.left;
		let y = evt.clientY - rect.top;

		const imageScale = image ? image.width / el.offsetWidth : 1;

		x *= imageScale;
		y *= imageScale;

		const click = getClick(x, y);

		setClicks([click]);
	};

	useEffect(() => {
		if (mdDown) {
			setFixedSvgData(maskSvgData);
		}
	}, [maskSvgData]);

	return {
		handleMaskClick
	};
};

async function fabricImageToDOMElement(fabricImage) {
	if (!fabricImage) return null;

	try {
		const tempCanvas = document.createElement('canvas');
		const fabricWidth = fabricImage.width;
		const fabricHeight = fabricImage.height;

		tempCanvas.width = fabricWidth;
		tempCanvas.height = fabricHeight;

		const tempFabricCanvas = new StaticCanvas(tempCanvas);

		const clonedImage = await fabricImage?.clone();

		clonedImage.setCoords();
		clonedImage.left = 0;
		clonedImage.top = 0;

		tempFabricCanvas.add(clonedImage);
		tempFabricCanvas.renderAll();

		const imgElement = document.createElement('img');

		imgElement.src = tempCanvas.toDataURL('image/png');
		imgElement.width = fabricWidth;
		imgElement.height = fabricHeight;

		tempFabricCanvas.dispose();

		return imgElement;
	} catch (err) {
		console.warn('fabricImageToDOMElement error:', err);

		return null;
	}
}

function useSamInitializer({
	fabricImage,
	transactionId,
	latestId,
	isSegment
}) {
	const {
		clicks: [clicks],
		image: [, setImage],
		maskImg: [, setMaskImg],
		maskSvgData: [, setMaskSvgData],
		fabricScale: [, setFabricScale],
		error: [, setSamError],
		embedding: [, setEmbeddingLoading],
		resetAll
	} = useContext(SamContext);

	const [model, setModel] = useState(null); // ONNX model
	const [tensor, setTensor] = useState(null); // Image embedding tensor
	const [latestTransactionId, setLatestTransactionId] = useState(null);

	// The ONNX model expects the input to be rescaled to 1024.
	// The modelScale state variable keeps track of the scale values.
	const [modelScale, setModelScale] = useState(null);

	const loadFabricImage = async () => {
		const img = await fabricImageToDOMElement(fabricImage);

		const { height, width, samScale } = handleImageScale(img);

		setFabricScale(fabricImage?.scaleX);
		setModelScale({
			height,
			width,
			samScale
		});

		setImage(img);
	};

	const runONNX = async () => {
		try {
			if (
				model === null ||
				clicks === null ||
				tensor === null ||
				modelScale === null
			) {
				return;
			}

			/* Preapre the model input in the correct format for SAM.
			The modelData function is from onnxModelAPI.tsx. */
			const feeds = modelData({
				clicks,
				tensor,
				modelScale
			});

			if (feeds === undefined) {
				return;
			}

			// Run the SAM ONNX model with the feeds returned from modelData()
			const results = await model.run(feeds);
			const output = results[model.outputNames[0]];

			const outputWidth = output.dims[3];
			const outputHeight = output.dims[2];
			const outputParams = [
				output.data,
				outputWidth,
				outputHeight,
				undefined,
				fabricImage?.originalWidth || fabricImage?.width
			];

			const maskImage = onnxMaskToImage(...outputParams);
			const svgData = outputToSvgData(...outputParams);

			setMaskImg(maskImage);
			setMaskSvgData(svgData);
		} catch (error) {
			console.warn('Error in runONNX:', error);
			setMaskImg(null);
			setMaskSvgData(null);
		}
	};

	const loadNpyFromApi = async dType => {
		try {
			setEmbeddingLoading(true);

			const npLoader = new Npyjs();

			const response =
				await transactionModel.getEmbeddingMask(transactionId);

			const arrayBuffer = await response.arrayBuffer();

			const npArray = await npLoader.parse(arrayBuffer);

			const createdTensor = new Tensor(dType, npArray.data, npArray.shape);

			return createdTensor;
		} catch (error) {
			console.warn('Error in loadNpyFromApi:', error);
			setSamError(true);

			return null;
		} finally {
			setEmbeddingLoading(false);
		}
	};

	const handleTensor = async () => {
		const embedding = await loadNpyFromApi(TENSOR_DTYPE);

		setTensor(embedding);
	};

	useEffect(() => {
		// Initialize the ONNX model
		const initModel = async () => {
			try {
				if (MODEL_DIR === undefined || !isSegment || model) {
					return;
				}

				setEmbeddingLoading(true);

				const createdModel = await InferenceSession.create(MODEL_DIR);

				setModel(createdModel);
			} catch (err) {
				console.warn('Error in initModel:', err);

				setSamError(true);
				setModel(null);
				setMaskImg(null);
				setMaskSvgData(null);
				setEmbeddingLoading(false);
			}
		};

		initModel();
	}, [isSegment]);

	useEffect(() => {
		if (
			!transactionId ||
			!model ||
			transactionId === latestTransactionId ||
			!isSegment
		) {
			return;
		}

		setSamError(null);
		setTensor(null);
		setLatestTransactionId(transactionId);
		// Get and load the SAM embedding image from API
		handleTensor();
	}, [transactionId, model, latestId, isSegment, latestTransactionId]);

	useEffect(() => {
		runONNX();
	}, [clicks]);

	useEffect(() => {
		resetAll?.();

		if (fabricImage) {
			loadFabricImage();
		}
	}, [fabricImage]);
}

export default useSamInitializer;
