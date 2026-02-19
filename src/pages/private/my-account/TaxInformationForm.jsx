import { MenuItem, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TextFieldController } from '@/components/TextFieldController/index.js';
import { Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Button } from '@/components/Button';
import { InfoIcon } from '@/components/Icons/InfoIcon';
import { ItemTabs } from '@/components/ItemTabs/index.js';
import { TooltipMobileFriendly } from '@/components/Tooltip';
import { TAX_PAYER_TYPE } from '@/config.js';
import {
	useUpdateTaxInformation,
	useCountryOptions
} from '@/pages/private/my-account/hooks/index.js';
import { useAuthMe } from '@/store/auth/selectors.js';

import { getValueIfRtl, removeValueIfRtl } from '@/utils/rtlStyle';
import { useUserPermissions } from '../hooks/hooks';

const tooltipi18nPath = 'myAccount.taxInformation.tooltip';

export function TaxInformationForm({ onSuccess, SubmitButton, ...props }) {
	const authMe = useSelector(useAuthMe);
	const { t } = useTranslation();
	const {
		control,
		onSubmit,
		isSubmitting,
		showCompanyFields,
		hasVAT,
		country
	} = useUpdateTaxInformation({ onSuccess });
	const countries = useCountryOptions();
	const { getIsAdminOrOwner } = useUserPermissions();

	const locked = !!authMe.data?.taxInformation?.locked;
	const isAdminOrOwner = getIsAdminOrOwner();

	return (
		<Stack
			{...props}
			component="form"
			display="inline-flex"
			onSubmit={onSubmit}
		>
			<Controller
				name="type"
				control={control}
				render={({ field }) => {
					const isCompanySelected = field.value === TAX_PAYER_TYPE.COMPANY;
					const isPrivateSelected = field.value === TAX_PAYER_TYPE.PRIVATE;

					return (
						<Stack direction="row" gap={2.5} mb={3}>
							<TooltipMobileFriendly
								disableTooltip={
									!isAdminOrOwner ||
									!locked ||
									(locked && isCompanySelected)
								}
								tooltipi18nPath={tooltipi18nPath}
							>
								<ItemTabs
									label={t(
										'myAccount.taxInformation.fields.type.company'
									)}
									selected={isCompanySelected}
									onClick={() =>
										field.onChange(TAX_PAYER_TYPE.COMPANY)
									}
									sx={{
										pointerEvents: locked ? 'none' : 'auto'
									}}
								/>
							</TooltipMobileFriendly>
							<TooltipMobileFriendly
								disableTooltip={
									!locked ||
									(locked && isPrivateSelected) ||
									!isAdminOrOwner
								}
								tooltipi18nPath={tooltipi18nPath}
							>
								<ItemTabs
									label={t(
										'myAccount.taxInformation.fields.type.private'
									)}
									selected={isPrivateSelected}
									onClick={() =>
										field.onChange(TAX_PAYER_TYPE.PRIVATE)
									}
									sx={{
										pointerEvents: locked ? 'none' : 'auto'
									}}
								/>
							</TooltipMobileFriendly>
						</Stack>
					);
				}}
				defaultValue={TAX_PAYER_TYPE.COMPANY}
			/>
			<Stack gap={3}>
				{showCompanyFields && (
					<TextFieldController
						fullWidth
						control={control}
						id="companyName"
						label={t('myAccount.taxInformation.fields.companyName.label')}
						name="companyName"
						placeholder={t(
							'myAccount.taxInformation.fields.companyName.placeholder'
						)}
					/>
				)}
				<TextFieldController
					fullWidth
					control={control}
					select
					id="country"
					label={
						<CountryInputLabel
							disableTooltip={!locked || !isAdminOrOwner}
						>
							{t('myAccount.taxInformation.fields.country.label')}
						</CountryInputLabel>
					}
					name="country"
					placeholder={t(
						'myAccount.taxInformation.fields.country.placeholder'
					)}
					disabled={locked || !isAdminOrOwner}
					sx={theme => ({
						'.MuiSelect-icon': {
							right: removeValueIfRtl({ theme, value: '7px' }),
							left: getValueIfRtl({ theme, value: '7px' })
						}
					})}
				>
					{countries.map(({ label, value }) => (
						<MenuItem key={value} value={value}>
							{label}
						</MenuItem>
					))}
				</TextFieldController>

				{hasVAT ? (
					<TextFieldController
						fullWidth
						control={control}
						disabled={!isAdminOrOwner}
						id="vatNumber"
						label={t('myAccount.taxInformation.fields.vatnumber.label')}
						name="vatNumber"
						placeholder={t(
							'myAccount.taxInformation.fields.vatnumber.placeholder'
						)}
					/>
				) : (
					<TextFieldController
						fullWidth
						control={control}
						disabled={!isAdminOrOwner}
						id="taxId"
						label={
							country === 'es'
								? 'NIF/CIF'
								: t('myAccount.taxInformation.fields.taxId.label')
						}
						name="taxId"
						placeholder={t(
							'myAccount.taxInformation.fields.taxId.placeholder'
						)}
					/>
				)}
				<Stack direction="row" gap={2}>
					<TextFieldController
						fullWidth
						control={control}
						disabled={!isAdminOrOwner}
						id="firstName"
						label={t('myAccount.taxInformation.fields.firstName.label')}
						name="firstName"
						placeholder={t(
							'myAccount.taxInformation.fields.firstName.placeholder'
						)}
					/>
					<TextFieldController
						fullWidth
						control={control}
						disabled={!isAdminOrOwner}
						id="lastName"
						label={t('myAccount.taxInformation.fields.lastName.label')}
						name="lastName"
						placeholder={t(
							'myAccount.taxInformation.fields.lastName.placeholder'
						)}
					/>
				</Stack>
				<TextFieldController
					fullWidth
					control={control}
					disabled={!isAdminOrOwner}
					id="address"
					label={t('myAccount.taxInformation.fields.address.label')}
					name="address"
					placeholder={t(
						'myAccount.taxInformation.fields.address.placeholder'
					)}
				/>
				<Stack direction="row" gap={2}>
					<TextFieldController
						fullWidth
						control={control}
						disabled={!isAdminOrOwner}
						id="zipCode"
						label={t('myAccount.taxInformation.fields.zipCode.label')}
						name="zipCode"
						placeholder={t(
							'myAccount.taxInformation.fields.zipCode.placeholder'
						)}
					/>
					<TextFieldController
						fullWidth
						control={control}
						disabled={!isAdminOrOwner}
						id="city"
						label={t('myAccount.taxInformation.fields.city.label')}
						name="city"
						placeholder={t(
							'myAccount.taxInformation.fields.city.placeholder'
						)}
					/>
				</Stack>
				<Stack spacing={1}>
					<TextFieldController
						fullWidth
						control={control}
						disabled={!isAdminOrOwner}
						id="email"
						label={t('myAccount.taxInformation.fields.email.label')}
						name="email"
						placeholder={t(
							'myAccount.taxInformation.fields.email.placeholder'
						)}
					/>
					<Typography color="text.secondary" variant="body0">
						{t('myAccount.taxInformation.emailDescription')}
					</Typography>
				</Stack>
				<Stack direction="row" justifyContent="end">
					{SubmitButton ? (
						<SubmitButton
							disabled={!isAdminOrOwner}
							loading={isSubmitting}
						/>
					) : (
						<Button
							disabled={!isAdminOrOwner}
							type="submit"
							variant="outlined"
							loading={isSubmitting}
						>
							{t('myAccount.taxInformation.submit')}
						</Button>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
}

function CountryInputLabel({ children, disableTooltip }) {
	return (
		<Stack direction="row" alignItems="center" gap={1}>
			{`${children}*`}
			{!disableTooltip && (
				<TooltipMobileFriendly isIcon tooltipi18nPath={tooltipi18nPath}>
					<InfoIcon
						sx={{
							width: '16px',
							height: '16px'
						}}
					/>
				</TooltipMobileFriendly>
			)}
		</Stack>
	);
}
