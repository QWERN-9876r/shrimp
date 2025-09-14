import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { colors } from '../../styles/colors'
import type { Potion, PotionRarity } from '../../types'

const sparkleAnimation = keyframes`
  0%, 100% { transform: rotate(0deg) scale(1); opacity: 1; }
  25% { transform: rotate(90deg) scale(1.2); opacity: 0.8; }
  50% { transform: rotate(180deg) scale(0.9); opacity: 0.6; }
  75% { transform: rotate(270deg) scale(1.1); opacity: 0.9; }
`

const bubbleFloat = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`

const newItemGlow = keyframes`
  0% { box-shadow: 0 0 5px ${colors.rarity.legendary.glow}; }
  50% { box-shadow: 0 0 25px ${colors.rarity.legendary.glow}, 0 0 35px ${colors.rarity.legendary.primary}; }
  100% { box-shadow: 0 0 5px ${colors.rarity.legendary.glow}; }
`

const PotionInventoryContainer = styled.div`
	background: ${colors.background.panel};
	border: 2px solid ${colors.ui.border};
	border-radius: 15px;
	padding: 1.5rem;
	margin-bottom: 2rem;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
`

const SectionTitle = styled.h3`
	color: ${colors.ui.textAccent};
	margin: 0 0 1rem 0;
	font-size: 1.1rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
`

const PotionCount = styled.span`
	background: ${colors.rarity.epic.primary};
	color: ${colors.ui.textAccent};
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 0.8rem;
	border: 1px solid ${colors.rarity.epic.border};
`

const FilterContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-bottom: 1.5rem;
	padding: 1rem;
	background: ${colors.background.card};
	border-radius: 10px;
	border: 1px solid ${colors.ui.border};
`

const FilterButton = styled(motion.button)<{
	$active: boolean
	$rarity?: PotionRarity
}>`
	background: ${(props) => {
		if (!props.$active) return colors.background.panel
		if (!props.$rarity)
			return `linear-gradient(135deg, ${colors.rarity.rare.primary}, ${colors.rarity.rare.secondary})`

		const rarityColors = {
			common: colors.rarity.common,
			rare: colors.rarity.rare,
			epic: colors.rarity.epic,
			legendary: colors.rarity.legendary,
		}
		const rarity = rarityColors[props.$rarity]
		return `linear-gradient(135deg, ${rarity.primary}, ${rarity.secondary})`
	}};
	color: ${(props) =>
		props.$active ? colors.ui.textAccent : colors.ui.text};
	border: 2px solid
		${(props) => {
			if (!props.$active) return colors.ui.border
			if (!props.$rarity) return colors.rarity.rare.border

			const rarityColors = {
				common: colors.rarity.common.border,
				rare: colors.rarity.rare.border,
				epic: colors.rarity.epic.border,
				legendary: colors.rarity.legendary.border,
			}
			return rarityColors[props.$rarity]
		}};
	padding: 6px 12px;
	border-radius: 20px;
	cursor: pointer;
	font-size: 0.8rem;
	font-weight: 500;
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
	}
`

const PotionsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1rem;

	@media (max-width: 768px) {
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}
`

const PotionCard = styled(motion.div)<{
	$rarity: PotionRarity
	$used: boolean
	$isNew?: boolean
}>`
	background: ${(props) => {
		const rarityColors = {
			common: colors.rarity.common,
			rare: colors.rarity.rare,
			epic: colors.rarity.epic,
			legendary: colors.rarity.legendary,
		}
		const rarity = rarityColors[props.$rarity]
		return `linear-gradient(135deg, ${rarity.primary}40, ${rarity.secondary}60)`
	}};
	border: 3px solid
		${(props) => {
			const rarityColors = {
				common: colors.rarity.common.border,
				rare: colors.rarity.rare.border,
				epic: colors.rarity.epic.border,
				legendary: colors.rarity.legendary.border,
			}
			return rarityColors[props.$rarity]
		}};
	border-radius: 15px;
	padding: 1.5rem;
	cursor: ${(props) => (props.$used ? 'default' : 'pointer')};
	position: relative;
	overflow: hidden;
	opacity: ${(props) => (props.$used ? 0.5 : 1)};
	filter: ${(props) => (props.$used ? 'grayscale(1)' : 'none')};
	transition: all 0.3s ease;
	height: 275px;

	${(props) =>
		props.$isNew &&
		`
    animation: ${newItemGlow} 2s ease-in-out infinite;
  `}

	&:hover {
		${(props) =>
			!props.$used &&
			`
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    `}
	}

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
			return `radial-gradient(circle at 50% 50%, ${rarityColors[props.$rarity]} 0%, transparent 70%)`
		}};
		opacity: 0.1;
		pointer-events: none;
	}
