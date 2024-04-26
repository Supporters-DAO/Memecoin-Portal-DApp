const { GearApi } = require('@gear-js/api')
const fs = require('fs')
const { Program } = require('./path/to/out/dir/lib')

async function deploy() {
	const api = await GearApi.create({
		providerAddress: 'wss://testnet.vara.network',
	})

	if (api) {
		const program = new Program(api)
		const code = fs.readFileSync('path/to/meme_factory.opt.wasm')

		const transaction = program.newCtorFromCode(code, {
			factory_admin_account: [['']],
			meme_code_id: [['']],
			gas_for_program: 10_000_000_000,
		})

		console.log('transaction', transaction)
	}
}

deploy()
