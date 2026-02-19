import { Box, Stack } from '@mui/material';
import { PageTitle } from '../PageTitle';

export function PageLayout({ title, children }) {
	return (
		<Box>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
			>
				<PageTitle>{title} </PageTitle>
			</Stack>

			<Box mt={2}>{children}</Box>
		</Box>
	);
}
