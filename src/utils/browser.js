import dayjs from 'dayjs';

export const storage = {
	getExpirationKey(key) {
		return `${key}-expiration`;
	},

	save(key, data, expirationMins) {
		localStorage.setItem(key, JSON.stringify(data));

		if (expirationMins) {
			localStorage.setItem(
				this.getExpirationKey(key),
				dayjs().add(expirationMins, 'minute').format()
			);
		}
	},
	get(key) {
		try {
			const expirationDate = localStorage.getItem(
				this.getExpirationKey(key)
			);
			if (expirationDate && dayjs().isAfter(dayjs(expirationDate))) {
				localStorage.removeItem(key);
				localStorage.removeItem(this.getExpirationKey(key));
			}

			return JSON.parse(localStorage.getItem(key));
		} catch (err) {
			return undefined;
		}
	},
	remove(key) {
		localStorage.removeItem(key);
	}
};
