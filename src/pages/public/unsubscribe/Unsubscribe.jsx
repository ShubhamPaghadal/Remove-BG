import { Box } from '@mui/material';
import { Hero } from './Hero';
import { Form } from './Form';
import { Support } from './Support';
import { Payment } from './Payment';

export function Unsubscribe() {
	return (
		<Box
			sx={{ backgroundColor: '#F7F7F7', width: '100%', maxWidth: 'unset' }}
		>
			<Hero />
			<Form />
			<Payment />
			<Support />
		</Box>
	);
}
