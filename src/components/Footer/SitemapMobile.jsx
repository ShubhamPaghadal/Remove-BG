import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Stack,
	Typography
} from '@mui/material';
import sitemap from './sitemapData';
import { AddIcon } from '../Icons';

const borderColor = '#ffffff99';

export function SitemapMobile() {
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(null);

	function handleChange(index, isExpanded) {
		setExpanded(isExpanded ? index : false);
	}

	return (
		<Box width="100%" sx={{ borderTop: `1px solid ${borderColor}` }}>
			{sitemap.map(({ title, titleKey, links }, index) => (
				<Accordion
					key={index}
					sx={{ '&:before': { backgroundColor: borderColor } }}
					expanded={expanded === index}
					onChange={(event, isExpanded) => handleChange(index, isExpanded)}
				>
					<AccordionSummary
						expandIcon={<AddIcon />}
						sx={{
							'.MuiAccordionSummary-expandIconWrapper': {
								color: '#fff'
							},
							'.MuiAccordionSummary-content': {
								margin: '23px 0'
							}
						}}
					>
						<Typography color="white" fontWeight="bold">
							{title || t(titleKey)}
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Stack spacing={2.5} py={1}>
							{links.map(({ labelKey, to }) => (
								<Typography
									key={labelKey}
									color="#B8B8B8"
									component={Link}
									to={to}
								>
									{t(labelKey)}
								</Typography>
							))}
						</Stack>
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
}
