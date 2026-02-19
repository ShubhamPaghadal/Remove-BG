import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { loadCfTurnstileScript } from './utils';

export function useLoadCfTurnstileScript(ready = true) {
	useEffect(() => {
		if (ready) {
			loadCfTurnstileScript();
		}
	}, [ready]);
}

const sitekey = import.meta.env.VITE_CF_TURNSTILE_SITE_KEY;

export function useCfTurnstileChallenge({
	id = 'cf-turnstile-widget',
	action,
	triggerOnMount = false
}) {
	const language = useSelector(state => state.auth.language);
	const challengeTriggered = useRef(false);
	const [cfChallengeToken, setCfChallengeToken] = useState(null);
	const [cfIdempotencyKey, setCfIdempotencyKey] = useState(null);
	const [cfChallengeCompleted, setCfChallengeCompleted] = useState(false);

	async function triggerChallenge(callback) {
		if (challengeTriggered.current) {
			callback?.(cfChallengeToken);
			return;
		}
		challengeTriggered.current = true;

		if (!sitekey) {
			setCfChallengeCompleted(true);
			callback?.();
			return;
		}

		await window.cfTurnstileLoaded;

		window.turnstile.render(`#${id}`, {
			sitekey,
			theme: 'light',
			action,
			language,
			size: window.innerWidth < 330 ? 'compact' : 'normal',
			callback(response) {
				setCfChallengeCompleted(true);
				setCfChallengeToken(response);
				setCfIdempotencyKey(null);
				callback?.(response);
			},
			'error-callback': error => {
				// eslint-disable-next-line no-console
				console.error(error);
			}
		});
	}

	function triggerChallengePromise() {
		return new Promise(resolve => {
			triggerChallenge(token => {
				resolve(token);
			});
		});
	}

	function clearChallenge() {
		challengeTriggered.current = false;
		setCfChallengeToken(false);
		setCfIdempotencyKey(null);
		setCfChallengeCompleted(false);
	}

	useEffect(() => {
		if (triggerOnMount) {
			triggerChallenge();
		}
	}, []);

	return {
		cfChallengeToken,
		cfChallengeCompleted,
		cfIdempotencyKey,
		setCfIdempotencyKey,
		triggerChallenge,
		triggerChallengePromise,
		clearChallenge
	};
}
