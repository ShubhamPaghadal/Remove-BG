import { AUTH_MODAL_TYPES, setAuthModalType } from '@/store/auth';
import { useDispatch } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

export function ChangePasswordRedirect() {
	const { token } = useParams();
	const dispatch = useDispatch();

	dispatch(setAuthModalType(AUTH_MODAL_TYPES.CHANGE_PASSWORD));

	return <Navigate to="/" replace state={{ resetPasswordToken: token }} />;
}
