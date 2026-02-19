import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useMedia } from '@/hooks/responsive';

import { Button } from '@/components/Button';
import { Dialog, DialogContent } from '@/components/Dialog';
import { TRIAL_DISCOUNT_DAYS } from '@/config';
import paymentModel from '@/models/payment';
import { fetchMe } from '@/store/auth/thunks';
import { setIsModalFullDiscountOpen } from '@/store/editor';
import { showError } from '@/utils';
import { Stack, Typography } from '@mui/material';
import FreeTrialRemove from '@/images/free-trial-remove.png';
import IconNewReleases from '@/images/icon-new-releases.svg';

function ModalFullDiscount() {
	const dispatch = useDispatch();
	const isOpen = useSelector(({ editor }) => editor.isModalFullDiscountOpen);
	const mdDown = useMedia('mdDown');
	const { t } = useTranslation();

	const handleClick = useCallback(
		async function () {
			try {
				await paymentModel.applyTrialDiscount();
				dispatch(setIsModalFullDiscountOpen(false));
				await dispatch(fetchMe()).unwrap();
			} catch (reason) {
				showError(reason);
			}
		},
		[dispatch]
	);

	return (
		<Dialog open={isOpen}>
			<DialogContent
				sx={{ px: 2, py: 2.5, maxWidth: '390px' }}
				hasCross={false}
				onOpenAutoFocus={e => e.preventDefault()}
				onInteractOutside={ev => ev.preventDefault()}
			>
				<Typography
					component="h1"
					sx={theme => ({
						fontSize: '16px',
						fontWeight: 700,
						lineHeight: '24px',
						textAlign: 'center',
						pb: 2.5,
						borderBottom: `1px solid ${theme.palette.divider}`
					})}
				>
					{mdDown
						? t('modalFullDiscount.titleMobile')
						: t('modalFullDiscount.title')}
				</Typography>

				<Stack
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						py: 2.5,
						textAlign: 'center'
					}}
				>
					<img
						src={FreeTrialRemove}
						alt={t('modalFullDiscount.title')}
						width={175}
					/>

					<Typography
						sx={{
							fontSize: '14px',
							lineHeight: '24px',
							fontWeight: 500
						}}
					>
						{t('modalFullDiscount.forLimitedTime')}
					</Typography>
					<Typography
						sx={{
							color: 'text.secondary',
							fontSize: '14px',
							fontWeight: 400,
							lineHeight: '24px',
							px: mdDown ? 2 : 3
						}}
					>
						{t('modalFullDiscount.description')}
					</Typography>
					<Stack
						sx={{
							display: 'flex',
							flexDirection: 'row',
							mt: 1.5,
							px: 1,
							py: 0.5,
							alignItems: 'center',
							gap: 1,
							borderRadius: '4px',
							backgroundColor: 'lime',
							width: 'fit-content'
						}}
					>
						<img
							src={IconNewReleases}
							alt=""
							aria-hidden
							width={20}
							height={20}
						/>
						<Typography
							sx={{
								fontSize: '16px',
								fontWeight: 700,
								lineHeight: '24px'
							}}
						>
							{t('modalFullDiscount.period', {
								trialDiscountDays: TRIAL_DISCOUNT_DAYS
							})}
						</Typography>
					</Stack>
				</Stack>

				<Stack
					sx={theme => ({
						pt: 2.5,
						borderTop: `1px solid ${theme.palette.divider}`
					})}
				>
					<Button
						color="secondary"
						fullWidth
						onClick={handleClick}
						variant="contained"
					>
						{t('modalFullDiscount.button')}
					</Button>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

export default ModalFullDiscount;
