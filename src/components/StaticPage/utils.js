export function getLink(href, text) {
	return `<a href="${href}">${text || href}</a>`;
}

export function mailTo(mail, text) {
	return `<a href="mailto: ${mail}">${text || mail}</a>`;
}
