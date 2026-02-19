const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';

let resolveFn;

window.cfTurnstileLoaded = new Promise(resolve => {
	resolveFn = resolve;
});

window.onCfTurnstileLoad = () => {
	resolveFn?.();
};

export function loadCfTurnstileScript() {
	if (document.getElementById(TURNSTILE_SCRIPT_ID)) {
		return;
	}

	const script = document.createElement('script');
	script.src =
		'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onCfTurnstileLoad&render=explicit';
	script.id = TURNSTILE_SCRIPT_ID;
	script.async = true;
	script.defer = true;
	document.body.appendChild(script);
}
