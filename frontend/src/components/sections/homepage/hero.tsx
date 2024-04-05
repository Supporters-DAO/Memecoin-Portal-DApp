import ImageBg from '@/assets/hero-bg.png'
import { Header } from '@/components/common/header'
import { Wallet } from '@/components/common/wallet-new'
import { useAccount } from '@gear-js/react-hooks'
import { Link } from 'react-router-dom'

export function Hero() {
	const { account } = useAccount()

	return (
		<div className='h-screen bg-cover bg-center flex flex-col justify-start'
			style={{ backgroundImage: `url(${ImageBg})` }}
		>
			<Header />

			<div className='flex flex-col gap-7 ml-auto w-2/4 mt-vh-30'>
				<h1 className='text-[64px] text-[#FDFDFD]'>Vara Memecoins</h1>
				<p className='text-[#FDFDFD] text-xl'>Create your own memecoin in # minutes</p>
				{account ?
					<Link to={"/create"}>
						<button
							type='button'
							className='text-xs bg-primary p-5 px-7 font-bold rounded-lg cursor-pointer mt-5 text-[#242424]'
						>
							Create now
						</button>
					</Link> : <Wallet />
				}
			</div>
		</div>
	)
}
