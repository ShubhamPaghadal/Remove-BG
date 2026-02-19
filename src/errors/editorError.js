class EditorError extends Error {
	constructor(message, data = {}) {
		const { statusCode, message: messageData } = data;
		const parsedMessage = `${message}${messageData ? ` - ${messageData}` : ''}`;
		super(parsedMessage);

		this.name = 'EditorError';
		this.status = statusCode;
		this.data = data;
	}
}

export default EditorError;
