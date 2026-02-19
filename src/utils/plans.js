export const getAmountByCredit = plan => {
	if (!plan) {
		return;
	}

	return plan.baseAmount / plan.credits;
};

export const getDiscount = (planA, planB) => {
	if (!planA || !planB) {
		return 0;
	}

	const creditCostPlanA = getAmountByCredit(planA);
	const creditCostPlanB = getAmountByCredit(planB);
	if (creditCostPlanA >= creditCostPlanB) {
		return 0;
	}

	return Math.round(
		((creditCostPlanB - creditCostPlanA) / creditCostPlanB) * 100
	);
};

export const getCheapestPlan = (prices = []) => {
	const noTrialActivePrices =
		prices?.filter(
			item => !['service', 'trial'].includes(item?.name) && item.active
		) || [];

	let cheapestPlan = noTrialActivePrices[0];

	for (const plan of noTrialActivePrices) {
		if (plan.amount < cheapestPlan.amount) {
			cheapestPlan = plan;
		}
	}

	return cheapestPlan;
};
