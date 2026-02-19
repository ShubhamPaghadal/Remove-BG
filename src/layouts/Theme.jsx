import { createTheme } from '@/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Snackbar } from '@/components/Snackbar';
import { useLanguage } from '@/hooks';
import { RTL_LANGUAGES } from '@/config';
import { useEffect, useMemo } from 'react';
import SamContextProvider from '@/pages/private/editor/sam/context';

export function Theme({ children }) {
	const language = useLanguage();

	useEffect(() => {
		document.dir = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
	}, [language]);

	const theme = useMemo(
		() =>
			createTheme({
				direction: RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr'
			}),
		[language]
	);

	return (
		<ThemeProvider theme={theme}>
			<SamContextProvider>
				<Snackbar />
				<CssBaseline />
				{children}
			</SamContextProvider>
		</ThemeProvider>
	);
}
