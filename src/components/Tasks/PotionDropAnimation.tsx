import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { colors } from '../../styles/colors'
import type { Potion, PotionRarity } from '../../types'

// Стилизованные компоненты остаются теми же...
const DropOverlay = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: radial-gradient(
		circle at center,
		rgba(0, 0, 0, 0.7) 0%,
		rgba(0, 0, 0, 0.9) 100%
	);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	z-index: 10000;
	backdrop-filter: blur(5px);
`

const BagContainer = styled(motion.div)`
	position: relative;
	margin-bottom: 2rem;
`

const Bag = styled(motion.div)`
	font-size: 8rem;
	filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
`

const RouletteContainer = styled(motion.div)`
	width: 80%;
	max-width: 800px;
	height: 120px;
	background: ${colors.background.card};
	border: 3px solid ${colors.rarity.legendary.border};
	border-radius: 15px;
	overflow: hidden;
	position: relative;
	margin-bottom: 2rem;
	box-shadow:
		inset 0 4px 8px rgba(0, 0, 0, 0.3),
		0 0 30px ${colors.rarity.legendary.glow};
	will-change: transform;
`

const RouletteTrack = styled(motion.div)<{ $totalWidth: number }>`
	position: relative;
	height: 100%;
	width: ${(props) => props.$totalWidth}px;
	will-change: transform;
	transform: translateZ(0);
`

const RouletteItem = styled.div<{
	$rarity: PotionRarity
	$itemWidth: number
	$absoluteLeft: number
}>`
	position: absolute;
	left: ${(props) => props.$absoluteLeft}px;
	top: 0;
	width: ${(props) => props.$itemWidth}px;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: ${(props) => {
		const rarityColors = {
			common: `linear-gradient(135deg, ${colors.rarity.common.primary}, ${colors.rarity.common.secondary})`,
			rare: `linear-gradient(135deg, ${colors.rarity.rare.primary}, ${colors.rarity.rare.secondary})`,
			epic: `linear-gradient(135deg, ${colors.rarity.epic.primary}, ${colors.rarity.epic.secondary})`,
			legendary: `linear-gradient(135deg, ${colors.rarity.legendary.primary}, ${colors.rarity.legendary.secondary})`,
		}
		return rarityColors[props.$rarity]
	}};
	border-right: 2px solid rgba(255, 255, 255, 0.2);
	color: ${colors.ui.textAccent};
	font-weight: bold;
	font-size: 0.8rem;
	text-align: center;
	will-change: transform;
	transform: translateZ(0);

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: ${(props) => {
			const rarityColors = {
				common: colors.rarity.common.glow,
				rare: colors.rarity.rare.glow,
				epic: colors.rarity.epic.glow,
				legendary: colors.rarity.legendary.glow,
			}
			return `radial-gradient(circle, ${rarityColors[props.$rarity]} 0%, transparent 70%)`
		}};
		opacity: 0.3;
	}
`

const RouletteIcon = styled.div`
	font-size: 2.5rem;
	margin-bottom: 0.25rem;
	z-index: 1;
	position: relative;
`

const RouletteName = styled.div`
	z-index: 1;
	position: relative;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`

const Selector = styled.div`
	position: absolute;
	top: -10px;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 15px solid transparent;
	border-right: 15px solid transparent;
	border-top: 20px solid ${colors.rarity.legendary.primary};
	z-index: 10;
	filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
`

// Остальные компоненты...
const WinnerContainer = styled(motion.div)`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
`

const WinnerPotion = styled(motion.div)<{ $rarity: PotionRarity }>`
	background: ${(props) => {
		const rarityColors = {
			common: `linear-gradient(135deg, ${colors.rarity.common.primary}, ${colors.rarity.common.secondary})`,
			rare: `linear-gradient(135deg, ${colors.rarity.rare.primary}, ${colors.rarity.rare.secondary})`,
			epic: `linear-gradient(135deg, ${colors.rarity.epic.primary}, ${colors.rarity.epic.secondary})`,
			legendary: `linear-gradient(135deg, ${colors.rarity.legendary.primary}, ${colors.rarity.legendary.secondary})`,
		}
		return rarityColors[props.$rarity]
	}};
	border: 4px solid
		${(props) => {
			const rarityColors = {
				common: colors.rarity.common.border,
				rare: colors.rarity.rare.border,
				epic: colors.rarity.epic.border,
				legendary: colors.rarity.legendary.border,
			}
			return rarityColors[props.$rarity]
		}};
	border-radius: 20px;
	padding: 2rem;
	text-align: center;
	color: ${colors.ui.textAccent};
	box-shadow: 0 0 30px
		${(props) => {
			const rarityColors = {
				common: colors.rarity.common.glow,
				rare: colors.rarity.rare.glow,
				epic: colors.rarity.epic.glow,
				legendary: colors.rarity.legendary.glow,
			}
			return rarityColors[props.$rarity]
		}};
