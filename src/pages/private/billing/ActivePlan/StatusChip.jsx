import { useTranslation } from 'react-i18next';
import { Chip } from '@mui/material';

import { SUBSCRIPTION_STATUS } from '@/models/stripe';

const { ACTIVE, TRIALLING, CANCELED, INCOMPLETE_EXPIRED } = SUBSCRIPTION_STATUS;

const statuses = {
	[ACTIVE]: {
		textKey: 'active',
		color: 'success'
	},
	[TRIALLING]: {
		textKey: 'trialling',
		color: 'success'
	},
	[CANCELED]: {
		textKey: 'canceled',
		color: 'error'
	},
	[INCOMPLETE_EXPIRED]: {
		textKey: 'trialEnded',
		color: 'warning'
	},
	requiresAction: {
		textKey: 'pending',
		color: 'warning'
	}
};

export function StatusChip({ status, willCancel, requiresAction }) {
	const { t } = useTranslation();

	let parsedStatus = statuses[status];

	if (willCancel) {
		parsedStatus = statuses[CANCELED];
	}

	if (requiresAction) {
		parsedStatus = statuses.requiresAction;
	}

	if (!parsedStatus) {
		return null;
	}

	return (
		<Chip
			color={parsedStatus.color}
			label={t(`billing.subscriptionStatus.${parsedStatus.textKey}`)}
		/>
	);
}
