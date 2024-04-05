import { Header } from '@/components/common/header'
import { CreateForm } from '@/components/sections/create/create-form'

const Create = () => {
	return (
		<div className='bg-[#0F1B34]'>
			<div className='container'>
				<Header />
				<CreateForm />
			</div>
		</div>
	)
}

export default Create