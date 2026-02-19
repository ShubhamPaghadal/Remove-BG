import BaseModel from './base';

class CollaboratorModel extends BaseModel {
	async list(options = {}) {
		const query = new URLSearchParams(options);

		return this.get(`?pageSize=10&${query}`);
	}

	async add(body) {
		return this.post('', { body });
	}

	async edit(body) {
		return this.patch('', { body });
	}

	async deleteCollaborator(id) {
		return this.delete(`/${id}`);
	}

	async sendInvitation(id) {
		return this.post(`/${id}/send-invitation`);
	}
}

export default new CollaboratorModel('/user/collaborator');
