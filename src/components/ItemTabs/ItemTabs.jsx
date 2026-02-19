import { Button } from '@mui/material';

export function ItemTabs({
	onClick = null,
	label = '',
	selected = false,
	sx,
	...props
}) {
	return (
		<Button
			onClick={onClick}
			variant="contained"
			px={2}
			py={1}
			{...props}
			sx={{
				backgroundColor: selected ? '#DFF265' : '#00000000',
				color: selected ? '#141414' : '#B8B8B8',
				borderColor: selected ? '#DFF265' : '#B8B8B8',
				borderWidth: '1px',
				borderStyle: 'solid',
				fontSize: '16px',
				lineHeight: '24px',
				fontWeight: 700,
				...sx,
				'&:hover': {
					backgroundColor: selected ? '#DFF265' : '#00000000'
				}
			}}
		>
			{label}
		</Button>
	);
}
