import { useMedia } from '@/hooks/responsive';
import { Typography } from '@mui/material';

export function PageTitle({ children, sx, ...props }) {
	const mdDown = useMedia('mdDown');
	return (
		<Typography
			variant="h1"
			{...props}
			sx={{
				...(mdDown && { fontSize: 28 }),
				...sx
			}}
		>
			{children}
		</Typography>
	);
}
