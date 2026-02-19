import { useState, useEffect, useRef } from 'react';
import { simd } from 'wasm-feature-detect';
import { isIOS } from '@/utils/device';

function getVipsPackage({ nosimd, lowmem }) {
	if (nosimd) {
		return lowmem
			? import(`@denodecom/wasm-vips/nosimd/lowmem`)
			: import(`@denodecom/wasm-vips/nosimd`);
	}
	return lowmem
		? import(`@denodecom/wasm-vips/lowmem`)
		: import(`@denodecom/wasm-vips`);
}

let vipsInstance;
async function loadWasmVips() {
	const simdAvailable = await simd();

	const Vips = await getVipsPackage({
		nosimd: !simdAvailable,
		lowmem: isIOS() || navigator?.deviceMemory <= 2
	});

	const options = {
		// perf: disable jxl, heif dynamic libraries to reduce loading and module size
		dynamicLibraries: []
	};

	/* eslint-disable no-console -- leave this console.time until prod */
	console.time('vips-load');
	vipsInstance = await Vips.default(options);
	vipsInstance.setAutoDeleteLater(true);

	console.timeEnd('vips-load');
	return vipsInstance;
}

async function getWasmVips() {
	if (vipsInstance) {
		return vipsInstance;
	}

	vipsInstance = loadWasmVips();
	vipsInstance = await vipsInstance;

	return vipsInstance;
}

function isWasmAvailable() {
	return (
		typeof WebAssembly === 'object' &&
		typeof WebAssembly.instantiate === 'function'
	);
}

async function isVipsAvailable() {
	// async for future use, since feature wasm detection is mostly async
	return isWasmAvailable() && typeof SharedArrayBuffer !== 'undefined';
}

export function useVips() {
	const [vips, setVips] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [enabled, setEnabled] = useState(false);
	const loadingRef = useRef();

	useEffect(() => {
		isVipsAvailable().then(setEnabled).catch(console.error);
	}, []);

	const initializeVips = async () => {
		// prevent multiple calls
		if (loadingRef.current) {
			return;
		}

		setLoading(true);
		loadingRef.current = true;
		try {
			const instance = await getWasmVips();
			setVips(instance);
			return instance;
		} catch (e) {
			console.error('Vips error', e);
			setEnabled(false);
			setError(e);
		} finally {
			loadingRef.current = false;
			setLoading(false);
		}
	};

	return { initializeVips, enabled, vips, loading, error };
}
