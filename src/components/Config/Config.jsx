import {
	useLanguageConfig,
	useLogoutControl,
	useSentryConfig,
	useYupConfig
} from './hooks';

export function Config() {
	useYupConfig();
	useLanguageConfig();
	useSentryConfig();
	useLogoutControl();

	return null;
}
