import { Box } from '@mui/material';
import { Faq } from './Faq';
import { Hero } from './Hero';

export function Pricing() {
	return (
		<>
			<Hero />
			<Box px={{ xs: 2, md: 0 }}>
				<Faq />
			</Box>
		</>
	);
}
