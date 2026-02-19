import { Box, IconButton, Stack } from '@mui/material';
import { Link, useMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useMedia } from '@/hooks/responsive';
import routes from '@/routes';
import { localizedRoute } from '@/utils';
import { Logo } from '../Logo';
import { TopNavbarMenu } from './TopNavbarMenu';
import { MenuIcon } from '../Icons';
import { LoginButtons } from './LoginButtons';
import { AvailableCredits } from './AvailableCredits';

export const TOP_NAV_HEIGHT = 64;

export function TopNavbar({
	onCloseMenu,
	onOpenMenu,
	withMenu = true,
	...props
}) {
	const xs = useMedia('xs');
	const mdDown = useMedia('mdDown');
	const isEditor = !!useMatch(routes.editor);
	const loggedIn = useSelector(state => state.auth.loggedIn);

	return (
		<Box
			component="header"
			sx={{
				bgcolor: 'common.white',
				position: 'sticky',
				top: 0,
				zIndex: 1000
			}}
			{...props}
		>
			<Stack
				alignItems="center"
				direction="row"
				justifyContent="space-between"
				spacing={2}
				sx={{
					minHeight: TOP_NAV_HEIGHT,
					px: {
						xs: 2,
						md: 4
					}
				}}
			>
				<Stack
					alignItems="center"
					direction="row"
					height="100%"
					justifyContent="space-between"
					spacing={{ xs: 0, md: 2 }}
					width="100%"
				>
					<Link
						to={localizedRoute(loggedIn ? routes.myImages : '/')}
						style={{ lineHeight: 0 }}
					>
						<Logo iso={xs} />
					</Link>
					{mdDown && loggedIn && isEditor && <AvailableCredits />}
					{mdDown && withMenu && (
						<IconButton onClick={onOpenMenu} aria-label="Open menu">
							<MenuIcon />
						</IconButton>
					)}
					{!mdDown && withMenu && (
						<>
							<TopNavbarMenu />
							<LoginButtons />
						</>
					)}
				</Stack>
			</Stack>
		</Box>
	);
}
