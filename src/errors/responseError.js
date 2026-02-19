export default class ResponseError extends Error {
	constructor(response, { data = {}, method } = {}) {
		const details = {
			url: response.url,
			method,
			status: response.status,
			body: data
		};

		super(`${response.statusText} - ${JSON.stringify(details)}`);

		this.name = 'ResponseError';
		this.status = response.status;
		this.data = data;
		this.response = response;
	}
}
