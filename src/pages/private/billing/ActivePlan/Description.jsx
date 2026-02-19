import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { SUBSCRIPTION_STATUS } from '@/models/stripe';
import { Stack, Typography } from '@mui/material';
import { InfoIcon } from '@/components/Icons/InfoIcon';
import { Tooltip } from '@/components/Tooltip';

function getMessageKey({ hasDispute, requiresAction, status }) {
	if (hasDispute) {
		return 'billing.subscription.disputedPaymentMessage';
	}

	if (requiresAction) {
		return 'billing.subscription.failedPaymentMessage';
	}

	if (status === SUBSCRIPTION_STATUS.INCOMPLETE_EXPIRED) {
		return 'billing.subscription.incompleteExpired';
	}

	if (status === SUBSCRIPTION_STATUS.CANCELED) {
		return 'billing.subscription.canceledSubscription';
	}
}

function Text(props) {
	return <Typography fontWeight={500} fontSize={12} {...props} />;
}

function Description({ subscriptionInfo }) {
	const { t } = useTranslation();
	const { subscribed, willCancel, currentPeriodEnd, subscriptionEnded } =
		subscriptionInfo;

	const messageKey = getMessageKey(subscriptionInfo);

	if (messageKey) {
		return <Text>{t(messageKey)}</Text>;
	}

	if (subscribed && willCancel) {
		return (
			<Stack spacing={1}>
				<Text>
					{t('billing.subscription.willCancel', {
						date: dayjs.unix(currentPeriodEnd).format('LL')
					})}
				</Text>

				{subscriptionEnded && (
					<Text>
						{t('billing.subscription.canceledAt', {
							date: dayjs.unix(subscriptionEnded).format('LL')
						})}
					</Text>
				)}
			</Stack>
		);
	}

	if (subscribed && !willCancel) {
		return (
			<Stack spacing={1}>
				<Text>
					{t('billing.subscription.nextRenewal', {
						date: dayjs
							.unix(subscriptionInfo.currentPeriodEnd)
							.format('LL')
					})}
				</Text>
				{subscriptionInfo.credits && (
					<Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
						<Text>
							{t('common.subscriptionCredits')}:{' '}
							{subscriptionInfo.credits}
						</Text>
						<Tooltip
							title={t('billing.subscription.creditsTooltip')}
							placement="right"
						>
							<InfoIcon sx={{ fontSize: 12, cursor: 'help' }} />
						</Tooltip>
					</Stack>
				)}
			</Stack>
		);
	}

	return null;
}

export default Description;
