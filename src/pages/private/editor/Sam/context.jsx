import { useState, useMemo, useCallback } from 'react';

import SamContext from './createContext';

function SamContextProvider({ children }) {
	const [clicks, setClicks] = useState(null);
	const [image, setImage] = useState(null);
	const [maskImg, setMaskImg] = useState(null);
	const [maskSvgData, setMaskSvgData] = useState(null);
	const [fixedSvgData, setFixedSvgData] = useState(null);
	const [fabricScale, setFabricScale] = useState(null);
	const [samError, setSamError] = useState(null);
	const [embeddingLoading, setEmbeddingLoading] = useState(null);

	const resetMask = useCallback(() => {
		setClicks(null);
		setMaskImg(null);
		setMaskSvgData(null);
	}, [setClicks, setMaskImg, setMaskSvgData]);

	const resetAll = useCallback(() => {
		resetMask();
		setFixedSvgData(null);
		setImage(null);
		setFabricScale(null);
		setSamError(null);
	}, [resetMask, setImage, setFabricScale, setSamError, setFixedSvgData]);

	const value = useMemo(() => {
		return {
			clicks: [clicks, setClicks],
			image: [image, setImage],
			maskImg: [maskImg, setMaskImg],
			maskSvgData: [maskSvgData, setMaskSvgData],
			fabricScale: [fabricScale, setFabricScale],
			fixedSvgData: [fixedSvgData, setFixedSvgData],
			embedding: [embeddingLoading, setEmbeddingLoading],
			error: [samError, setSamError],
			resetAll,
			resetMask
		};
	}, [
		clicks,
		setClicks,
		image,
		setImage,
		maskImg,
		setMaskImg,
		setFabricScale,
		resetAll,
		resetMask,
		fixedSvgData,
		setFixedSvgData,
		samError,
		setSamError,
		embeddingLoading,
		setEmbeddingLoading
	]);

	return <SamContext.Provider value={value}>{children}</SamContext.Provider>;
}

export default SamContextProvider;
