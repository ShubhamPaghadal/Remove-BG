import {
	alpha,
	Box,
	Container,
	MenuItem,
	Select,
	Stack,
	Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button';

import { Card } from '@/components/Card';
import { TextFieldController } from '@/components/TextFieldController/index.js';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ImageInputWithDropzone } from '@/pages/public/contact/ImageInputWithDropzone.jsx';
import { useNavigate } from 'react-router-dom';
import routes from '@/routes.js';
import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { ChevronDownIcon } from '@/components/Icons';
import {
	CfCaptchaWidget,
	useLoadCfTurnstileScript,
	useCfTurnstileChallenge
} from '@/components/CfCaptchaWidget/index.js';
import contactModel from '@/models/contact.js';
import { showError } from '@/utils';
import { useSelector } from 'react-redux';
import { useAuthMe } from '@/store/auth/selectors';
import { getValueIfRtl, removeValueIfRtl } from '@/utils/rtlStyle';
import SuccessCard from './FormSuccess';

const MAX_FILE_SIZE_MB = 2;
const ACCEPTED_TYPES = [
	'image/png',
	'image/jpeg',
	'image/webp',
	'application/pdf'
];

export function Form({ boxSx, cardSx, ...props }) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const authMe = useSelector(useAuthMe);
	const isLogged = !!authMe.data;
	const [success, setSuccess] = useState(false);

	useLoadCfTurnstileScript();

	const validationSchema = Yup.object({
		email: Yup.string().email().required(),
		reason: Yup.string().required(),
		subject: Yup.string().required(),
		message: Yup.string().required(),
		image: Yup.mixed()
			.optional()
			.nullable()
			.test({
				name: 'fileSize',
				message: t('contact.form.fields.image.validations.fileSize', {
					size: MAX_FILE_SIZE_MB
				}),
				test: file => {
					if (!file || typeof file === 'string') {
						return true;
					}
					const fileSizeInMb = file.size / (1024 * 1024);

					return fileSizeInMb <= MAX_FILE_SIZE_MB;
				}
			})
			.test(
				'fileFormat',
				t('contact.form.fields.image.validations.fileFormat'),
				value => {
					return !value || (value && ACCEPTED_TYPES.includes(value.type));
				}
			)
	});

	const { control, watch, formState, getValues, handleSubmit, setValue } =
		useForm({
			resolver: yupResolver(validationSchema),
			mode: 'onChange',
			defaultValues: {
				email: isLogged ? authMe.data.email : '',
				reason: '',
				subject: '',
				message: '',
				image: null
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
		const form = { ...values, cfChallengeToken, cfIdempotencyKey };

		try {
			await contactModel.postForm(form);
			setSuccess(true);
		} catch (error) {
			showError(error);
		}
	}

	const loggedInReasonOptions = useMemo(
		() => [
			t('contact.form.fields.reason.options.type3'),
			t('contact.form.fields.reason.options.type4'),
			t('contact.form.fields.reason.options.type5'),
			t('contact.form.fields.reason.options.type6'),
			t('contact.form.fields.reason.options.type7')
		],
		[t]
	);

	const loggedOffReasonOptions = useMemo(
		() => [
			t('contact.form.fields.reason.options.type1'),
			t('contact.form.fields.reason.options.type2'),
			t('contact.form.fields.reason.options.type7')
		],
		[t]
	);

	const reasonOptions = isLogged
		? loggedInReasonOptions
		: loggedOffReasonOptions;

	const image = watch('image');
	const email = watch('email');
	const reason = watch('reason');

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
					maxWidth: ['319px', '590px']
				}}
			>
				{success ? (
					<SuccessCard />
				) : (
					<Card
						sx={{
							p: 2,
							bgcolor: alpha('#fff', 0.8),
							boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.1)',
							backdropFilter: 'blur(1px)',
							...cardSx
						}}
					>
						<Box
							textAlign="center"
							mt={[0, 4]}
							mb={2}
							pt="1px"
							px="2px"
							component="form"
							onSubmit={handleSubmit(onSubmit)}
							sx={boxSx}
						>
							<Box
								px={[1.5, 3]}
								mb={['13px', '27px']}
								sx={{
									display: 'flex',
									height: '54px',
									alignItems: 'center'
								}}
							>
								<Typography
									variant="body3"
									color={
										authMe.data ? 'text.primary' : 'text.secondary'
									}
									sx={{
										fontSize: [12, 20],
										fontWeight: authMe.data ? 700 : 400,
										lineHeight: ['20px', '28px']
									}}
								>
									{t('contact.form.title')}
								</Typography>
							</Box>
							<Stack spacing={[3.25, 3]}>
								{!authMe.data && (
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
								)}

								<Select
									displayEmpty
									variant="filled"
									id="reason"
									name="reason"
									value={reason || ''}
									sx={theme => ({
										minWidth: 100,
										color: '#B8B8B8',
										textAlign: 'start',
										'.MuiSelect-icon': {
											right: removeValueIfRtl({
												theme,
												value: '7px'
											}),
											left: getValueIfRtl({ theme, value: '7px' })
										}
									})}
									IconComponent={ChevronDownIcon}
									renderValue={value =>
										value ? (
											<Typography sx={{ color: 'black' }}>
												{value}
											</Typography>
										) : (
											t('contact.form.fields.reason.placeholder')
										)
									}
								>
									<Box
										style={{
											width: '100%',
											maxHeight: 200,
											overflow: 'auto'
										}}
									>
										{reasonOptions.map(r => (
											<MenuItem
												key={r}
												onClick={() =>
													setValue('reason', r, {
														shouldTouch: true,
														shouldValidate: true
													})
												}
												value={r}
											>
												{r}
											</MenuItem>
										))}
									</Box>
								</Select>
								<TextFieldController
									variant="filled"
									fullWidth
									control={control}
									id="subject"
									name="subject"
									placeholder={t(
										'contact.form.fields.subject.placeholder'
									)}
								/>
								<TextFieldController
									variant="filled"
									fullWidth
									control={control}
									multiline
									id="message"
									name="message"
									placeholder={t(
										'contact.form.fields.message.placeholder'
									)}
									rows={5}
								/>
								<ImageInputWithDropzone
									name="image"
									dropzoneProps={{
										onDrop: files => {
											if (files.length > 0) {
												setValue('image', files[0], {
													shouldTouch: true,
													shouldValidate: true
												});
											}
										}
									}}
									accept={ACCEPTED_TYPES}
									control={control}
									value={image}
									error={formState.errors.image}
									onDeleteFile={() =>
										setValue('image', null, {
											shouldTouch: true,
											shouldValidate: true
										})
									}
								/>

								<CfCaptchaWidget style={{ minHeight: 35 }} />

								<Button
									sx={{ alignSelf: 'center' }}
									loading={false}
									type="submit"
									variant="contained"
									disabled={
										!cfChallengeCompleted ||
										!formState.isValid ||
										formState.isSubmitting
									}
								>
									{t('contact.form.submit')}
								</Button>

								<Typography
									variant="body1"
									color="text.secondary"
									sx={{ fontSize: [12, 14] }}
								>
									{t('contact.form.footer')}{' '}
									<Box
										component="strong"
										onClick={() => navigate(routes.home)}
										sx={theme => ({
											cursor: 'pointer',
											color: theme.palette.primary.main
										})}
									>
										{t('contact.form.privacyPolicy')}
									</Box>
								</Typography>
							</Stack>
						</Box>
					</Card>
				)}
			</Container>
		</Box>
	);
}
