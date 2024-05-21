import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import styles from './styles.module.scss'

type Coin = {
	id: number
	left: string
	animationDelay: string
}

export const AnimationCoins = () => {
	const numCoins = 30
	const [coins, setCoins] = useState<Coin[]>([])

	useEffect(() => {
		const newCoins = Array.from({ length: numCoins }, (_, i) => ({
			id: i,
			left: `${Math.random() * 100}vw`,
			animationDelay: `${Math.random() * 5}s`,
		}))
		setCoins(newCoins)
	}, [])

	return (
		<div className={styles.coinContainer}>
			{coins.map((coin) => (
				<div
					key={coin.id}
					className={styles.coin}
					style={{
						position: 'absolute',
						left: coin.left,
						animationDelay: coin.animationDelay,
					}}
				>
					<Image
						src="/images/coin.png"
						alt="Coin"
						width={50}
						height={50}
						priority={true}
						unoptimized={true}
					/>
				</div>
			))}
		</div>
	)
}
