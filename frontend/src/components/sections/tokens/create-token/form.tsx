'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import {
	createTokenDefault,
	createTokenSchema,
	ICreateTokenForm,
} from '@/components/sections/tokens/create-token/schema'
import { InputArea } from '@/components/ui/InputArea'
import { useAtom } from 'jotai'

import { dataTokenAtom, stepAtom } from '.'
import { cn } from '@/lib/utils'
import { BackButton } from '@/components/common/back-button'

export const CreateForm = () => {
	const [step, setStep] = useAtom(stepAtom)
	const [dataToken, setDataToken] = useAtom(dataTokenAtom)

	const {
		register,
		handleSubmit,
		formState: { errors, touchedFields, dirtyFields },
		control,
		trigger,
		watch,
	} = useForm<ICreateTokenForm>({
		mode: 'onChange',
		defaultValues: createTokenDefault,
		resolver: zodResolver(createTokenSchema),
	})

	useEffect(() => {
		if (dirtyFields.max_supply || dirtyFields.initial_supply) {
			trigger('initial_supply')
			trigger('max_supply')
		}
	}, [watch('max_supply'), watch('initial_supply')])

	const onSubmit = (data: ICreateTokenForm) => {
		if (data) {
			setDataToken(data)
			setStep('confirm')
		}
	}

	return (
		<div className="ju my-10 flex items-start max-sm:flex-col">
			<BackButton />
			<div className="flex flex-col items-center gap-3 max-sm:w-full">
				<h1 className="text-[28px] text-primary max-sm:text-center max-sm:text-[16px]">
					Memecoin Creator
				</h1>
				<div className="flex w-[660px] flex-col gap-6 rounded-[40px] bg-blue-light p-3 max-sm:w-full max-sm:rounded-[20px]">
					<div className="mx-auto w-2/5 max-sm:w-[70%] max-sm:mt-5">
						<ol className="flex w-full items-center">
							<li className="flex w-full items-center text-[#0F1B34] after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-[#D0D3D9] after:content-['']">
								<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary max-sm:size-7 max-sm:text-[12px]">
									1
								</span>
							</li>
							<li className="flex w-full items-center text-[#0F1B34] after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-[#D0D3D9] after:content-['']">
								<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#D0D3D9] max-sm:size-7 max-sm:text-[12px]">
									2
								</span>
							</li>
							<li className="flex w-0 items-center text-[#0F1B34] max-sm:w-auto">
								<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#D0D3D9] max-sm:size-7 max-sm:text-[12px]">
									3
								</span>
							</li>
						</ol>
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
											tooltip="The number of decimals for token"
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

						<div className="flex justify-between gap-5 max-sm:flex-col">
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
											error={
												(touchedFields.initial_supply &&
													(errors.initial_supply?.message || error?.message)) ||
												''
											}
											tooltip="The number of created tokens"
										/>
									)}
								/>
							</div>
							<div className="flex w-full flex-col gap-2">
								<Controller
									name="max_supply"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<Input
											{...field}
											label="Max Supply"
											placeholder="Total number of your memecoins"
											error={
												(touchedFields.max_supply &&
													(errors.max_supply?.message || error?.message)) ||
												''
											}
											type="number"
											onChange={(e) => {
												const value = e.target.value
												field.onChange(value ? parseInt(value) : null)
											}}
											tooltip="Total number of tokens available"
										/>
									)}
								/>
							</div>
						</div>

						<div className="flex justify-between gap-5 max-sm:flex-col">
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

						<div className="flex justify-between gap-5 max-sm:flex-col">
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
								<Controller
									name="external_links.discord"
									control={control}
									render={({ field, fieldState: { error } }) => (
										<Input
											{...field}
											label="Discord (optional)"
											placeholder="Add a link to Discord"
											error={error?.message}
										/>
									)}
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
							className="mx-auto rounded-lg bg-[#D0D3D9] px-35 py-3 font-ps2p text-black hover:bg-primary max-sm:mb-5 max-sm:w-full max-sm:px-0"
						>
							Next
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
