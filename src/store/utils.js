import {
	isAsyncThunkAction,
	isFulfilled,
	isPending,
	isRejected
} from '@reduxjs/toolkit';

export const initialAsyncState = {
	data: null,
	error: null,
	rejected: false,
	loading: false,
	success: false,
	completed: false
};

export function isAsyncThunkActionWithPrefix(prefix) {
	return action =>
		action.type.startsWith(`${prefix}/`) && isAsyncThunkAction(action);
}

export function handleAsyncThunkActionState(state, action) {
	const name = action.type.split('/')[1];

	if (isPending(action)) {
		state[name] = { ...state[name], loading: true };
		return;
	}

	if (isFulfilled(action)) {
		state[name].data = action.payload;
		state[name].loading = false;
		state[name].success = true;
		state[name].completed = true;
		state[name].rejected = false;
		return;
	}

	if (isRejected(action)) {
		state[name].loading = false;
		state[name].error = action.payload;
		state[name].rejected = true;
		state[name].completed = true;
	}
}
