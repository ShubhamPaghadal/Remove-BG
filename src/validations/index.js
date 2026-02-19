import * as Yup from 'yup';
import { TAX_PAYER_TYPE } from '@/config.js';
import {
	requiresTaxId,
	requiresVat,
	validateVatPrefix,
	validateVat
} from '@/utils/billing';

const passwordSchema = Yup.string().min(3).max(20);

const schemas = {
	login() {
		return Yup.object({
			email: Yup.string().email().required(),
			password: passwordSchema.required()
		});
	},
	signUp() {
		return Yup.object({
			email: Yup.string().email().required(),
			password: passwordSchema.required()
		});
	},
	recoverPassword() {
		return Yup.object({
			email: Yup.string().email().required()
		});
	},
	contactInformation() {
		return Yup.object({
			firstName: Yup.string().required(),
			lastName: Yup.string().required(),
			email: Yup.string().email().required(),
			city: Yup.string()
		});
	},
	changePassword() {
		return Yup.object({
			password: passwordSchema.required()
		});
	},
	resetPassword(t) {
		return Yup.object({
			password: passwordSchema.required(),
			repeatPassword: Yup.string()
				.oneOf([Yup.ref('password')], t('validations.samePassword'))
				.required()
		});
	},
	taxInformation({ t = () => '', sync } = {}) {
		return Yup.object({
			type: Yup.string().oneOf(Object.values(TAX_PAYER_TYPE)).required(),
			companyName: Yup.string().when('type', {
				is: TAX_PAYER_TYPE.COMPANY,
				then: schema => schema.required(),
				otherwise: schema => schema.nullable()
			}),
			vatNumber: Yup.string().when(
				['country', 'type'],
				([country, type], schema) => {
					if (
						!requiresVat({
							country,
							type
						})
					) {
						return schema.nullable();
					}

					if (sync) {
						return schema
							.test({
								name: 'vatNumberPrefix',
								test: validateVatPrefix(t)
							})
							.required();
					}

					return schema
						.test({
							name: 'vatNumberPrefix',
							test: validateVatPrefix(t)
						})
						.test({
							name: 'vatNumber',
							test: validateVat(t)
						})
						.required();
				}
			),
			taxId: Yup.string().when('country', {
				is: country => requiresTaxId(country),
				then: schema => schema.required(),
				otherwise: schema => schema.nullable()
			}),
			firstName: Yup.string().required(),
			lastName: Yup.string().required(),
			email: Yup.string().email().nullable(),
			zipCode: Yup.string().required(),
			country: Yup.string().required(),
			city: Yup.string().required(),
			address: Yup.string().required()
		});
	}
};

export default schemas;
