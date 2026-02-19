import { passwordStrength } from 'check-password-strength';

import { Box, Stack } from '@mui/material';

function Step({ reached = false, sx, ...props }) {
	return (
		<Box
			{...props}
			sx={{
				...sx,
				height: 4,
				flex: 1,
				borderRadius: '1px',
				transition: 'all 0.25s ease-in-out',
				'&.first': {
					bgcolor: reached ? 'currentColor' : 'divider'
				},
				'&.second': {
					bgcolor: reached ? 'currentColor' : 'divider'
				},
				'&.third': {
					bgcolor: reached ? 'currentColor' : 'divider'
				},
				'&.fourth': {
					bgcolor: reached ? 'currentColor' : 'divider'
				}
			}}
		/>
	);
}

export function LevelPassword({ password, ...props }) {
	const response = passwordStrength(password);
	const score = response.id;

	return (
		<Stack
			color={({ palette }) => {
				switch (score.toString()) {
					case '3':
						return palette.success.main;
					case '2':
						return palette.warning.main;
					case '1':
						return palette.warning.main;
					case '0':
					default:
						return palette.error.main;
				}
			}}
			direction="row"
			justifyContent="space-between"
			mb={3.5}
			spacing={0.5}
			useFlexGap
			width="100%"
			{...props}
		>
			<Step className="first" reached={response.id === 0 || !!password} />
			<Step className="second" reached={response.id >= 1} />
			<Step className="third" reached={response.id >= 2} />
			<Step className="fourth" reached={response.id >= 3} />
		</Stack>
	);
}
