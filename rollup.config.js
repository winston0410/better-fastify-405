import typescript from 'rollup-plugin-typescript2'
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const path = require('path')

export default [
	{
		input: ['./index.ts'],
		external: ['fastify', 'fastify-plugin'],
		output: [
			{
				dir: 'dist',
				format: 'cjs',
				plugins: [],
				exports: 'named'
			}
		],
		plugins: [
			nodeResolve({}),
			commonjs({
				include: ['./**', 'node_modules/**']
			}),
			typescript({
				tsconfig: 'tsconfig.json'
			})
		]
	}
]
