import { useEffect, useState } from 'react';
import { useDialog } from '@/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_MODAL_TYPES, setAuthModalOptions } from '@/store/auth';

import { NoCreditsModal } from './NoCreditsModal';
import { NO_CREDITS_ERROR_EVENT } from './utils';

export function NoCreditsErrorListener() {
	const { open, handleOpen, handleClose } = useDialog();
	const dispatch = useDispatch();
	const loggedIn = useSelector(state => state.auth.loggedIn);
	const [data, setData] = useState({});

	const handleOpenModal = evt => {
		setData(evt.detail);
		handleOpen();
	};

	const handleConfirm = evt => {
		if (!loggedIn) {
			handleClose();
			evt.preventDefault();
			dispatch(
				setAuthModalOptions({
					type: AUTH_MODAL_TYPES.SIGN_UP,
					scope: 'buyCredits'
				})
			);
		}
	};

	useEffect(() => {
		window.addEventListener(NO_CREDITS_ERROR_EVENT, handleOpenModal);

		return () => {
			window.removeEventListener(NO_CREDITS_ERROR_EVENT, handleOpen);
		};
	}, []);

	return (
		<NoCreditsModal
			open={open}
			onClose={handleClose}
			onConfirm={handleConfirm}
			{...data}
		/>
	);
}
