import { z } from 'zod'

export const createTokenSchema = z.object({
	name: z
		.string({
			required_error: 'Required',
			invalid_type_error: 'Required',
		})
		.regex(/^[A-Za-z]+$/, { message: 'Only Latin letters are allowed' })
		.min(2, { message: 'Name must be at least 2 characters' })
		.max(10, { message: 'Name must be no more than 10 characters' }),
	symbol: z
		.string()
		.regex(/^[A-Za-z]+$/, { message: 'Only Latin letters are allowed' })
		.min(2, { message: 'Symbol must be at least 2 characters long' })
		.max(15, { message: 'Symbol must be no more than 15 characters long' }),
	decimals: z
		.number()
		.max(100, { message: 'Max number of decimals is 100' })
		.positive()
		.nullable()
		.refine((val) => val !== null, { message: 'Required' }) // Кастомная проверка на null
		.transform((value) => value ?? null),
	description: z
		.string()
		.regex(/^[\x00-\x7F]+$/, { message: 'Only Latin letters are allowed' })
		.min(2, { message: 'Description must be at least 2 characters long' })
		.max(500, {
			message: 'Description must be no more than 500 characters long',
		}),
	external_links: z.object({
		image: z
			.string({ required_error: 'Required' })
			.url({ message: 'Invalid URL' }),
			// .refine((url) => /\.jpg$|\.jpeg$|\.png$/i.test(url), { message: 'URL must be an image link (JPG or PNG)' }),
		website: z
			.string()
			.min(1, { message: 'Website must be at least 2 characters long' })
			.url()
			.or(z.literal(''))
			.optional(),
		telegram: z
			.string()
			.min(1, { message: 'Telegram must be at least 2 characters long' })
			.url()
			.or(z.literal(''))
			.optional(),
		twitter: z
			.string()
			.min(1, { message: 'Twitter must be at least 2 characters long' })
			.url()
			.or(z.literal(''))
			.optional(),
		discord: z
			.string()
			.min(1, { message: 'Discord must be at least 2 characters long' })
			.url()
			.or(z.literal(''))
			.optional(),
		tokenomics: z
			.string()
			.min(1, { message: 'Tokenomics must be at least 2 characters long' })
			.url()
			.or(z.literal(''))
			.optional(),
	}),
	initial_supply: z
		.number()
		.min(2, { message: 'Initial Supply must be at least 2 characters long' })
		.positive()
		.nullable()
		.refine((val) => val !== null, { message: 'Required' }) // Кастомная проверка на null
		.transform((value) => value ?? null),

	total_supply: z
		.number()
		.min(2, { message: 'Total Supply must be at least 2 characters long' })
		.positive()
		.nullable()
		.refine((val) => val !== null, { message: 'Required' }) // Кастомная проверка на null
		.transform((value) => value ?? null),
})

export type ICreateTokenForm = z.infer<typeof createTokenSchema>

export const createTokenDefault = {
	name: '',
	symbol: '',
	decimals: null,
	description: '',
	external_links: {
		image: '',
		website: '',
		telegram: '',
		twitter: '',
		discord: '',
		tokenomics: '',
	},
	initial_supply: null,
	total_supply: null,
	// admin: '',
	// initial_capacity: '',
	// config: {
	//   tx_storage_period: '',
	//   tx_payment: '',
	// },
} satisfies ICreateTokenForm