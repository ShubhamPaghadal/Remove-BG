import BaseModel from './base';

export const imageOrder = [
	'edited',
	'improved',
	'transformed',
	'resized',
	'original'
];

export const CORRUPT_ZIP_FLAG = new TextEncoder().encode('_CORRUPT_');

function hasZipError(buffer) {
	const bufferEnd = new Uint8Array(
		buffer,
		buffer.byteLength - CORRUPT_ZIP_FLAG.byteLength
	);

	for (let i = 0; i < bufferEnd.length; i++) {
		if (bufferEnd[i] !== CORRUPT_ZIP_FLAG[i]) {
			return false;
		}
	}

	return true;
}

class TransactionModel extends BaseModel {
	// keys where transform operations can start from
	getBaseTransformItem(transaction) {
		return (
			transaction?.pipeline?.improved ?? transaction?.pipeline?.transformed
		);
	}

	getLatestTransformation(transaction) {
		for (const type of imageOrder) {
			const item = transaction?.pipeline?.[type];
			if (item) {
				return item;
			}
		}

		return null;
	}

	getBaseImage(transaction) {
		return transaction?.pipeline?.original ?? transaction?.pipeline?.resized;
	}

	async getTransactionById(transactionId) {
		const transaction = await this.get(`/${transactionId}`);

		return this.#replacePipeline(transaction);
	}

	downloadUrl(id, type = 'low') {
		return new URL(this.basePath + `/${id}/download/${type}`, this.origin);
	}

	async downloadImgFromUrl(url) {
		const transaction = await this.post('/url', { body: { url } });

		return this.#replacePipeline(transaction);
	}

	getProxyImg(id) {
		return this.get(`/${id}/proxy/image`);
	}

	getHistory(options = {}) {
		const query = new URLSearchParams(options);

		return this.get(`/history?${query}`);
	}

	getHistoryStats(options = {}) {
		const query = new URLSearchParams(options);

		return this.get(`/history/stats?${query}`);
	}

	async removeBg(imageFile, filename) {
		const query = new URLSearchParams({ originalFileName: filename });

		const headers = {};

		const transaction = await this.post(`/?${query}`, {
			body: imageFile,
			headers
		});

		return this.#replacePipeline(transaction);
	}

	async brush(type = 'erase', id, maskFile, options = {}) {
		const query = new URLSearchParams(options);
		const result = await this.post(`/${id}/${type}?${query}`, {
			body: maskFile
		});

		return this.#replaceLowQualityKeys(result);
	}

	async getTransactions(options = {}) {
		const query = new URLSearchParams(options);

		const result = await this.get(`/?${query}`);

		if (result?.transactions) {
			result.transactions = result.transactions.map(tx =>
				this.#replacePipeline(tx)
			);
		}

		return result;
	}

	deleteTransaction(id) {
		return this.delete(`/${id}`);
	}

	edit(id, imageFile) {
		return this.post(`/${id}/edit`, { body: imageFile });
	}

	opRestore(id, opId) {
		return this.post(`/${id}/op/${opId}/restore`);
	}

	async reset(id) {
		const transaction = await this.post(`/${id}/reset`);
		return this.#replacePipeline(transaction);
	}

	generateBackground(id, data) {
		return this.post(`/${id}/image/generate`, { body: data });
	}

	async downloadBulk(ids = [], quality = 'high') {
		const response = await this.post(`/download/bulk/${quality}`, {
			body: ids
		});

		const arrayBuffer = await response.arrayBuffer();

		if (hasZipError(arrayBuffer)) {
			throw new Error();
		}

		return arrayBuffer;
	}

	saveBackground(txId, bgFile) {
		return this.post(`/${txId}/background/image`, { body: bgFile });
	}

	saveBGSettings(id, data) {
		return this.post(`/${id}/save`, { body: data });
	}

	getBackground(id) {
		return this.get(`/background/${id}`);
	}

	getEmbeddingMask(id) {
		return this.get(`/${id}/embedding-mask`);
	}

	backgroundImageUrl(id) {
		return new URL(this.basePath + `/background/image/${id}`, this.origin);
	}

	#replaceLowQualityKeys(obj) {
		return Object.keys(obj).reduce((pipeline, key) => {
			pipeline[key.replace(':low', '')] = obj[key];
			return pipeline;
		}, {});
	}

	#replacePipeline(transaction) {
		// replace `:low` suffix for easier use
		if (transaction?.pipeline) {
			transaction.pipeline = this.#replaceLowQualityKeys(
				transaction.pipeline
			);
		}

		return transaction;
	}
}

export default new TransactionModel('/transaction');
