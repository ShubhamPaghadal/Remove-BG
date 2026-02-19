import BaseModel from './base';

class CreditModel extends BaseModel {
	async getCredits() {
		return this.get('/');
	}

	async getPlansCredits() {
		return this.get('/plans');
	}
}

export default new CreditModel('/credit');
