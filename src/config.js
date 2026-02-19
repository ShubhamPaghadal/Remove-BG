export const SITE_NAME = 'Remove Background';
export const COMPANY_NAME = 'Remove Background S.L';
export const APP_BASE_URL =
	import.meta.env.VITE_BASE_URL || window.location.origin;

export const SUPPORT_EMAIL = 'support@remove-background.com';
export const PHONE = 1112341234;
export const DOMAIN = 'remove-background.com';

export const IMAGE_TTL_HOURS = 24;

export const ACCEPTED_FILE_TYPES = ['image/png', 'image/webp', 'image/jpeg'];

export const SENTRY_ENABLED = !!import.meta.env.VITE_SENTRY_DSN;

export const TAX_PAYER_TYPE = {
	COMPANY: 'company',
	PRIVATE: 'private'
};

export const SOCIAL_LINKS = {
	x: 'https://x.com/RBackground_com',
	facebook: 'https://www.facebook.com/Remove.Background.SL/',
	linkedin: 'https://www.linkedin.com/company/remove-background-com/'
};

export const RTL_LANGUAGES = ['he', 'ar'];

export const STORAGE_DAYS = 7;
export const TRIAL_DISCOUNT_DAYS = 7;
