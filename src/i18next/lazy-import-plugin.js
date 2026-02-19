const LazyImportPlugin = {
	type: 'backend',
	read(language, namespace, callback) {
		return import(`../locales/${language}.json`).then(
			({ default: data }) => {
				callback(null, data);
			},
			error => {
				callback(error, null);
			}
		);
	}
};

export default LazyImportPlugin;
