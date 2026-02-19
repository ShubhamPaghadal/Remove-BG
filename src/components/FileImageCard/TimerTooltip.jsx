import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/components/Tooltip';
import { useHasStorageCharge } from '@/hooks';
import { STORAGE_DAYS } from '@/config';

export function TimerTooltip({ children }) {
	const { t } = useTranslation();
	const hasStorageCharge = useHasStorageCharge();
	const title = hasStorageCharge
		? t('myImages.timerTooltipStorage', { storageDays: STORAGE_DAYS })
		: t('myImages.timerTooltip');

	return <Tooltip title={title}>{children}</Tooltip>;
}
