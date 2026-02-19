import { SOCIAL_LINKS } from '@/config';
import { Box, Stack, SvgIcon } from '@mui/material';

const items = [
	{
		name: 'X',
		svgPath:
			'M13.298 10.421 18.36 5h-1.224l-4.387 4.696L9.204 5H5.037l5.4 7.17L5 18h1.225l4.76-5.104L14.834 18H19l-5.711-7.57.009-.009ZM6.846 5.888h1.91L17.2 17.093h-1.91L6.837 5.888h.009Z',
		url: SOCIAL_LINKS.x
	},
	{
		name: 'Facebook',
		svgPath:
			'M16.6711 15.4688L17.2031 12H13.875V9.74897C13.875 8.79998 14.3399 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6576 4.6875C11.9165 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C10.7359 23.9501 11.3621 24 12 24C12.6379 24 13.264 23.9501 13.875 23.8542V15.4688H16.6711Z',
		url: SOCIAL_LINKS.facebook
	},
	{
		name: 'Linkedin',
		svgPath:
			'M8.3895 9.8184H5.5945V18.2495H8.3895V9.8184ZM6.9979 8.6673C6.1928 8.7363 5.4911 8.1382 5.4106 7.3331 5.3416 6.5279 5.9397 5.8263 6.7449 5.7457 6.8254 5.7457 6.9174 5.7457 6.9979 5.7457 7.8031 5.6767 8.5162 6.2633 8.5853 7.0685 8.6543 7.8737 8.0677 8.5868 7.2625 8.6558 7.182 8.6558 7.09 8.6558 6.9979 8.6558V8.6673ZM18.5 18.2496H15.6934V13.7408C15.6934 12.5905 15.2909 11.8314 14.2787 11.8314 13.6345 11.8314 13.0479 12.2455 12.8409 12.8551 12.7719 13.0736 12.7374 13.3152 12.7489 13.5452V18.2496H9.9423V9.8185H12.7489V10.9687C13.2665 10.0715 14.2327 9.5309 15.2679 9.5769 17.1082 9.5769 18.5 10.7847 18.5 13.3727V18.2496Z',
		url: SOCIAL_LINKS.linkedin
	}
];

export function Social() {
	return (
		<Stack spacing={1.5} direction="row" useFlexGap>
			{items.map(({ name, svgPath, url }) => (
				<Box
					key={name}
					component="a"
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={name}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 24,
						height: 24,
						borderRadius: '50%',
						backgroundColor: '#fff',
						color: 'text.primary'
					}}
				>
					<SvgIcon width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path d={svgPath} fill="currentColor" />
					</SvgIcon>
				</Box>
			))}
		</Stack>
	);
}
