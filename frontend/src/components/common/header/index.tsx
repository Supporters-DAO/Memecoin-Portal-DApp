import React from 'react'
import LogoImg from '@/assets/logo.svg'
import { Wallet } from '@/components/common/wallet-new'
import { Link } from 'react-router-dom'

export const Header = () => {
	return (
		<header className='container py-3 flex justify-between items-center'>
			<Link to='/' className='cursor-pointer'>
				<img src={LogoImg} alt="" />
			</Link>

			<Wallet />
		</header>
	)
}