`

const WinnerIcon = styled.div`
	font-size: 5rem;
	margin-bottom: 1rem;
	filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8));
`

const WinnerName = styled.h2`
	margin: 0 0 0.5rem 0;
	font-size: 1.8rem;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`

const WinnerDescription = styled.p`
	margin: 0;
	font-size: 1rem;
	opacity: 0.9;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`

const CloseButton = styled(motion.button)`
	background: linear-gradient(135deg, ${colors.ui.success}, #2ecc71);
	color: ${colors.ui.textAccent};
	border: none;
	padding: 20px 40px; /* Увеличиваем padding */
	border-radius: 25px;
	font-size: 1.2rem; /* Увеличиваем размер шрифта */
	font-weight: bold;
	cursor: pointer;
	margin-top: 2rem;
	border: 3px solid ${colors.ui.success};
	white-space: nowrap; /* Предотвращаем перенос текста */

	&:hover {
		background: linear-gradient(135deg, #2ecc71, ${colors.ui.success});
		box-shadow: 0 0 20px rgba(39, 174, 96, 0.5);
	}
`

interface PotionDropAnimationProps {
	potions: Potion[]
	onComplete: () => void
}

const ITEM_WIDTH = 100
const BUFFER_SIZE = 3
const THROTTLE_MS = 16

export const PotionDropAnimation: React.FC<PotionDropAnimationProps> = ({
	potions,
	onComplete,
}) => {
	const [stage, setStage] = useState<'opening' | 'spinning' | 'result'>(
		'opening',
	)

	const containerRef = useRef<HTMLDivElement>(null)
	const [containerWidth, setContainerWidth] = useState(800)
	const animationFrameRef = useRef<number | undefined>(undefined)
	const lastUpdateRef = useRef(0)

	// Используем useMotionValue для лучшей производительности
	const x = useMotionValue(0)

	// ВОССТАНОВЛЕННЫЙ АЛГОРИТМ: сначала определяем winner, потом все остальное
	const winner = useMemo(
		() => potions[Math.round((2 / 3) * potions.length)],
		[potions],
	)

	const totalWidth = useMemo(
		() => potions.length * ITEM_WIDTH,
		[potions.length],
	)

	// ВОССТАНОВЛЕННЫЙ АЛГОРИТМ: точно такой же расчет как в оригинале
	const finalOffset = useMemo(() => {
		const totalItems = potions.length
		const winnerIndex = Math.round((2 / 3) * totalItems)
		const centerOffset = containerWidth / 2 // Центр контейнера

		const finalOffset =
			winnerIndex * ITEM_WIDTH - centerOffset + ITEM_WIDTH * Math.random()

		return finalOffset
	}, [potions, containerWidth])

	const [visibleItems, setVisibleItems] = useState<
		Array<{
			potion: Potion
			index: number
			absoluteLeft: number
		}>
	>([])

	const updateVisibleItems = useCallback(
		(currentX: number) => {
			const now = Date.now()
			if (now - lastUpdateRef.current < THROTTLE_MS) return

			lastUpdateRef.current = now

			const viewportLeft = -currentX - BUFFER_SIZE * ITEM_WIDTH
			const viewportRight =
				-currentX + containerWidth + BUFFER_SIZE * ITEM_WIDTH

			const newVisibleItems: Array<{
				potion: Potion
				index: number
				absoluteLeft: number
			}> = []

			for (let i = 0; i < potions.length; i++) {
				const itemLeft = i * ITEM_WIDTH

				if (itemLeft >= viewportLeft && itemLeft <= viewportRight) {
					newVisibleItems.push({
						potion: potions[i],
						index: i,
						absoluteLeft: itemLeft,
					})
				}
			}

			setVisibleItems(newVisibleItems)
		},
		[potions, containerWidth],
	)

	// Подписка на изменения motion value
	useEffect(() => {
		if (stage !== 'spinning') return

		const unsubscribe = x.on('change', (currentX) => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}

			animationFrameRef.current = requestAnimationFrame(() => {
				updateVisibleItems(currentX)
			})
		})

		// Инициализация
		updateVisibleItems(x.get())

		return () => {
			unsubscribe()
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
	}, [stage, x, updateVisibleItems])

	// Оптимизированное обновление размеров контейнера
	useEffect(() => {
		const updateContainerWidth = () => {
			if (containerRef.current) {
				setContainerWidth(containerRef.current.offsetWidth)
			}
		}

		updateContainerWidth()
		window.addEventListener('resize', updateContainerWidth)

		return () => window.removeEventListener('resize', updateContainerWidth)
	}, [])

	useEffect(() => {
		const timer1 = setTimeout(() => setStage('spinning'), 2000)
		const timer2 = setTimeout(() => setStage('result'), 7500) // Восстанавливаем переход к результату

		return () => {
			clearTimeout(timer1)
			clearTimeout(timer2)
		}
	}, [])

	return (
		<AnimatePresence>
			<DropOverlay
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
			>
				{stage === 'opening' && (
					<BagContainer
						initial={{ scale: 0, rotate: -180 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{ duration: 1, type: 'spring' }}
					>
						<Bag>🎒</Bag>
					</BagContainer>
				)}

				{stage === 'spinning' && potions.length > 0 && (
					<RouletteContainer
						ref={containerRef}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
					>
						<Selector />
						<RouletteTrack
							$totalWidth={totalWidth}
							style={{ x }}
							animate={{ x: -finalOffset }}
							transition={{
								duration: 4,
								ease: [0.2, 0.46, 0.45, 0.94], // Восстанавливаем оригинальную кривую
								delay: 0.5,
							}}
						>
							{visibleItems.map(
								({ potion, index, absoluteLeft }) => (
									<RouletteItem
										key={index}
										$rarity={potion.rarity}
										$itemWidth={ITEM_WIDTH}
										$absoluteLeft={absoluteLeft}
									>
										<RouletteIcon>
											{potion.icon}
										</RouletteIcon>
										<RouletteName>
											{potion.name.length > 10
												? potion.name.split(' ')[0]
												: potion.name}
										</RouletteName>
									</RouletteItem>
								),
							)}
						</RouletteTrack>
					</RouletteContainer>
				)}

				{stage === 'result' && winner && (
					<WinnerContainer
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}
					>
						<motion.div
							initial={{ y: -100 }}
							animate={{ y: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							style={{
								textAlign: 'center',
								marginBottom: '1rem',
							}}
						>
							<h1
								style={{
									color: colors.rarity.legendary.primary,
									fontSize: '2.5rem',
									margin: 0,
									textShadow:
										'3px 3px 6px rgba(0, 0, 0, 0.8)',
								}}
							>
								🎉 Поздравляем! 🎉
							</h1>
						</motion.div>

						<WinnerPotion
							$rarity={winner.rarity}
							initial={{ scale: 0, rotate: -180 }}
							animate={{
								scale: [0, 1.2, 1],
								rotate: [0, 360, 0],
							}}
							transition={{
								duration: 1,
								ease: 'easeOut',
							}}
						>
							<WinnerIcon>{winner.icon}</WinnerIcon>
							<WinnerName>{winner.name}</WinnerName>
							<WinnerDescription>
								{winner.description}
							</WinnerDescription>
						</WinnerPotion>

						<CloseButton
							whileTap={{ scale: 0.95 }}
							onClick={onComplete}
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 1.5, duration: 0.3 }}
						>
							✨ Забрать награду! ✨
						</CloseButton>
					</WinnerContainer>
				)}
			</DropOverlay>
		</AnimatePresence>
	)
}
