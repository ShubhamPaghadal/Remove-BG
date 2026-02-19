import { configureStore } from '@reduxjs/toolkit';

import auth from './auth';
import editor from './editor';
import checkout from './checkout';
import billing from './billing';
import myImages from './myImages';
import site from './site';

const store = configureStore({
	reducer: {
		auth,
		editor,
		checkout,
		billing,
		myImages,
		site
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false
		}),
	devTools: import.meta.env.MODE !== 'production'
});

export default store;
