import BundleAnalyzer from '@next/bundle-analyzer'

import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const withBundleAnalyzer = BundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})

const require = createRequire(import.meta.url)
const appDir = dirname(fileURLToPath(import.meta.url))

const gatewayUrl = process.env.NEXT_PUBLIC_IPFS_GETAWAY
	? new URL(process.env.NEXT_PUBLIC_IPFS_GETAWAY)
	: null

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'standalone',
	outputFileTracingRoot: appDir,
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
