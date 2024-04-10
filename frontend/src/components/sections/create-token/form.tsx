'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Sprite } from '@/components/ui/sprite'
import {
	createTokenDefault,
	createTokenSchema,
	ICreateTokenForm,
} from '@/components/sections/create-token/schema'
import Link from 'next/link'
import { InputArea } from '@/components/ui/InputArea'
import { useAtom } from 'jotai'

import { dataTokenAtom, stepAtom } from '.'
import { cn } from '@/lib/utils'

export const CreateForm = () => {
	const [step, setStep] = useAtom(stepAtom)
	const [dataToken, setDataToken] = useAtom(dataTokenAtom)

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm<ICreateTokenForm>({
		mode: 'onChange',
		defaultValues: createTokenDefault,
		resolver: zodResolver(createTokenSchema),
	})

	const onSubmit = (data: ICreateTokenForm) => {
		if (data) {
			setDataToken(data)
			setStep('confirm')
		}
	}

	return (
		<div className="ju my-10 flex items-start">
			<Link href="/" className="mr-40 flex items-center gap-3 text-xl">
				<Sprite name="arrow-left" className="size-6 " />
				Main page
			</Link>
			<div className="flex flex-col items-center gap-3">
				<h1 className="text-[28px] text-primary">Memecoin Creator</h1>
				<div className="flex w-[660px] flex-col gap-6 rounded-[40px] bg-blue-light p-10">
					<div className="flex justify-center gap-12">
						<div className="flex w-8  items-center justify-center rounded-full bg-primary">
							<span className="text-sm leading-none text-[#0F1B34]">1</span>
						</div>
						<div className="flex size-8 items-center justify-center rounded-full bg-[#D0D3D9]">
							<span className="text-sm leading-none text-[#1D2C4B]">2</span>
						</div>
						<div className="flex size-8 items-center justify-center rounded-full bg-[#D0D3D9]">
							<span className="text-sm leading-none text-[#1D2C4B]">3</span>
						</div>
					</div>
					<h3 className="text-center uppercase">Memecoin Details</h3>
					<form
						className="flex flex-col gap-5 font-poppins"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="flex flex-col gap-2">
							<Controller
								name="name"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<Input
										{...field}
										label="Memecoin’s Name"
										placeholder="My Vara Coin"
										error={error?.message}
									/>
								)}
							/>
						</div>

						<div className="flex justify-between gap-5">
							<div className="flex w-full flex-col gap-2">
								<Controller
									name="symbol"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<Input
											{...field}
											label="Symbol"
											placeholder="HUM"
											error={error?.message}
										/>
									)}
								/>
							</div>
							<div className="flex w-full flex-col gap-2">
								<Controller
									name="decimals"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<Input
											{...field}
											label="Decimals"
											placeholder="18"
											type="number"
											onChange={(e) => {
												const value = e.target.value
												field.onChange(value ? parseInt(value) : null)
											}}
											error={error?.message}
										/>
									)}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<Controller
								name="external_links.image"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<Input
										{...field}
										label="Image URL"
										placeholder="Add a link to meme image"
										error={error?.message}
									/>
								)}
							/>
						</div>

						<div className="flex justify-between gap-5">
							<div className="flex w-full flex-col gap-2">
								<Controller
									name="initial_supply"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<Input
											{...field}
											label="Initial Supply"
											placeholder="Initial number of your memecoins"
											type="number"
											onChange={(e) => {
												const value = e.target.value
												field.onChange(value ? parseInt(value) : null)
											}}
											error={error?.message}
										/>
									)}
								/>
							</div>
							<div className="flex w-full flex-col gap-2">
								<Controller
									name="total_supply"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<Input
											{...field}
											label="Total Supply"
											placeholder="Total number of your memecoins"
											error={error?.message}
											type="number"
											onChange={(e) => {
												const value = e.target.value
												field.onChange(value ? parseInt(value) : null)
											}}
										/>
									)}
								/>
							</div>
						</div>

						<div className="flex justify-between gap-5">
							<div className="flex w-full flex-col gap-2">
								<Controller
									name="external_links.website"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<Input
											{...field}
											label="Website (optional)"
											placeholder="Add a link to website"
											error={error?.message}
										/>
									)}
								/>
							</div>
							<div className="flex w-full flex-col gap-2">
								<Controller
									name="external_links.telegram"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<Input
											{...field}
											label="Telegram (optional)"
											placeholder="Add a link to Telegram"
											error={error?.message}
										/>
									)}
								/>
							</div>
						</div>

						<div className="flex justify-between gap-5">
							<div className="flex w-full flex-col gap-2">
								<Controller
									name="external_links.twitter"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<Input
											{...field}
											label="Twitter (optional)"
											placeholder="Add a link to Twitter"
											error={error?.message}
										/>
									)}
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

						<div className="flex justify-between gap-5">
							<div className="flex w-full flex-col gap-2">
								<Controller
									name="external_links.tokenomics"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<Input
											{...field}
											label="Tokenomics (optional)"
											placeholder="Add a link to tokenomics"
											error={error?.message}
										/>
									)}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<Controller
								name="description"
								control={control}
								render={({ field, fieldState: { error } }) => (
									<>
										<InputArea
											{...field}
											label="Description"
											placeholder="Tell people more about your memecoin"
											error={error?.message}
										/>
										<span
											className={cn(
												'text-right text-[13px] text-[#767F92]',
												error?.message && 'text-[#FF4F4F]'
											)}
										>
											{field?.value?.length || 0}
											/500
										</span>
									</>
								)}
							/>
						</div>

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
