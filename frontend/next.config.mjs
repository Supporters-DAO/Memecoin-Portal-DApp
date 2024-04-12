import BundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = BundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true, output: 'standalone', webpack: (config, options) => {
		config.module.rules.push({
			test: /\.txt/, type: 'asset/resource', generator: {
				filename: 'static/[hash][ext]',
			},
		})

		return config
	},
}

export default withBundleAnalyzer(nextConfig)
