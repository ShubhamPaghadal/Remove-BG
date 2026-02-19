import { ROLES } from './constants';

export function getPermissionsI18n(permissions, role, t) {
	const i18nPath = 'users.table';
	const permissionsValues = Object.values(permissions);

	if (role === ROLES.ADMIN || permissionsValues.every(val => val))
		return t(`${i18nPath}.rows.sections.all`);
	if (permissionsValues.every(val => !val))
		return t(`${i18nPath}.rows.sections.none`);

	return Object.entries(permissions)
		.filter(([, value]) => value)
		.map(([key]) => t(`users.viewsPermissions.${key}`))
		.join(', ');
}
