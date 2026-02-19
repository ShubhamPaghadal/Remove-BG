import { capitalize } from '@/utils';
import googleLogo from '@/images/logos/google.svg';
import facebookLogo from '@/images/logos/facebook.svg';
import tiktokLogo from '@/images/logos/tiktok.svg';
import appleLogo from '@/images/logos/apple.svg';

const {
	VITE_APPLE_CLIENT_ID,
	VITE_FACEBOOK_CLIENT_ID,
	VITE_GOOGLE_CLIENT_ID,
	VITE_TIKTOK_CLIENT_ID
} = import.meta.env;

class OAuth {
	constructor({ baseUrl, baseParams, provider, image }) {
		this.baseUrl = baseUrl;
		this.baseParams = baseParams || {};
		this.provider = provider;
		this.name = capitalize(provider);
		this.image = image;
	}

	getUrl({ type = 'login', language, authTrigger, fastCheckout }) {
		const redirectOrigin =
			import.meta.env.VITE_BASE_URL || window.location.origin;
		const url = new URL(this.baseUrl);
		const state = { language };
		const gclid = localStorage.getItem('gclid');

		if (authTrigger) {
			state.authTrigger = authTrigger;
		}

		if (fastCheckout) {
			state.fastCheckout = true;
		}

		if (type === 'create' && gclid) {
			state.gclid = gclid;
		}

		url.searchParams.append('state', JSON.stringify(state));

		url.searchParams.append(
			'redirect_uri',
			new URL(`/api/auth/oauth/${this.provider}/${type}`, redirectOrigin)
		);

		Object.entries(this.baseParams).forEach(([name, value]) => {
			url.searchParams.append(name, value);
		});

		return url.toString();
	}
}

const googleClient = new OAuth({
	baseUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
	baseParams: {
		scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
		response_type: 'code',
		client_id: VITE_GOOGLE_CLIENT_ID
	},
	provider: 'google',
	image: googleLogo
});

const facebookClient = new OAuth({
	baseUrl: 'https://www.facebook.com/v19.0/dialog/oauth',
	baseParams: {
		scope: 'email public_profile',
		client_id: VITE_FACEBOOK_CLIENT_ID
	},
	provider: 'facebook',
	image: facebookLogo
});

// eslint-disable-next-line no-unused-vars
const appleClient = new OAuth({
	baseUrl: 'https://appleid.apple.com/auth/authorize',
	baseParams: {
		scope: 'name email',
		client_id: VITE_APPLE_CLIENT_ID
	},
	provider: 'apple',
	image: appleLogo
});

// eslint-disable-next-line no-unused-vars
const tiktokClient = new OAuth({
	baseUrl: 'https://www.tiktok.com/v2/auth/authorize/',
	baseParams: {
		scope: 'user.info.basic',
		client_id: VITE_TIKTOK_CLIENT_ID
	},
	provider: 'tiktok',
	image: tiktokLogo
});

export const oauthClients = [googleClient, facebookClient];
