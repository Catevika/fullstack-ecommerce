import {withGluestackUI} from '@gluestack/ui-next-adapter';
/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['nativewind', 'react-native-css-interop'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'via.placeholder.com',
				port: '',
				pathname: '/**',
				search: '',
			},
			{
				protocol: 'https',
				hostname: 'notjustdev-dummy.s3.us-east-2.amazonaws.com',
				port: '',
				pathname: '/ecom/**',
				search: '',
			},
		],
	},
cacheHandler: process.env.NODE_ENV === "production" ? "./cache-handler.mjs" : undefined,
  cacheMaxMemorySize: 0,};

export default withGluestackUI(nextConfig);
