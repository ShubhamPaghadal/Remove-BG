import { getImageUrl } from '@/utils';

import transactionModel from '@/models/transaction';

export function getImageCardUrl(transaction) {
	const item = transactionModel.getLatestTransformation(transaction);

	if (!item) {
		return null;
	}

	return `${getImageUrl(item.path)}`;
}

export function getQualityTag(pipeline) {
	if (pipeline?.original) {
		return 'high';
	}
	if (pipeline?.resized) {
		return 'low';
	}

	return null;
}

export function trimFileName(fileName, maxLength = 20) {
	if (fileName.length <= maxLength) return fileName;

	const extensionIndex = fileName.lastIndexOf('.');
	const name = fileName.substring(0, extensionIndex);
	const extension = fileName.substring(extensionIndex);
	const trimmedName = `${name.substring(0, maxLength)}…`;

	return trimmedName + extension;
}
