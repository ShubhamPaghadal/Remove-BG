import { ACCEPTED_FILE_TYPES } from '@/config';
import ResponseError from '@/errors/responseError';
import { saveAs } from 'file-saver';

const downloadSuffix = import.meta.env.VITE_FILE_DOWNLOAD_SUFFIX ?? '';

function getFilenameFromContentDisposition(contentDisposition) {
	// This code is a simple parse for our content disposition
	// does not handle all possible scenarios, only ours
	return contentDisposition
		?.split(/filename\*?=/i)[1]
		?.split(';')[0]
		?.replace(/^UTF-8'*/, '');
}

export function getDownloadFileName(filename, extension = 'png') {
	if (!filename) {
		return '';
	}
	const basename = filename.replace(/\.[^/.]+$/, '');
	return basename + downloadSuffix + `.${extension}`;
}

export function getImageUrl(path) {
	if (!path) return '';

	if (path.includes('blob:')) return path;

	return `/api/transaction/fetch/image/${path}`;
}

export async function downloadImage(urlOrPath, name, options = {}) {
	const { body } = options;

	const headers = new Headers();

	if (body) {
		headers.append('Content-Type', 'application/json');
	}

	const parsedOptions = {
		...options,
		...(body ? { body: JSON.stringify(body) } : {}),
		headers
	};

	const url =
		urlOrPath instanceof URL ? urlOrPath.href : getImageUrl(urlOrPath);

	const response = await fetch(url, parsedOptions);
	if (!response.ok) {
		throw new ResponseError(response);
	}

	const filename =
		getFilenameFromContentDisposition(
			response.headers.get('content-disposition')
		) ?? name;

	const blob = await response.blob();
	saveAs(blob, getDownloadFileName(filename));
}

export const getImageAccepted = () => {
	const acceptObj = {};

	for (const type of ACCEPTED_FILE_TYPES) {
		acceptObj[type] = [];
	}

	return acceptObj;
};
