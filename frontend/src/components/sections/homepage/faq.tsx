import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Sprite } from '@/components/ui/sprite'

type Props = {
	className?: string
}

export function HomepageFAQ({ className }: Props) {
	return (
		<section className={cn('container py-25', className)}>
			<h2 className="text-center text-[32px] leading-none text-primary">FAQ</h2>
			<Accordion
				className="mx-auto mt-8 grid max-w-[920px] gap-y-5"
				type="multiple"
			>
				{QA.map((item, i) => (
					<AccordionItem key={i} value={`item-${i}`} className="">
						<AccordionTrigger
							noIcon
							className="link-white py-[5px] font-silkscreen radix-state-open:opacity-100"
						>
							<span className="text-[24px] leading-none">{item.question}</span>
							<span className="shrink-0 grow-0">
								<Sprite
									name="accordion-minus"
									className="hidden size-10 group-radix-state-open:block"
								/>
								<Sprite
									name="accordion-plus"
									className="size-10 group-radix-state-open:hidden"
								/>
							</span>
						</AccordionTrigger>
						<AccordionContent className="font-poppins text-[22px] leading-normal">
							<div className="space-y-4">{item.answer}</div>
						</AccordionContent>
						{i !== QA.length - 1 && (
							<div className="mt-5 h-px w-full bg-[#FDFDFD]/[2%]" />
						)}
					</AccordionItem>
				))}
			</Accordion>
		</section>
	)
}

const QA = [
	{
		question: 'What is a Tokenator Memecoin Portal?',
		answer: (
			<>
				<p>
					This is an online platform that enables individuals to create their
					own memecoins easily. Users can set up various parameters for their
					coin, such as the total and initial token supply, coin name,
					description, symbol, and more, without needing to write any code.
				</p>
			</>
		),
	},
	{
		question: 'How do I create my own memecoin?',
		answer: (
			<>
				<p>
					To create your memecoin, first, connect your{' '}
					<Link
						href="https://wiki.vara.network/docs/account/create-account"
						className="link link-primary"
					>
						Vara account
					</Link>
					. Then, click the &quot;Create now&quot; button to open the creation
					dialog. Specify your memecoin&apos;s name, description, symbol, supply
					details, and additional settings. This includes tokenomics, social
					media links, and more.
				</p>
			</>
		),
	},
	{
		question: 'Can I mint more coins after the initial creation?',
		answer: (
			<>
				<p>
					Yes, the creator can mint more coins post-launch if the initial token
					supply is less than the total token supply. It&apos;s crucial to
					finalize your coin&apos;s monetary policy before launch, as any
					changes can impact the trust in your coin.
				</p>
			</>
		),
	},
	{
		question: 'How do I distribute my memecoin to users?',
		answer: (
			<>
				<p>
					After creation, you can directly distribute your memecoin to other
					users through the portal via transfers. Define your distribution
					strategy — it can be airdrops, rewards for early supporters, sales, or
					anything else. Your coins = your rules.
				</p>
			</>
		),
	},
	{
		question:
			'Is it possible to list my memecoin on Decentralized Exchanges (DEXes)?',
		answer: (
			<>
				<p>
					While the creation portal itself doesn&apos;t handle listings, it
					provides you with the necessary information to list your coin on
					DEXes. The listing process will depend on the requirements of the
					exchange you choose.
				</p>
			</>
		),
	},
	{
		question:
			"What should I consider when setting up my memecoin's initial supply?",
		answer: (
			<>
				<p>
					Consider your goals for the coin, its use case, and how you want it to
					be distributed among early adopters, developers, and the community. A
					large supply can dilute value, but too small a supply might limit
					participation. Research other successful memecoins for guidance.
				</p>
			</>
		),
	},
	{
		question: 'How can I ensure my memecoin is secure?',
		answer: (
			<>
				<p>
					While the portal ensures the technical creation process is secure, the
					broader security of your coin involves regular audits, transparent
					communication, and secure distribution practices. Consider hiring a
					security firm to audit your coin if you plan to build significant
					value around it.
				</p>
			</>
		),
	},
	{
		question: 'Can I create a memecoin without any programming knowledge?',
		answer: (
			<>
				<p>
					Yes, that&apos;s the primary advantage of a memecoin creation portal.
					It abstracts away the complexity of smart contracts and blockchain
					technology, allowing anyone with an idea to create a token.
				</p>
			</>
		),
	},
	{
		question:
			'What are the costs associated with creating and maintaining a memecoin?',
		answer: (
			<>
				<p>
					Creating a memecoin on the portal is free of charge, allowing anyone
					to create their own memecoin without extra costs! However, a small
					amount of VARA is required in your balance to cover the network
					transaction fees associated with memecoin creation, minting, and
					transferring.
				</p>
				<p>
					<span className="">!</span> Please note that the{' '}
					<Link
						href="https://wiki.polkadot.network/docs/build-protocol-info#existential-deposit"
						className="link link-primary"
					>
						Existential Deposit
					</Link>{' '}
					on the Vara network is 10 VARA. Therefore, your account must have at
					least 11 VARA (and never less than 10 VARA) to ensure you can pay the
					gas fees while maintaining your network presence.
				</p>
			</>
		),
	},
	{
		question: 'How do I promote my memecoin?',
		answer: (
			<>
				<p>
					Promotion is key to gaining users and value. Utilize social media,
					cryptocurrency forums, and other online communities. Consider
					partnerships, giveaways, or utility development that can increase
					interest and usage of your memecoin.
				</p>
				<p>
					Creating a memecoin offers a unique way to engage with the crypto
					community, experiment with decentralized finance, or even just have a
					bit of fun. However, as with any project in the cryptocurrency space,
					it&apos;s important to proceed with a clear strategy, awareness of the
					risks, and consideration for the legal and ethical implications of
					your actions.
				</p>
			</>
		),
	},
]
