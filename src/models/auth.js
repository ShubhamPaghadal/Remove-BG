import BaseModel from './base';

class AuthModel extends BaseModel {
	async login({ email, ...data }) {
		return this.post('/login', { body: { email: email.trim(), ...data } });
	}

	async logout() {
		return this.get('/logout');
	}

	forgotPassword({ email, ...data }) {
		return this.post('/send-token', { body: { email, ...data } });
	}

	resetPassword(body) {
		return this.post('/reset-password', { body });
	}
}

export default new AuthModel('/auth');
