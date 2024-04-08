import { z } from 'zod'

export const createTokenSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters' })
		.max(10, { message: 'Name must be no more than 10 characters' }),
	symbol: z
		.string()
		.regex(/^[A-Za-z]+$/, { message: 'Only Latin letters are allowed' })
		.min(3, { message: 'Symbol must be at least 3 characters long' })
		.max(15, { message: 'Symbol must be no more than 15 characters long' }),
	decimals: z.number().max(100, { message: 'Max number of decimals is 100' }),
	description: z
		.string()
		.min(2, { message: 'Description must be at least 2 characters long' })
		.max(500, {
			message: 'Description must be no more than 500 characters long',
		}),
	external_links: z.object({
		image: z.string().url({ message: 'Invalid URL' }),
		website: z.string().url({ message: 'Invalid URL' }).optional(),
		telegram: z.string().url({ message: 'Invalid URL' }).optional(),
		twitter: z.string().url({ message: 'Invalid URL' }).optional(),
		discord: z.string().url({ message: 'Invalid URL' }).optional(),
	}),
	initial_supply: z
		.string()
		.min(2, { message: 'Initial Supply must be at least 2 characters long' })
		.max(10, {
			message: 'Initial Supply must be no more than 10 characters long',
		}),
	total_supply: z
		.string()
		.min(2, { message: 'Total Supply must be at least 2 characters long' })
		.max(10, {
			message: 'Total Supply must be no more than 10 characters long',
		}),
})

export type ICreateTokenForm = z.infer<typeof createTokenSchema>

export const createTokenDefault = {
	name: '',
	symbol: '',
	decimals: 0,
	description: '',
	external_links: {
		image: '',
		website: '',
		telegram: '',
		twitter: '',
		discord: '',
	},
	initial_supply: '',
	total_supply: '',
	// admin: '',
	// initial_capacity: '',
	// config: {
	//   tx_storage_period: '',
	//   tx_payment: '',
	// },
} satisfies ICreateTokenForm
