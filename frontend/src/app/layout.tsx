import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Silkscreen, Poppins, Press_Start_2P } from 'next/font/google'
import { Header } from '@/components/layouts/base/header'
import { ReactNode } from 'react'

const silkscreen = Silkscreen({
	display: 'swap',
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-silkscreen',
})

const pressStart2P = Press_Start_2P({
	display: 'swap',
	subsets: ['latin'],
	weight: ['400'],
	variable: '--font-ps2p',
})

const poppins = Poppins({
	display: 'swap',
	subsets: ['latin'],
	weight: ['400', '600'],
	variable: '--font-poppins',
})
const siteConfig = {
	name: 'Vara Memecoins',
}

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: 'Description',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html
			lang="en"
			className={`${silkscreen.variable} ${poppins.variable} ${pressStart2P.variable}`}
		>
			<body className="flex min-h-screen flex-col font-ps2p [--header-height:6.25rem]">
				<Header />
				{children}
			</body>
		</html>
	)
}
