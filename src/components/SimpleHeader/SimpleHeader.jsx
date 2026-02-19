import { useSelector } from 'react-redux';

import { Box, Stack } from '@mui/material';
import routes from '@/routes';
import { APP_BASE_URL } from '@/config';
import { useMedia } from '@/hooks/responsive';

import { CircleUser } from '../Icons/CircleUser';
import { Logo } from '../Logo';

export function SimpleHeader() {
	const { loggedIn, user } = useSelector(state => state.auth);
	const smDown = useMedia('smDown');

	return (
		<Box
			sx={{
				boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)'
			}}
		>
			<Box sx={{ maxWidth: 1280, margin: 'auto', px: 3 }}>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					sx={{ height: 68 }}
				>
					<a
						href={`${APP_BASE_URL}${routes.myImages}`}
						style={{ lineHeight: 0 }}
					>
						<Logo iso={smDown} />
					</a>
					{loggedIn && (
						<Stack direction="row" alignItems="center" spacing={1}>
							<span>{user.firstname || user.email}</span>
							<CircleUser />
						</Stack>
					)}
				</Stack>
			</Box>
		</Box>
	);
}
