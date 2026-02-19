import routes from '@/routes';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch, useNavigate } from 'react-router-dom';
import { PLAN_TYPE } from '@/const/plans';
import {
	AUTH_MODAL_TYPES,
	setAuthModalRedirect,
	setAuthModalType
} from '@/store/auth';
import stripeModel from '@/models/stripe';
import {
	formatPrice,
	showError,
	getCheckoutUrl,
	redirectToCheckout
} from '@/utils';
import { useShowCurrencySelector } from './user';
import { useFetch } from './fetch';

export function usePlanOptions(prices, { withPeriod = false } = {}) {
	const { t } = useTranslation();

	if (!prices?.length) {
		return [];
	}

	return prices.map(plan => {
		return {
			id: plan.id,
			label: `${t('plans.creditsPlan', { quantity: plan.credits ?? 0 })} ${plan.name === PLAN_TYPE.TRIAL ? `(${t('plans.trial.name')})` : ''}`,
			rightLabel: formatPrice({
				amount: plan.baseAmount,
				currency: plan.currency
			}),
			rightLabelSuffix: withPeriod
				? `/${plan.name === PLAN_TYPE.TRIAL ? t('common.once') : t('common.monthly')}`
				: ''
		};
	});
}

export function usePlans() {
	const [selected, setSelected] = useState(null);
	const loggedIn = useSelector(state => state.auth.loggedIn);
	const navigate = useNavigate();
	const currency = useSelector(state => state.auth.currency);
	const isPublicPricing = useMatch(routes.pricing);
	const dispatch = useDispatch();
	const showCurrencySelector = useShowCurrencySelector();

	const getPrices = useFetch(stripeModel.getPrices.bind(stripeModel), {
		lazy: true,
		onError(err) {
			showError(err);
		}
	});

	const pricesData = getPrices.data?.prices || [];

	let servicePlan = null;
	let storagePlan = null;
	let trialPlan = null;

	for (const currentItem of pricesData) {
		if (servicePlan && trialPlan) {
			break;
		}

		if (currentItem.name === PLAN_TYPE.TRIAL && currentItem.active) {
			trialPlan = currentItem;
		}

		if (currentItem.name === PLAN_TYPE.SERVICE && currentItem.active) {
			servicePlan = currentItem;
		}

		if (currentItem.name === PLAN_TYPE.STORAGE && currentItem.active) {
			storagePlan = currentItem;
		}
	}

	const plans = useMemo(
		() =>
			pricesData
				?.filter(
					plan =>
						plan.name !== PLAN_TYPE.TRIAL &&
						plan.name !== PLAN_TYPE.SERVICE &&
						plan.name !== PLAN_TYPE.STORAGE
				)
				.sort((plan1, plan2) => plan1.baseAmount - plan2.baseAmount),
		[pricesData]
	);

	const planOptions = usePlanOptions(plans);

	function handleSubscribe() {
		if (loggedIn) {
			return redirectToCheckout({ priceId: selected });
		}

		dispatch(setAuthModalType(AUTH_MODAL_TYPES.SIGN_UP));
		dispatch(setAuthModalRedirect(getCheckoutUrl({ priceId: selected })));
	}

	function handleTrialSubscribe() {
		if (!isPublicPricing) {
			return redirectToCheckout({ priceId: trialPlan.id });
		}

		if (loggedIn) {
			return navigate(routes.dashboard);
		}

		dispatch(setAuthModalType(AUTH_MODAL_TYPES.SIGN_UP));
		dispatch(setAuthModalRedirect(getCheckoutUrl({ priceId: trialPlan.id })));
	}

	useEffect(() => {
		if (plans?.length) {
			setSelected(plans[0].id);
		}
	}, [plans]);

	useEffect(() => {
		const params = {
			filterActive: true
		};
		if (showCurrencySelector && currency) {
			params.currency = currency;
		}
		getPrices.fetch(params);
	}, [currency, showCurrencySelector]);

	return {
		trialPlan,
		servicePlan,
		storagePlan,
		plans,
		loading: getPrices.isLoading,
		prices: pricesData,
		onSubscribe: handleSubscribe,
		onTrialSubscribe: handleTrialSubscribe,
		selected: selected || plans?.[0]?.id,
		setSelected,
		planOptions
	};
}
