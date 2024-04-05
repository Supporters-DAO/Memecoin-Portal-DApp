import React from 'react'
import { Link } from 'react-router-dom'
import { hasLength, isInRange, useForm, } from '@mantine/form';
import clsx from 'clsx'

import { InputArea } from '@/components/ui/InputArea'
import { Input } from '@/components/ui/input'
import { Sprite } from '@/components/ui/sprite'

const initialValues = {
	name: "",
	symbol: "",
	decimals: 0,
	description: "",
	external_links: {
		image: "",
		website: "",
		telegram: "",
		twitter: "",
		discord: "",
	},
	initial_supply: "",
	total_supply: "",
	admin: "",
	initial_capacity: "",
	config: {
		tx_storage_period: "",
		tx_payment: "",
	}
};

const validate = {
	name: hasLength({ min: 2, max: 10 }, 'This name is already used'),
	symbol: (value: string) => {
		if (!/^[A-Za-z]+$/.test(value)) {
			return 'Only latin letters are allowed';
		}
		if (value.length < 3 || value.length > 15) {
			return 'Symbol must be 2-3 characters long';
		}
		return null;
	},
	decimals: (value: number) => (value > 100 ? 'Max number of decimals for token is 100' : null),
	"external_links.image": (value: string) => {
		const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
		if (!pattern.test(value)) {
			return 'Invalid URL';
		}
		return null;
	},
	description: hasLength({ min: 2, max: 500 }, 'Description must be 2-10 characters long'),
	initial_supply: hasLength({ min: 2, max: 10 }, 'Initial Supply must be 2-10 characters long'),
	total_supply: hasLength({ min: 2, max: 10 }, 'Total Supply must be 2-10 characters long'),
};

export const CreateForm = () => {
	const form = useForm({ initialValues, validate });
	const { getInputProps } = form;
	console.log('form.values', form.values)
	console.log('asd', getInputProps('decimals'))
	return (
		<div className='flex items-start ju my-10'>
			<Link to="/" className='text-xl mr-40 flex items-center gap-3'>
				<Sprite name='arrow-left' className='w-6 h-6 ' />
				Main page
			</Link>
			<div className='flex flex-col items-center gap-3'>
				<h1 className='text-[28px] text-primary'>Memecoin Creator</h1>
				<div className='flex flex-col gap-6 bg-blue-light p-10 rounded-[40px] w-[660px]'>
					<div className='flex gap-12 justify-center'>
						<div className='bg-primary w-8  rounded-full flex items-center justify-center'>
							<span className='text-[#0F1B34] text-sm leading-none'>1</span>
						</div>
						<div className='bg-[#D0D3D9] w-8 h-8 rounded-full flex items-center justify-center'>
							<span className='text-[#1D2C4B] text-sm leading-none'>2</span>
						</div>
						<div className='bg-[#D0D3D9] w-8 h-8 rounded-full flex items-center justify-center'>
							<span className='text-[#1D2C4B] text-sm leading-none'>3</span>
						</div>
					</div>
					<h3 className='text-center uppercase'>Memecoin Details</h3>
					<form className='font-poppins flex flex-col gap-5' onSubmit={form.onSubmit(() => { })}>
						<div className='flex flex-col gap-2'>
							<Input
								label='Memecoin’s Name'
								placeholder='My Vara Coin'
								{...getInputProps('name')}
							/>
						</div>

						<div className='flex justify-between gap-5'>
							<div className='flex flex-col gap-2 w-full'>
								<Input
									label='Symbol'
									placeholder='HUM'
									{...getInputProps('symbol')}
								/>
							</div>
							<div className='flex flex-col gap-2 w-full'>
								<Input
									label='Decimals'
									placeholder='4'
									type='number'
									{...getInputProps('decimals')}
								/>
							</div>
						</div>

						<div className='flex flex-col gap-2'>
							<Input
								label='Image URL'
								placeholder='Add a link to meme image'
								{...getInputProps('external_links.image')}
							/>
						</div>

						<div className='flex justify-between gap-5'>
							<div className='flex flex-col gap-2 w-full'>
								<Input
									label='Initial Supply'
									placeholder='Initial number of your memecoins'
									{...getInputProps('initial_supply')}
								/>
							</div>
							<div className='flex flex-col gap-2 w-full'>
								<Input
									label='Total Supply'
									placeholder='Total number of your memecoins'
									{...getInputProps('total_supply')}
								/>
							</div>
						</div>

						<div className='flex justify-between gap-5'>
							<div className='flex flex-col gap-2 w-full'>
								<Input
									label='Website (optional)'
									placeholder='Add a link to website'
									{...getInputProps('external_links.website')}
								/>
							</div>
							<div className='flex flex-col gap-2 w-full'>
								<Input
									label='Telegram (optional)'
									placeholder='Add a link to Telegram'
									{...getInputProps('external_links.telegram')}
								/>
							</div>
						</div>

						<div className='flex justify-between gap-5'>
							<div className='flex flex-col gap-2 w-full'>
								<Input
									label="Twitter (optional)"
									placeholder='Add a link to Twitter'
									{...getInputProps('external_links.twitter')}
								/>
							</div>
							<div className='flex flex-col gap-2 w-full'>
								<Input
									label="Discord (optional)"
									placeholder='Add a link to Discord'
									{...getInputProps('external_links.discord')}
								/>
							</div>
						</div>

						<div className='flex flex-col gap-2'>
							<InputArea
								label="Description"
								placeholder='Tell people more about your memecoin'
								{...getInputProps('description')}
							/>
							<span className={clsx('text-right text-[13px] text-[#767F92]', getInputProps('description').error && "text-[#FF4F4F]")}>
								{getInputProps('description').value.length}
								/500
							</span>
						</div>
						{/* TODO */}
						{/* <div className='font-poppins'>
							<p className='text-[15px]'>Project screenshots (optional)</p>
							<p className='text-[15px]'>
								<span className='text-primary font-medium'>Choose file </span>
								Up to 10 files. File formats: .jpg, .jpeg, .png, .gif. Max size: 1mb</p>
						</div> */}
						<button className='mx-auto bg-[#D0D3D9] py-3 px-35 text-black rounded-lg hover:bg-primary'>Next</button>
					</form>
				</div>
			</div>
		</div>
	)
}
