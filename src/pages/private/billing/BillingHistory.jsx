import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	Box,
	Table,
	TableBody,
	Typography,
	CircularProgress,
	useMediaQuery,
	Stack
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { Pagination } from '@/components/Pagination';
import { PLAN_TYPE } from '@/const/plans';
import { redirectToCheckout, showError } from '@/utils';
import { useShallowSelector } from '@/hooks';
import { setPage } from '@/store/billing';
import { fetchPayments } from '@/store/billing/thunks';
import { Payment } from './Payment';
import { IncompleteBillingModal } from './IncompleteBillingModal';

export function BillingHistory(props) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [incompleteOpen, setIncompleteOpen] = useState(false);

	const {
		page,
		fetchPayments: { data: paymentsData, loading, completed }
	} = useShallowSelector(state => ({
		fetchPayments: state.billing.fetchPayments,
		page: state.billing.page
	}));

	const smDown = useMediaQuery(theme => theme.breakpoints.down('sm'), {
		noSsr: true
	});

	const pageSize = 12;
	const { totalPages = 1, payments = [] } = paymentsData || {};

	const handleIncompleteModalOpen = () => setIncompleteOpen(true);

	const handleIncompleteModalClose = () => setIncompleteOpen(false);

	useEffect(() => {
		(async () => {
			try {
				await dispatch(fetchPayments(pageSize)).unwrap();
			} catch (error) {
				showError(error);
			}
		})();
	}, [page]);

	function handleRetry({ stripeClientSecret, stripePriceId, trial }) {
		const params = {
			clientSecret: stripeClientSecret
		};

		if (trial) {
			params.priceName = PLAN_TYPE.TRIAL;
		} else {
			params.priceId = stripePriceId;
		}

		redirectToCheckout(params);
	}
	const TableBodyComponent = smDown ? Stack : TableBody;
	const TableComponent = smDown ? Box : Table;

	const isServiceFirst = !!payments?.[0]?.service;
	const firstValidIndex = isServiceFirst ? 1 : 0;

	return (
		<Box {...props}>
			<IncompleteBillingModal
				open={incompleteOpen}
				handleClose={handleIncompleteModalClose}
			/>
			<Typography variant="body2" fontWeight="bold" mb={2}>
				{t('billing.history.title')}
			</Typography>
			{!completed && loading && (
				<Box textAlign="center">
					<CircularProgress />
				</Box>
			)}
			<TableComponent>
				<TableBodyComponent gap={3}>
					{payments.map((payment, index) => (
						<Payment
							key={`${payment.id}-${index}`}
							{...payment}
							onRetry={handleRetry}
							isLastPayment={index === firstValidIndex && page === 1}
							handleIncompleteModalOpen={handleIncompleteModalOpen}
						/>
					))}
				</TableBodyComponent>
			</TableComponent>
			{totalPages > 1 && (
				<Pagination
					count={totalPages}
					page={page}
					onChange={(_, value) => dispatch(setPage(value))}
				/>
			)}
		</Box>
	);
}
