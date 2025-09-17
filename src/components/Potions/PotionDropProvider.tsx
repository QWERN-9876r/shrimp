import { useState, useCallback, type ReactNode, useRef } from 'react'
import { createPortal } from 'react-dom'
import { PotionDropContext_Provider } from '../../contexts/PotionDropContext'
import { useGameStore } from '../../stores/gameStore'
import type { Potion } from '../../types'
import { PotionDropAnimation } from '../Tasks/PotionDropAnimation'

interface PotionDropOptions {
	potions: Potion[]
	onComplete: () => void
}

interface PotionDropProviderProps {
	children: ReactNode
}

export const PotionDropProvider: React.FC<PotionDropProviderProps> = ({
	children,
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [currentPotions, setCurrentPotions] = useState<Potion[]>([])
	const onCompleteAnimation = useRef(() => {})

	/**
	 * Основная функция открытия рюкзака
	 */
	const openBag = useCallback(
		({ potions, onComplete }: PotionDropOptions) => {
			// Устанавливаем зелья и открываем анимацию
			setCurrentPotions(potions)
			setIsOpen(true)
			onCompleteAnimation.current = onComplete
		},
		[],
	)

	/**
	 * Завершение анимации
	 */
	const handleComplete = useCallback(() => {
		// Закрываем анимацию
		setIsOpen(false)
		setCurrentPotions([])
		onCompleteAnimation.current()
	}, [currentPotions])

	return (
		<PotionDropContext_Provider value={openBag}>
			{children}
			{isOpen &&
				currentPotions.length > 0 &&
				createPortal(
					<PotionDropAnimation
						potions={currentPotions}
						onComplete={handleComplete}
					/>,
					document.body,
				)}
		</PotionDropContext_Provider>
	)
}
