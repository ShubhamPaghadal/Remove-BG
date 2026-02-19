import BaseModel from './base';

class PaymentModel extends BaseModel {
	getPayments(page = 1, pageSize = 50) {
		return this.get(`?page=${page}&pageSize=${pageSize}`);
	}

	applyTrialDiscount() {
		return this.post('/apply-trial-discount');
	}
}

export default new PaymentModel('/payment');
