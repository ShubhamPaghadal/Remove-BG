import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	pageNotFound: false
};

const siteSlice = createSlice(
	{
		name: 'site',
		initialState,
		reducers: {
			setPageNotFound(state, action) {
				state.pageNotFound = action.payload;
			}
		}
	},
	initialState
);

export const { setPageNotFound } = siteSlice.actions;

export default siteSlice.reducer;
