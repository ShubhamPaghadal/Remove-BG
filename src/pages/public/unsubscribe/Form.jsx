import { useState, useEffect } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';

import { Card } from '@/components/Card';
import { TextFieldController } from '@/components/TextFieldController/index.js';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
	CfCaptchaWidget,
	useLoadCfTurnstileScript,
	useCfTurnstileChallenge
} from '@/components/CfCaptchaWidget/index.js';
import stripeModel from '@/models/stripe.js';
import { localizedRoute } from '@/utils';
import { Link } from 'react-router-dom';
import routes from '@/routes';
import successIcon from '@/images/success.svg';

export function Form({ boxSx, cardSx, ...props }) {
	const { t } = useTranslation();
	const [success, setSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useLoadCfTurnstileScript();

	const validationSchema = Yup.object({
		email: Yup.string().email().required()
	});

	const { control, watch, getValues, handleSubmit } = useForm({
		resolver: yupResolver(validationSchema),
		mode: 'onChange',
		defaultValues: {
			email: ''
		}
	});

	const values = getValues();
	const {
		cfChallengeToken,
		cfChallengeCompleted,
		cfIdempotencyKey,
		triggerChallenge
	} = useCfTurnstileChallenge({
		action: 'contact'
	});

	async function onSubmit() {
		const formValues = { ...values, cfChallengeToken, cfIdempotencyKey };
		setErrorMessage('');

		try {
			const response = await stripeModel.unsubscribe(formValues);

			if (response?.code === 'invalid_email') {
				return setErrorMessage(t('unsubscribe.errors.invalidEmail'));
			}

			if (response?.code === 'already_unsubscribed') {
				return setErrorMessage(t('unsubscribe.errors.alreadyUnsubscribed'));
			}

			if (response.success) {
				return setSuccess(true);
			}
		} catch (error) {
			setErrorMessage(t('unsubscribe.errors.500'));
		}
	}

	const email = watch('email');

	useEffect(() => {
		if (email.includes('@')) {
			triggerChallenge();
		}
	}, [email]);

	return (
		<Box component="section" pb={4} mb={8} {...props}>
			<Container
				disableGutters
				maxWidth="sm"
				sx={{
					maxWidth: ['319px', '793px']
				}}
			>
				<Card
					sx={{
						p: 2,
						bgcolor: 'white',
						boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.1)',
						backdropFilter: 'blur(1px)',
						...cardSx
					}}
				>
					{success ? (
						<Box
							textAlign="center"
							mt={[0, 4]}
							mb={2}
							pt="1px"
							px="2px"
							sx={boxSx}
							gap="24px"
							display="flex"
							flexDirection="column"
							alignItems="center"
						>
							<img src={successIcon} alt="success" />
							<Box>
								<Typography variant="body3">
									{t('unsubscribe.success.title')}
								</Typography>
								<Typography variant="body1">
									{t('unsubscribe.success.subtitle')}
								</Typography>
							</Box>
							<Button
								variant="contained"
								onClick={() => setSuccess(false)}
							>
								{t('unsubscribe.success.goBack')}
							</Button>
						</Box>
					) : (
						<Box
							textAlign="center"
							mt={[0, 4]}
							mb={2}
							pt="1px"
							px="2px"
							component="form"
							onSubmit={handleSubmit(onSubmit)}
							sx={{
								...boxSx,
								maxWidth: '596px',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								margin: '0 auto'
							}}
						>
							<Box
								mb={['13px', '27px']}
								sx={{
									display: 'flex',
									height: '54px',
									alignItems: 'center',
									maxWidth: '590px'
								}}
							>
								<Typography
									variant="body3"
									color="text.secondary"
									sx={{
										fontSize: [12, 20],
										fontWeight: 400,
										lineHeight: ['20px', '28px']
									}}
								>
									{t('unsubscribe.description')}
								</Typography>
							</Box>
							<Stack alignItems="center">
								<TextFieldController
									fullWidth
									control={control}
									id="email"
									name="email"
									placeholder={t(
										'contact.form.fields.email.placeholder'
									)}
									variant="filled"
								/>
								{errorMessage && (
									<Box
										sx={{
											backgroundColor: 'error.main',
											borderRadius: '8px',
											padding: '8px',
											margin: '16px',
											fontWeight: 500
										}}
									>
										<Typography variant="body0" color="white">
											{errorMessage}
										</Typography>
									</Box>
								)}

								<CfCaptchaWidget />

								<Button
									sx={{ alignSelf: 'center' }}
									loading={false}
									type="submit"
									variant="contained"
									disabled={!cfChallengeCompleted}
								>
									{t('unsubscribe.cancelSubscription')}
								</Button>
								<Typography
									variant="body1"
									color="text.secondary"
									sx={{
										maxWidth: '590px',
										marginTop: '24px',
										lineHeight: '24px'
									}}
								>
									<Trans
										i18nKey="unsubscribe.rememberEmail"
										components={{
											anchor1: (
												<Link
													style={{
														fontWeight: 'bold',
														color: '#A182F3'
													}}
													to={localizedRoute(routes.contact)}
												/>
											)
										}}
									/>
								</Typography>
							</Stack>
						</Box>
					)}
				</Card>
			</Container>
		</Box>
	);
}
