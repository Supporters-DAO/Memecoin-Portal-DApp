import { Header } from '@/components/common/header'
import Layout from '@/components/layout/layout'
import { ConfirmCreate } from '@/components/sections/confirm-create/confirm'
import { CreateForm } from '@/components/sections/create/create-form'

const Confirm = () => {
	return (
		<Layout>
			<ConfirmCreate />
		</Layout>
	)
}

export default Confirm
