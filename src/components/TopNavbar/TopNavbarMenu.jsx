import routes from '@/routes';
import {
	List,
	ListItemButton,
	ListItemIcon,
	Stack,
	Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { localizedRoute } from '@/utils';
import { CreditCardIcon, PsycologyIcon, FaqIcon } from '../Icons';

const menuItems = [
	{
		id: 'how-to-use',
		label: 'pageTitles.howToUse',
		icon: <PsycologyIcon />,
		path: localizedRoute(routes.howToUse)
	},
	{
		id: 'pricing',
		label: 'pageTitles.pricing',
		icon: <CreditCardIcon />,
		path: localizedRoute(routes.pricing)
	},
	{
		id: 'faq',
		label: 'footer.faq',
		icon: <FaqIcon />,
		path: localizedRoute(routes.faq)
	}
];

export function TopNavbarMenu({
	direction = 'row',
	onClickItem,
	showIcons = false
}) {
	const { t } = useTranslation();
	return (
		<Stack direction={direction}>
			<Stack
				spacing={{ xs: 1, md: 2 }}
				direction={direction}
				compoennt={List}
			>
				{menuItems.map(item => {
					return (
						<ListItemButton
							key={item.id}
							LinkComponent={NavLink}
							onClick={onClickItem}
							to={item.path}
							sx={{
								minHeight: 40,
								borderRadius: 2,
								color: 'text.secondary',
								px: { xs: 1.5, md: 2 },
								'&.active': {
									bgcolor: showIcons ? 'primary.lightest' : undefined,
									color: 'text.primary'
								}
							}}
						>
							{showIcons && (
								<ListItemIcon sx={{ mr: 1, minWidth: '0' }}>
									{item.icon}
								</ListItemIcon>
							)}
							<Stack direction="row" alignItems="center" width={1}>
								<Typography
									sx={{
										fontWeight: 600,
										color: 'inherit'
									}}
								>
									{t(item.label)}
								</Typography>
							</Stack>
						</ListItemButton>
					);
				})}
			</Stack>
		</Stack>
	);
}
