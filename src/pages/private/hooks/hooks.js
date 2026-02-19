import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import routes from '@/routes';
import { useAuthMe } from '@/store/auth/selectors';
import { ROLES } from '../users/constants';

export function useUserPermissions() {
	const authMe = useSelector(useAuthMe);
	const navigate = useNavigate();

	const userData = authMe?.data;
	const isAdmin = userData?.role === ROLES.ADMIN;
	const isOwner = !userData?.parentAccount;

	function getIsAdminOrOwner() {
		return isAdmin || isOwner;
	}

	function redirectIfNoPermissions(routeName) {
		if (isAdmin || isOwner || (routeName && userData?.views?.[routeName]))
			return;

		navigate(userData?.views?.myImages ? routes.myImages : routes.myAccount);
	}

	return { getIsAdminOrOwner, redirectIfNoPermissions };
}
