'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
	name: string
	image: string
}

export const Created = ({ name, image }: Props) => {
	return (
		<>
			<h3 className="text-center uppercase">Memecoin is created</h3>
			<div className="flex flex-col gap-5 font-poppins">
				<div className="mx-auto flex flex-col items-center justify-center gap-3 rounded-[42px] border-2 border-[#2E3B55] bg-[#172542] p-7">
					<div className="font-ps2p uppercase text-primary">{name}</div>
					<Image
						src={image}
						alt={`Logo ${name}`}
						width={100}
						height={100}
						unoptimized={true}
						className="h-25 w-25 rounded-full object-cover"
					/>
				</div>

				<p className="mx-auto w-2/3 text-center">
					You will find your memecoin in the portfolio. Now you can share your
					art with friends
				</p>
				<div className="mt-7 flex gap-3 font-ps2p">
					<Link href="/tokens/my" className="mx-auto">
						<button className="rounded-lg bg-primary px-15 py-3 text-black">
							My Memecoins
						</button>
					</Link>
				</div>
			</div>
		</>
	)
}
