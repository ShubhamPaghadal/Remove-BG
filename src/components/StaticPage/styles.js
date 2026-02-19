import { palette } from '@/theme/palette';
import { typography } from '@/theme/typography';
import { Container as ContainerBase } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(ContainerBase)`
	p,
	ul {
		margin: 0;
		margin-top: 12px;
		@media (max-width: 600px) {
			margin-top: 10px;
		}
	}

	ul {
		@media (max-width: 600px) {
			padding-left: 24px;
		}
	}

	p,
	li {
		${typography.body0}
		line-height: 20px;
		@media (min-width: 600px) {
			${typography.body1}
			line-height: 24px;
		}
		color: ${palette.text.secondary};
	}

	li > ul {
		margin-top: 0;
	}

	.no-bullets-list {
		list-style-type: none;
		padding-inline-start: 0;

		li {
			list-style: none;
		}
	}

	h3 {
		margin: 0;
		font-size: 16px;
		font-weight: 700;
		line-height: 24px;
		margin-top: 20px;
		@media (max-width: 600px) {
			padding: 0 8px;
			margin-top: 16px;
		}
	}

	h4 {
		margin: 0;
		color: #656565;
		font-size: 16px;
		font-weight: 700;
		line-height: 24px;
		margin-top: 20px;
	}

	h5 {
		margin: 0;
		margin-top: 20px;
		font-size: 14px;
		font-weight: 400;
		line-height: 24px;
		color: #656565;
	}

	a:hover {
		text-decoration: underline;
	}
`;
