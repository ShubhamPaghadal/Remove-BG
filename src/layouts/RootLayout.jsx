import { Provider as ReduxProvider } from 'react-redux';
import store from '@/store';
import { Config } from '@/components/Config';
import { Theme } from './Theme';

export function RootLayout({ children }) {
	return (
		<ReduxProvider store={store}>
			<Config />
			<Theme>{children}</Theme>
		</ReduxProvider>
	);
}
