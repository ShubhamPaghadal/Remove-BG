const kDeleted = Symbol('VipsDeleted');

export function vipsImageFree(im) {
	if (!im || im[kDeleted]) {
		return;
	}

	im.delete();
	im[kDeleted] = true;
}
