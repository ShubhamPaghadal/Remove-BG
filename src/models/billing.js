import BaseModel from './base';

class BillingModel extends BaseModel {
	getInfo() {
		return this.get('');
	}

	validateVat(vat) {
		return this.get(`/validate-vat?vat=${vat}`);
	}

	updateTaxInformation(body) {
		return this.patch(`/tax-info`, { body });
	}
}

export default new BillingModel('/billing');
