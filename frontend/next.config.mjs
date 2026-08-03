import BundleAnalyzer from '@next/bundle-analyzer'

import { createRequire } from 'node:module'

const withBundleAnalyzer = BundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})

const require = createRequire(import.meta.url)

const gatewayUrl = process.env.NEXT_PUBLIC_IPFS_GETAWAY
	? new URL(process.env.NEXT_PUBLIC_IPFS_GETAWAY)
	: null

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'standalone',
	async headers() {
		return [
			{
				source:
					'/((?!_next/static|_next/image|images/|favicon.ico|robots.txt|sitemap.xml).*)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'no-store',
					},
				],
			},
		]
	},
	webpack: (config) => {
		// fix for:
		// Module parse failed: 'import' and 'export' may appear only with 'sourceType: module'
		config.resolve.alias['@varan-wallet/varan-connect$'] =
			require.resolve('@varan-wallet/varan-connect')

		return config
	},

	images: {
		remotePatterns: gatewayUrl
			? [
					{
						protocol: gatewayUrl.protocol.replace(':', ''),
						hostname: gatewayUrl.hostname,
						port: gatewayUrl.port || undefined,
						pathname: `${gatewayUrl.pathname.replace(/\/$/, '') || ''}/**`,
					},
				]
			: [],
	},
}

export default withBundleAnalyzer(nextConfig)
