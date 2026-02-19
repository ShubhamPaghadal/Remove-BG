import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ContactInformationForm } from '@/pages/private/my-account/ContactInformationForm.jsx';
import { useAuthMe } from '@/store/auth/selectors';
import { fetchMe } from '@/store/auth/thunks';
import { PageLayout } from '@/components/PageLayout';
import { ChangePasswordForm } from './ChangePasswordForm';
import { TaxInformationForm } from './TaxInformationForm.jsx';
import { TABS } from './constants';
import Language from './Language';
import Currency from './Currency';
import DeleteAccount from './DeleteAccount';
import { TransactionHistory } from './TransactionHistory';

export function MyAccount() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const authMe = useSelector(useAuthMe);
	const dispatch = useDispatch();

	const [view, setView] = useState(
		() => location.state?.tab || TABS.GENERAL_INFORMATION
	);

	useEffect(() => {
		// clear location state
		navigate(location.pathname, { replace: true });

		if (!authMe.loading) {
			dispatch(fetchMe());
		}
	}, []);

	const isTxHistoryTab = view === TABS.TX_HISTORY;
	const userData = authMe?.data;
	const viewsPermissions = userData?.views;
	const isOwner = !userData?.parentAccount;
	const ACCOUNT_TABS = [
		{
			value: TABS.GENERAL_INFORMATION,
			label: 'myAccount.generalInformation',
			showTab: true
		},
		{
			value: TABS.TAX_INFORMATION,
			label: 'myAccount.taxInformation.title',
			showTab: isOwner || viewsPermissions?.taxInformation
		},
		{
			value: TABS.TX_HISTORY,
			label: 'myAccount.txHistory.tabTitle',
			showTab: isOwner || viewsPermissions?.transactionHistory
		}
	];

	return (
		<PageLayout title={t('pageTitles.myAccount')}>
			<Tabs
				allowScrollButtonsMobile
				onChange={(_, v) => setView(v)}
				value={view}
				variant="scrollable"
				scrollButtons="auto"
			>
				{ACCOUNT_TABS.map(
					tab =>
						tab.showTab && (
							<Tab
								key={tab.value}
								value={tab.value}
								label={t(tab.label)}
							/>
						)
				)}
			</Tabs>
			<Box
				sx={{
					width: '100%',
					maxWidth: isTxHistoryTab ? '100%' : '590px',
					mt: {
						xs: 4,
						md: 7
					}
				}}
			>
				{view === TABS.GENERAL_INFORMATION && (
					<Stack spacing={{ xs: 5, md: 7 }}>
						<ContactInformationForm />
						<ChangePasswordForm />
						<Language />
						<Currency />
						<DeleteAccount />
					</Stack>
				)}
				{view === TABS.TAX_INFORMATION && (
					<TaxInformationForm mt={-2} sx={{ width: '100%' }} />
				)}
				{isTxHistoryTab && <TransactionHistory />}
			</Box>
		</PageLayout>
	);
}
