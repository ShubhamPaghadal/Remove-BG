import {
	Box,
	CircularProgress,
	Divider,
	Grid,
	Stack,
	Tab,
	Tabs,
	useMediaQuery
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { AddIcon, GridViewIcon, ListViewIcon } from '@/components/Icons';
import { FileImageCard } from '@/components/FileImageCard';
import { Pagination } from '@/components/Pagination';
import { useFetch } from '@/hooks/fetch';
import transactionModel from '@/models/transaction';
import { showError } from '@/utils';
import routes from '@/routes';
import { useMedia } from '@/hooks/responsive';
import { PageTitle } from '@/components/PageTitle';
import { IconButton } from '@/components/IconButton';
import { NoCreditsErrorListener } from '@/components/NoCreditsModal';
import { fetchCredits } from '@/store/editor/thunks';
import { useAuthMe } from '@/store/auth/selectors';
import { useDispatch, useSelector } from 'react-redux';

import { getValueIfRtl } from '@/utils/rtlStyle';
import { CreditsOverview } from './CreditsOverview';
import { DeleteImageConfirmation } from './DeleteImageConfirmation';
import { useConfig } from './hooks';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_KEY, VIEWS } from './constants';
import { EmptyView } from './EmptyView';
import { MinutesHelper } from './MinutesHelper';
import { Actions } from './Actions';
import { useUserPermissions } from '../hooks/hooks';
import { VIEWS_PERMISSIONS } from '../users/constants';
import RateUs from './RateUs';

export function MyImages() {
	const { t } = useTranslation();

	const { config, setConfig } = useConfig();
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(
		() => Number(localStorage.getItem(PAGE_SIZE_KEY)) || DEFAULT_PAGE_SIZE
	);
	const smDown = useMedia('smDown');
	const down980 = useMediaQuery('(max-width: 980px)');
	const dispatch = useDispatch();
	const authMe = useSelector(useAuthMe);
	const { redirectIfNoPermissions } = useUserPermissions();
	const {
		fetch: fetchTransactions,
		data: { transactions = [], totalPages = 1 } = {},
		isLoading,
		isCompleted,
		isSuccess
	} = useFetch(transactionModel.getTransactions.bind(transactionModel), {
		lazy: true,
		onError: showError
	});
	const [deleteImage, setDeleteImage] = useState(null);

	const emptyView =
		isCompleted &&
		isSuccess &&
		!isLoading &&
		!transactions?.length &&
		page === 1;

	const actions = !emptyView && isSuccess && isCompleted && (
		<Actions
			page={page}
			onChangePage={setPage}
			totalPages={totalPages}
			pageSize={pageSize}
			onChangePageSize={newPageSize => {
				setPage(1);
				setPageSize(newPageSize);
				localStorage.setItem(PAGE_SIZE_KEY, newPageSize);
			}}
		/>
	);

	const canCreateImages =
		authMe?.data?.createPermission || !authMe?.data?.parentAccount;

	const getCredits = async () => {
		try {
			await dispatch(fetchCredits()).unwrap();
		} catch (error) {
			showError(error);
		}
	};

	useEffect(() => {
		fetchTransactions({ pageSize, page });
	}, [page, pageSize]);

	const hdDownloadCallback = async quality => {
		if (quality === 'high') {
			getCredits(quality);
		}
	};

	useEffect(() => {
		getCredits();
	}, []);

	useEffect(() => {
		redirectIfNoPermissions(VIEWS_PERMISSIONS[2]);
	}, []);

	return (
		<Box>
			<NoCreditsErrorListener />
			{isCompleted && <MinutesHelper />}
			<DeleteImageConfirmation
				open={!!deleteImage}
				id={deleteImage}
				onClose={() => setDeleteImage(null)}
				onDelete={() => {
					if (
						// last page with single transaction
						transactions.length === 1 &&
						page === totalPages &&
						page > 1
					) {
						setPage(page - 1);
					} else {
						fetchTransactions({ pageSize, page });
					}
				}}
			/>
			<RateUs isEmpty={emptyView} />
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				mb={{ xs: 3, sm: 4 }}
			>
				<PageTitle>{t('pageTitles.myImages')}</PageTitle>

				{smDown ? (
					<IconButton
						component={Link}
						variant="contained"
						to={routes.dashboard}
					>
						<AddIcon />
					</IconButton>
				) : (
					<Button
						component={Link}
						disabled={!canCreateImages}
						variant="contained"
						startIcon={<AddIcon />}
						to={routes.dashboard}
						sx={theme => ({
							gap: getValueIfRtl({
								value: 1,
								theme
							})
						})}
					>
						{t('common.createNewImage')}
					</Button>
				)}
			</Stack>
			<CreditsOverview />
			<Box my={2}>
				<Box display={down980 ? 'none' : 'block'}>
					<Tabs
						value={config.view}
						onChange={(_, v) => setConfig('view', v)}
					>
						<Tab
							value={VIEWS.GRID}
							label={t('common.gridView')}
							icon={<GridViewIcon />}
							sx={theme => ({ gap: getValueIfRtl({ theme, value: 1 }) })}
						/>
						<Tab
							value={VIEWS.LIST}
							label={t('common.listView')}
							icon={<ListViewIcon />}
							sx={theme => ({ gap: getValueIfRtl({ theme, value: 1 }) })}
						/>
						{actions}
					</Tabs>
				</Box>
				<Box sx={{ display: { xs: 'block', sm: 'none' } }}>
					<div>{actions}</div>
					<Divider sx={{ mt: 2 }} />
				</Box>
				<Stack sx={{ position: 'relative' }}>
					{isLoading && (
						<Box
							sx={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: 0,
								bottom: 0,
								zIndex: 2,
								backgroundColor: '#ffffff70',
								display: 'flex',
								justifyContent: 'center'
							}}
						>
							<CircularProgress
								size={50}
								sx={{
									mt: 3
								}}
							/>
						</Box>
					)}

					{emptyView && <EmptyView canCreateImages={canCreateImages} />}

					{(config.view === VIEWS.LIST || down980) && !emptyView && (
						<Box
							sx={{
								'> div + div': {
									borderTop: ({ palette }) =>
										`1px solid ${palette.divider}`
								}
							}}
						>
							{transactions.map(image => (
								<FileImageCard
									key={image.id}
									name={image.originalFileName}
									view="list"
									onDelete={() => setDeleteImage(image.id)}
									transaction={image}
									sx={{
										width: '100%'
									}}
									downloadCallback={hdDownloadCallback}
								/>
							))}
						</Box>
					)}

					{config.view === VIEWS.GRID && !down980 && !emptyView && (
						<Grid container rowGap={11} pt={2}>
							{transactions.map(image => (
								<Grid item xs={6} key={image.id}>
									<FileImageCard
										transaction={image}
										name={image.originalFileName}
										onDelete={() => setDeleteImage(image.id)}
										view="grid"
										sx={{
											width: '100%'
										}}
										downloadCallback={hdDownloadCallback}
									/>
								</Grid>
							))}
						</Grid>
					)}
				</Stack>
				{totalPages > 1 && (
					<Pagination
						count={totalPages}
						page={page}
						onChange={(_, value) => setPage(value)}
						changeInRtl={false}
					/>
				)}
			</Box>
		</Box>
	);
}
