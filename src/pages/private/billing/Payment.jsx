import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
	Box,
	CircularProgress,
	TableCell,
	TableRow,
	tableCellClasses,
	useMediaQuery
} from '@mui/material';
import { IconButton } from '@/components/IconButton';
import { DownloadIcon } from '@/components/Icons';
import { formatPrice } from '@/utils';
import { PAYMENT_INTENT_STATUS, INVOICE_STATUS } from '@/models/stripe';
import { Tooltip } from '@/components/Tooltip';

import { PaymentStatusChip } from './PaymentStatusChip';
import { useUserPermissions } from '../hooks/hooks';
import { useGetPaymentReference } from './hooks';

export function Payment({
	createdAt,
	amount,
	stripeCurrency: currency,
	amountRefunded,
	periodFrom,
	periodTo,
	type,
	stripePriceId,
	stripeClientSecret,
	stripePaymentIntentStatus,
	stripeInvoiceStatus,
	onRetry,
	storage,
	trial,
	invoiceId,
	invoiceFilename,
	isLastPayment,
	handleIncompleteModalOpen = () => {},
	service
}) {
	const { t } = useTranslation();
	const getPaymentReference = useGetPaymentReference();
	const taxInformation = useSelector(
		state => state.auth?.user?.taxInformation
	);
	const [downloading, setDownloading] = useState(false);
	const smDown = useMediaQuery(theme => theme.breakpoints.down('sm'), {
		noSsr: true
	});
	const { getIsAdminOrOwner } = useUserPermissions();

	const refunded = type === 'refund';
	const partiallyRefunded = refunded && amountRefunded < amount;

	const hasRetryAction =
		type === 'payment' &&
		[
			PAYMENT_INTENT_STATUS.REQUIRES_ACTION,
			PAYMENT_INTENT_STATUS.REQUIRES_CONFIRMATION,
			PAYMENT_INTENT_STATUS.REQUIRES_PAYMENT_METHOD
		].includes(stripePaymentIntentStatus) &&
		![INVOICE_STATUS.VOID, INVOICE_STATUS.UNCOLLECTIBLE].includes(
			stripeInvoiceStatus
		) &&
		isLastPayment;

	let TableRowComponent = TableRow;
	let CellComponent = TableCell;
	let BottomComponent = Fragment;
	let bottomProps = {};

	if (smDown) {
		TableRowComponent = Box;
		CellComponent = Box;
		BottomComponent = Box;
		bottomProps = {
			display: 'flex',
			gap: 1,
			mt: '12px',
			pb: '20px',
			borderBottom: '1px solid #B8B8B8',
			alignItems: 'center'
		};
	}

	const handleDownloading = evt => {
		if (!taxInformation) {
			evt.preventDefault();

			return handleIncompleteModalOpen();
		}

		setDownloading(true);

		setTimeout(() => {
			setDownloading(false);
		}, 500);
	};

	const showPaymentActions = getIsAdminOrOwner();
	const isTrialDiscountPayment = !!trial && !amount;

	return (
		<TableRowComponent
			onClick={() =>
				hasRetryAction
					? onRetry({ stripePriceId, stripeClientSecret, trial })
					: null
			}
			sx={{
				cursor: hasRetryAction ? 'pointer' : 'default',
				[`.${tableCellClasses.root}`]: {
					fontSize: 14
				}
			}}
			component={smDown ? Box : undefined}
		>
			<CellComponent
				sx={{ color: 'text.secondary', mb: { xs: 1, sm: '6px' } }}
			>
				{createdAt ? dayjs.unix(createdAt).format('LL') : '-'}
			</CellComponent>
			<CellComponent
				sx={{ color: 'text.secondary', mb: { xs: 1, sm: '6px' } }}
			>
				{getPaymentReference({ trial, service, storage })}
			</CellComponent>
			<CellComponent sx={{ color: 'text.secondary' }}>
				{periodFrom && periodTo
					? t('billing.history.period', {
							from: dayjs.unix(periodFrom).format('DD-MM-YYYY'),
							to: dayjs.unix(periodTo).format('DD-MM-YYYY')
						})
					: '-'}
			</CellComponent>
			<BottomComponent {...bottomProps}>
				<CellComponent>{formatPrice({ amount, currency })}</CellComponent>
				<CellComponent sx={{ ml: 'auto' }}>
					<PaymentStatusChip
						disputed={type === 'dispute'}
						isLastPayment={isLastPayment}
						refunded={refunded}
						partiallyRefunded={partiallyRefunded}
						status={stripePaymentIntentStatus}
						stripeInvoiceStatus={stripeInvoiceStatus}
						text={
							partiallyRefunded && amountRefunded
								? `(${formatPrice({ amount: amountRefunded, currency })})`
								: ''
						}
					/>
				</CellComponent>
				{showPaymentActions && (
					<CellComponent
						sx={{
							textAlign: 'right'
						}}
					>
						<Box sx={{ minWidth: 42 }}>
							<Tooltip
								title={
									taxInformation &&
									!invoiceId &&
									stripePaymentIntentStatus ===
										PAYMENT_INTENT_STATUS.SUCCEEDED
										? t('billing.generatingInvoice')
										: ''
								}
							>
								<Box>
									<IconButton
										variant="outlined"
										component="a"
										disabled={
											downloading ||
											(!invoiceId && !!taxInformation) ||
											isTrialDiscountPayment
										}
										sx={{ width: 42, height: 42 }}
										href={`/api/invoice/download/${invoiceId}`}
										download={invoiceFilename}
										onClick={handleDownloading}
									>
										{downloading ? (
											<CircularProgress size={20} />
										) : (
											<DownloadIcon />
										)}
									</IconButton>
								</Box>
							</Tooltip>
						</Box>
					</CellComponent>
				)}
			</BottomComponent>
		</TableRowComponent>
	);
}
