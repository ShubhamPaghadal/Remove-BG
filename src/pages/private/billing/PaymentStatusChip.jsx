import { useTranslation } from 'react-i18next';
import { Chip } from '@mui/material';

import { INVOICE_STATUS, PAYMENT_INTENT_STATUS } from '@/models/stripe';

const {
	PROCESSING,
	REQUIRES_ACTION,
	REQUIRES_CONFIRMATION,
	REQUIRES_PAYMENT_METHOD,
	SUCCEEDED,
	CANCELED
} = PAYMENT_INTENT_STATUS;

const statuses = {
	[CANCELED]: {
		textKey: 'canceled'
	},
	[SUCCEEDED]: {
		textKey: 'paid',
		color: 'success'
	},
	[PROCESSING]: {
		textKey: 'processing',
		color: 'warning'
	},
	pending: {
		textKey: 'pending',
		color: 'warning'
	},
	retry: {
		textKey: 'requiresAction',
		color: 'error'
	},
	refunded: {
		textKey: 'refunded',
		color: 'info'
	},
	partiallyRefunded: {
		textKey: 'partiallyRefunded',
		color: 'info'
	},
	disputed: {
		textKey: 'disputed',
		color: 'info'
	}
};

export function PaymentStatusChip({
	status = null,
	stripeInvoiceStatus,
	refunded,
	partiallyRefunded,
	disputed,
	isLastPayment,
	text
}) {
	const { t } = useTranslation();

	let currentStatus = statuses[status] || {};
	const retryStatuses = [
		REQUIRES_ACTION,
		REQUIRES_CONFIRMATION,
		REQUIRES_PAYMENT_METHOD
	].includes(status);

	if (status === null) {
		currentStatus = statuses.pending;
	}

	if (retryStatuses && isLastPayment) {
		currentStatus = statuses.retry;
	} else if (retryStatuses && !isLastPayment) {
		currentStatus = statuses[CANCELED];
	}

	if (
		[INVOICE_STATUS.VOID, INVOICE_STATUS.UNCOLLECTIBLE].includes(
			stripeInvoiceStatus
		)
	) {
		currentStatus = statuses[CANCELED];
	}

	if (stripeInvoiceStatus === INVOICE_STATUS.PAID) {
		currentStatus = statuses[SUCCEEDED];
	}

	if (refunded) {
		currentStatus = statuses.refunded;
	}

	if (partiallyRefunded) {
		currentStatus = statuses.partiallyRefunded;
	}

	if (disputed) {
		currentStatus = statuses.disputed;
	}

	return (
		<Chip
			color={currentStatus.color}
			label={`${t(`billing.paymentStatus.${currentStatus.textKey}`)} ${text}`}
		/>
	);
}
