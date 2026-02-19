export const ADMIN_VIEWS = {
	editor: true,
	billing: true,
	myImages: true,
	taxInformation: true,
	transactionHistory: true
};
export const PERMISSIONS = {
	ADMIN: {
		create: true,
		edit: true,
		delete: true
	},
	LIMITED: {
		create: false,
		edit: false,
		delete: false
	}
};
export const ROLES = {
	ADMIN: 1,
	LIMITED: 2,
	COLLABORATOR: 3
};
export const TABLE_DATE_FORMAT = 'MMM D, YYYY';
export const VIEWS_PERMISSIONS = [
	'editor',
	'billing',
	'myImages',
	'taxInformation',
	'transactionHistory'
];
