import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { updateUser } from '@/store/auth/thunks';
import { useAuthMe } from '@/store/auth/selectors';
import { TAX_PAYER_TYPE } from '@/config.js';
import { showError } from '@/utils';
import countriesIsoList from './countries-iso';

export * from './countries-iso';
export { default as countriesIso } from './countries-iso';

// ── EU VAT countries (ISO alpha-2 lowercase) ──────────────────────────────────
const VAT_COUNTRIES = [
    'at', 'be', 'bg', 'cy', 'cz', 'de', 'dk', 'ee', 'es', 'fi',
    'fr', 'gr', 'hr', 'hu', 'ie', 'it', 'lt', 'lu', 'lv', 'mt',
    'nl', 'pl', 'pt', 'ro', 'se', 'si', 'sk'
];

// ── useChangePassword ─────────────────────────────────────────────────────────
/**
 * Hook for ChangePasswordForm.
 * Returns { control, onSubmitEnabled, onSubmit }
 */
export function useChangePassword() {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { isDirty, isValid }
    } = useForm({
        defaultValues: { password: '' },
        mode: 'onChange'
    });

    const onSubmitEnabled = isDirty && isValid && !isSubmitting;

    const onSubmit = handleSubmit(async (values) => {
        try {
            setIsSubmitting(true);
            await dispatch(updateUser({ password: values.password })).unwrap();
            reset();
        } catch (error) {
            showError(error);
        } finally {
            setIsSubmitting(false);
        }
    });

    return { control, onSubmitEnabled, onSubmit };
}

// ── useUpdateContactInformation ───────────────────────────────────────────────
/**
 * Hook for ContactInformationForm.
 * Returns { control, onSubmitEnabled, onSubmit }
 */
export function useUpdateContactInformation() {
    const dispatch = useDispatch();
    const authMe = useSelector(useAuthMe);
    const user = authMe?.data;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { isDirty, isValid }
    } = useForm({
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || ''
        },
        mode: 'onChange'
    });

    const onSubmitEnabled = isDirty && isValid && !isSubmitting;

    const onSubmit = handleSubmit(async (values) => {
        try {
            setIsSubmitting(true);
            await dispatch(updateUser(values)).unwrap();
        } catch (error) {
            showError(error);
        } finally {
            setIsSubmitting(false);
        }
    });

    return { control, onSubmitEnabled, onSubmit };
}

// ── useUpdateTaxInformation ───────────────────────────────────────────────────
/**
 * Hook for TaxInformationForm.
 * Returns { control, onSubmit, isSubmitting, showCompanyFields, hasVAT, country }
 */
export function useUpdateTaxInformation({ onSuccess } = {}) {
    const dispatch = useDispatch();
    const authMe = useSelector(useAuthMe);
    const taxInfo = authMe?.data?.taxInformation || {};
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        watch
    } = useForm({
        defaultValues: {
            type: taxInfo.type || TAX_PAYER_TYPE.COMPANY,
            companyName: taxInfo.companyName || '',
            country: taxInfo.country || '',
            vatNumber: taxInfo.vatNumber || '',
            taxId: taxInfo.taxId || '',
            firstName: taxInfo.firstName || '',
            lastName: taxInfo.lastName || '',
            address: taxInfo.address || '',
            zipCode: taxInfo.zipCode || '',
            city: taxInfo.city || '',
            email: taxInfo.email || ''
        },
        mode: 'onChange'
    });

    const type = watch('type');
    const country = watch('country');

    const showCompanyFields = type === TAX_PAYER_TYPE.COMPANY;
    const hasVAT = VAT_COUNTRIES.includes(country?.toLowerCase());

    const onSubmit = handleSubmit(async (values) => {
        try {
            setIsSubmitting(true);
            await dispatch(updateUser({ taxInformation: values })).unwrap();
            onSuccess?.();
        } catch (error) {
            showError(error);
        } finally {
            setIsSubmitting(false);
        }
    });

    return { control, onSubmit, isSubmitting, showCompanyFields, hasVAT, country };
}

// ── useCountryOptions ─────────────────────────────────────────────────────────
/**
 * Returns a sorted list of { label, value } country options for the select input.
 */
export function useCountryOptions() {
    const { i18n } = useTranslation();

    return useMemo(() => {
        const displayNames = new Intl.DisplayNames([i18n.language || 'en'], {
            type: 'region'
        });

        return countriesIsoList
            .map((code) => {
                try {
                    return {
                        value: code,
                        label: displayNames.of(code.toUpperCase()) || code.toUpperCase()
                    };
                } catch {
                    return { value: code, label: code.toUpperCase() };
                }
            })
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [i18n.language]);
}
