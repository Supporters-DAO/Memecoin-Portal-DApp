import { z } from 'zod'

export const createTokenSchema = z
	.object({
		name: z
			.string({
				required_error: 'Required',
				invalid_type_error: 'Required',
			})
			.regex(/^([A-Za-z ]+)$/, { message: 'Only Latin letters are allowed' })
			.min(2, { message: 'Name must be at least 2 characters' })
			.max(20, { message: 'Name must be no more than 10 characters' }),
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
			.refine((val) => val !== null, { message: 'Required' })
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
				// .string()
				.string()
				.min(1, { message: 'Website must be at least 2 characters long' })
				.url()
				.includes('https://', { message: 'Invalid URL' })
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
			.max(3000000000000, {
				message: 'Initial Supply must be no more than 3000000000000',
			})
			.positive()
			.nullable()
			.refine((val) => val !== null, { message: 'Required' })
			.transform((value) => value ?? null),

		total_supply: z
			.number()
			.min(2, { message: 'Total Supply must be at least 2 characters long' })
			.max(3000000000000, {
				message: 'Total Supply must be no more than 3000000000000',
			})
			.positive()
			.nullable()
			.refine((val) => val !== null, { message: 'Required' })
			.transform((value) => value ?? null),
	})
	.refine(
		(data) =>
			data.initial_supply &&
			data.total_supply &&
			data.initial_supply > 0 &&
			data.total_supply > 0 &&
			data.initial_supply <= data.total_supply,
		{
			message: 'Initial Supply cannot be greater than Total Supply',
			path: ['initial_supply'],
		}
	)
	.refine(
		(data) =>
			data.initial_supply &&
			data.total_supply &&
			data.initial_supply > 0 &&
			data.total_supply > 0 &&
			data.total_supply >= data.initial_supply,
		{
			message: 'Initial Supply cannot be greater than Total Supply',
			path: ['total_supply'],
		}
	)

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
} satisfies ICreateTokenForm
