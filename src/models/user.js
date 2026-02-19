import BaseModel from './base';

class UserModel extends BaseModel {
	async me() {
		const response = await this.get('/me', { completeResponse: true });

		const country = response.headers.get('x-country') || '';

		const data = await response.json();

		return {
			...data,
			country: country?.toLowerCase()
		};
	}

	async update(body) {
		return this.patch(`/me`, { body });
	}

	async create(body) {
		return this.post('', {
			body
		});
	}

	async delete() {
		return this.post('/me/close');
	}
}

export default new UserModel('/user');
