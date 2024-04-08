import { ReactNode } from 'react'
import { Header } from '@/components/common/header'
import { CreateForm } from '@/components/sections/create/create-form'

interface Props {
	children: React.ReactNode
}

const Layout = ({ children }: Props) => {
	return (
		<div className="bg-[#0F1B34]">
			<div className="container">
				<Header />
				{children}
			</div>
		</div>
	)
}

export default Layout
