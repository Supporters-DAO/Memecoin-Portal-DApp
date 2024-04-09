import Link from 'next/link'

export default function Page() {
	return (
		<div>
			<h1 className="flex flex-col items-center space-y-8 text-[176px] leading-none xl:text-[192px]">
				404
			</h1>
			<p className="text-lg font-medium md:text-xl">Page not found</p>
			<div>
				<Link href="/" className={''}>
					Back to homepage
				</Link>
			</div>
		</div>
	)
}
