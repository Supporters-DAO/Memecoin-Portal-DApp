import React from 'react'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import {
	useForm,
	SubmitHandler,
	useFieldArray,
	useWatch,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Sprite } from '@/components/ui/sprite'

const defaultValues = {
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
	admin: '',
	initial_capacity: '',
	config: {
		tx_storage_period: '',
		tx_payment: '',
	},
}

type Inputs = {
	name: string
	symbol: string
	decimals: number
	description: string
	external_links: {
		image: string
		website: string
		telegram: string
		twitter: string
		discord: string
	}
	initial_supply: string
	total_supply: string
	admin: string
	initial_capacity: string
	config: {
		tx_storage_period: string
		tx_payment: string
	}
}

const InputsSchema = z.object({
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

const resolver = zodResolver(InputsSchema)

export const CreateForm = () => {
	const { register, handleSubmit, formState, control } = useForm<Inputs>({
		mode: 'onChange',
		defaultValues,
		resolver,
	})

	const { errors } = formState

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		console.log(data)
		console.log('errors: ', errors)
	}

	return (
		<div className="ju my-10 flex items-start">
			<Link to="/" className="mr-40 flex items-center gap-3 text-xl">
				<Sprite name="arrow-left" className="h-6 w-6 " />
				Main page
			</Link>
			<div className="flex flex-col items-center gap-3">
				<h1 className="text-[28px] text-primary">Memecoin Creator</h1>
				<div className="flex w-[660px] flex-col gap-6 rounded-[40px] bg-blue-light p-10">
					<div className="flex justify-center gap-12">
						<div className="flex w-8  items-center justify-center rounded-full bg-primary">
							<span className="text-sm leading-none text-[#0F1B34]">1</span>
						</div>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D0D3D9]">
							<span className="text-sm leading-none text-[#1D2C4B]">2</span>
						</div>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D0D3D9]">
							<span className="text-sm leading-none text-[#1D2C4B]">3</span>
						</div>
					</div>
					<h3 className="text-center uppercase">Memecoin Details</h3>
					<form
						className="flex flex-col gap-5 font-poppins"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="flex flex-col gap-2">
							<Input
								label="Memecoin’s Name"
								placeholder="My Vara Coin"
								{...register('name')}
								error={errors.name?.message}
							/>
						</div>

						<div className="flex justify-between gap-5">
							<div className="flex w-full flex-col gap-2">
								<Input
									label="Symbol"
									placeholder="HUM"
									{...register('symbol')}
									error={errors?.symbol?.message}
								/>
							</div>
							<div className="flex w-full flex-col gap-2">
								<Input
									label="Decimals"
									placeholder="4"
									type="number"
									{...register('decimals')}
									error={errors?.decimals?.message}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<Input
								label="Image URL"
								placeholder="Add a link to meme image"
								{...register('external_links.image')}
								error={errors?.external_links?.image?.message}
							/>
						</div>

						<div className="flex justify-between gap-5">
							<div className="flex w-full flex-col gap-2">
								<Input
									label="Initial Supply"
									placeholder="Initial number of your memecoins"
									{...register('initial_supply')}
									error={errors?.initial_supply?.message}
								/>
							</div>
							<div className="flex w-full flex-col gap-2">
								<Input
									label="Total Supply"
									placeholder="Total number of your memecoins"
									{...register('total_supply')}
									error={errors?.total_supply?.message}
								/>
							</div>
						</div>

						<div className="flex justify-between gap-5">
							<div className="flex w-full flex-col gap-2">
								<Input
									label="Website (optional)"
									placeholder="Add a link to website"
									{...register('external_links.website')}
									error={errors?.external_links?.website?.message}
								/>
							</div>
							<div className="flex w-full flex-col gap-2">
								<Input
									label="Telegram (optional)"
									placeholder="Add a link to Telegram"
									{...register('external_links.telegram')}
									error={errors?.external_links?.telegram?.message}
								/>
							</div>
						</div>

						<div className="flex justify-between gap-5">
							<div className="flex w-full flex-col gap-2">
								<Input
									label="Twitter (optional)"
									placeholder="Add a link to Twitter"
									{...register('external_links.twitter')}
									error={errors?.external_links?.twitter?.message}
								/>
							</div>
							<div className="flex w-full flex-col gap-2">
								<Input
									label="Discord (optional)"
									placeholder="Add a link to Discord"
									{...register('external_links.discord')}
									error={errors?.external_links?.discord?.message}
								/>
							</div>
						</div>

						{/* <div className="flex flex-col gap-2">
							<InputArea
								label="Description"
								placeholder="Tell people more about your memecoin"
								{...register('description')}
							/>
							<span
								className={clsx(
									'text-right text-[13px] text-[#767F92]'
									// register('description'). && 'text-[#FF4F4F]'
								)}
							>
								{register('description').name.length}
								/500
							</span>
						</div> */}

						{/* TODO */}
						{/* <div className='font-poppins'>
							<p className='text-[15px]'>Project screenshots (optional)</p>
							<p className='text-[15px]'>
								<span className='text-primary font-medium'>Choose file </span>
								Up to 10 files. File formats: .jpg, .jpeg, .png, .gif. Max size: 1mb</p>
						</div> */}
						<button
							type="submit"
							className="mx-auto rounded-lg bg-[#D0D3D9] px-35 py-3 text-black hover:bg-primary"
						>
							Next
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