`

const PotionIcon = styled(motion.div)`
	font-size: 3rem;
	text-align: center;
	margin-bottom: 1rem;
	filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
	animation: ${bubbleFloat} 3s ease-in-out infinite;
`

const PotionName = styled.h4`
	color: ${colors.ui.textAccent};
	font-size: 1rem;
	margin-bottom: 0.5rem;
	text-align: center;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
`

const PotionDescription = styled.p`
	color: ${colors.ui.text};
	font-size: 0.85rem;
	text-align: center;
	line-height: 1.4;
	margin-bottom: 1rem;
`

const RarityBadge = styled.div<{ $rarity: PotionRarity }>`
	position: absolute;
	top: 8px;
	right: 8px;
	background: ${(props) => {
		const rarityColors = {
			common: colors.rarity.common.primary,
			rare: colors.rarity.rare.primary,
			epic: colors.rarity.epic.primary,
			legendary: colors.rarity.legendary.primary,
		}
		return rarityColors[props.$rarity]
	}};
	color: ${colors.ui.textAccent};
	padding: 4px 8px;
	border-radius: 12px;
	font-size: 0.7rem;
	font-weight: bold;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`

const UseButton = styled(motion.button)`
	position: absolute;
	bottom: 25px;
	left: 10px;
	width: calc(100% - 20px);
	background: linear-gradient(135deg, ${colors.ui.success}, #2ecc71);
	color: ${colors.ui.textAccent};
	border: none;
	padding: 10px;
	border-radius: 8px;
	cursor: pointer;
	font-weight: bold;
	font-size: 0.9rem;
	border: 2px solid ${colors.ui.success};

	&:hover {
		background: linear-gradient(135deg, #2ecc71, ${colors.ui.success});
		box-shadow: 0 0 15px rgba(39, 174, 96, 0.4);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: ${colors.background.panel};
		color: ${colors.ui.textSecondary};
		border-color: ${colors.ui.border};
	}
`

const UsedLabel = styled.div`
	width: 100%;
	background: ${colors.background.panel};
	color: ${colors.ui.textSecondary};
	padding: 10px;
	border-radius: 8px;
	text-align: center;
	font-weight: bold;
	font-size: 0.9rem;
	border: 2px solid ${colors.ui.border};
`

const EmptyState = styled(motion.div)`
	text-align: center;
	padding: 3rem 1rem;
	color: ${colors.ui.textSecondary};
`

const EmptyIcon = styled.div`
	font-size: 4rem;
	margin-bottom: 1rem;
	opacity: 0.5;
`

const Sparkles = styled(motion.div)`
	position: absolute;
	top: 10px;
	left: 10px;
	font-size: 1rem;
	animation: ${sparkleAnimation} 2s ease-in-out infinite;
`

const CreatedDate = styled.div`
	position: absolute;
	bottom: 8px;
	left: 8px;
	font-size: 0.7rem;
	color: ${colors.ui.textSecondary};
	opacity: 0.7;
`

interface PotionCardComponentProps {
	potion: Potion
	onUse: (potionId: string) => void
	isNew?: boolean
}

const PotionCardComponent: React.FC<PotionCardComponentProps> = ({
	potion,
	onUse,
	isNew = false,
}) => {
	const [isUsing, setIsUsing] = useState(false)

	const handleUse = async () => {
		setIsUsing(true)

		// Показываем эффект использования
		setTimeout(() => {
			onUse(potion.id)
		}, 500)
	}

	const createdDate = new Date(potion.createdAt).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'short',
	})

	return (
		<PotionCard
			$rarity={potion.rarity}
			$used={potion.used}
			$isNew={isNew}
			layout
			initial={{ opacity: 0, scale: 0, rotateY: -90 }}
			animate={{ opacity: 1, scale: 1, rotateY: 0 }}
			exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
			transition={{
				type: 'spring',
				stiffness: 100,
				damping: 15,
				layout: { duration: 0.3 },
			}}
			whileHover={!potion.used ? { scale: 1.02 } : {}}
		>
			{!potion.used && potion.rarity === 'legendary' && (
				<Sparkles
					animate={{
						scale: [1, 1.2, 1],
						rotate: [0, 360],
					}}
					transition={{
						duration: 3,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				>
					✨
				</Sparkles>
			)}

			<RarityBadge $rarity={potion.rarity}>{potion.rarity}</RarityBadge>

			<CreatedDate>{createdDate}</CreatedDate>

			<PotionIcon
				animate={
					!potion.used
						? {
								rotateY: [0, 10, -10, 0],
								scale: [1, 1.05, 1],
							}
						: {}
				}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			>
				{potion.icon}
			</PotionIcon>

			<PotionName>{potion.name}</PotionName>
			<PotionDescription>{potion.description}</PotionDescription>

			{potion.used ? (
				<UsedLabel>✅ Использовано</UsedLabel>
			) : (
				<UseButton
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleUse}
					disabled={isUsing}
				>
					{isUsing ? '🎯 Использую...' : '🧪 Использовать'}
				</UseButton>
			)}
		</PotionCard>
	)
}

type FilterType = 'all' | 'unused' | 'used' | PotionRarity

export const PotionInventory = () => {
	const { potions, usePotion } = useGameStore()
	const [filter, setFilter] = useState<FilterType>('unused')

	const filteredPotions = potions.filter((potion) => {
		if (filter === 'all') return true
		if (filter === 'unused') return !potion.used
		if (filter === 'used') return potion.used
		return potion.rarity === filter
	})

	const sortedPotions = [...filteredPotions].sort((a, b) => {
		// Сначала неиспользованные, потом по редкости, потом по дате
		if (a.used !== b.used) return a.used ? 1 : -1

		const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 }
		if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
			return rarityOrder[b.rarity] - rarityOrder[a.rarity]
		}

		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	})

	const filterOptions = [
		{
			value: 'unused' as FilterType,
			label: 'Доступные',
			count: potions.filter((p) => !p.used).length,
		},
		{
			value: 'used' as FilterType,
			label: 'Использованные',
			count: potions.filter((p) => p.used).length,
		},
		{ value: 'all' as FilterType, label: 'Все', count: potions.length },
	]

	const rarityFilters: {
		value: PotionRarity
		label: string
		count: number
	}[] = [
		{
			value: 'common',
			label: 'Обычные',
			count: potions.filter((p) => p.rarity === 'common').length,
		},
		{
			value: 'rare',
			label: 'Редкие',
			count: potions.filter((p) => p.rarity === 'rare').length,
		},
		{
			value: 'epic',
			label: 'Эпические',
			count: potions.filter((p) => p.rarity === 'epic').length,
		},
		{
			value: 'legendary',
			label: 'Легендарные',
			count: potions.filter((p) => p.rarity === 'legendary').length,
		},
	]

	return (
		<PotionInventoryContainer>
			<SectionTitle>
				🧪 Инвентарь зелий
				<PotionCount>
					{potions.filter((p) => !p.used).length}
				</PotionCount>
			</SectionTitle>

			{potions.length > 0 && (
				<FilterContainer>
					<div
						style={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: '0.5rem',
							flex: 1,
						}}
					>
						{filterOptions.map((option) => (
							<FilterButton
								key={option.value}
								$active={filter === option.value}
								onClick={() => setFilter(option.value)}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								{option.label} ({option.count})
							</FilterButton>
						))}

						<div
							style={{
								width: '1px',
								background: colors.ui.border,
								margin: '0 0.5rem',
							}}
						/>

						{rarityFilters
							.filter((r) => r.count > 0)
							.map((rarity) => (
								<FilterButton
									key={rarity.value}
									$active={filter === rarity.value}
									$rarity={rarity.value}
									onClick={() => setFilter(rarity.value)}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{rarity.label} ({rarity.count})
								</FilterButton>
							))}
					</div>
				</FilterContainer>
			)}

			<AnimatePresence mode="wait">
				{sortedPotions.length > 0 ? (
					<PotionsGrid>
						<AnimatePresence>
							{sortedPotions.map((potion) => (
								<PotionCardComponent
									key={potion.id}
									potion={potion}
									onUse={usePotion}
								/>
							))}
						</AnimatePresence>
					</PotionsGrid>
				) : (
					<EmptyState
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
					>
						<EmptyIcon>🧪</EmptyIcon>
						<h3
							style={{
								color: colors.ui.text,
								marginBottom: '0.5rem',
							}}
						>
							{filter === 'all'
								? 'Нет зелий в инвентаре'
								: `Нет зелий в категории "${filterOptions.find((f) => f.value === filter)?.label || filter}"`}
						</h3>
						<p>
							{filter === 'all'
								? 'Выполняйте задания, чтобы получить первые зелья!'
								: 'Попробуйте выбрать другую категорию или выполнить больше заданий.'}
						</p>
					</EmptyState>
				)}
			</AnimatePresence>
		</PotionInventoryContainer>
	)
}
