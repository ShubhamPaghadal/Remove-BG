import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const initialState = {
	minutes: dayjs().minute(),
	isModalRateUsOpen: false
};

const myImagesSlice = createSlice(
	{
		name: 'myImages',
		initialState,
		reducers: {
			reloadMinutes(state) {
				state.minutes = dayjs().minute();
			},
			setIsModalRateUsOpen(state, { payload = false }) {
				state.isModalRateUsOpen = payload;
			}
		}
	},
	initialState
);

export const { reloadMinutes, setIsModalRateUsOpen } = myImagesSlice.actions;

export default myImagesSlice.reducer;
