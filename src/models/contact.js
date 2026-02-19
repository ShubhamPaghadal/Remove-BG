import BaseModel from './base';

class ContactModel extends BaseModel {
	async postForm(form) {
		const formData = new FormData();
		Object.keys(form).forEach(valueKey => {
			if (form[valueKey] != null) {
				formData.append(valueKey, form[valueKey]);
			}
		});
		return this.post('', { body: formData });
	}
}

export default new ContactModel('/contact');
