import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { colors } from '../../styles/colors'
import type { Item, EquipmentType } from '../../types'

// Анимации
const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px ${colors.ui.border}; }
  50% { box-shadow: 0 0 20px ${colors.rarity.legendary.glow}, 0 0 30px ${colors.rarity.legendary.primary}; }
`

const shimmer = keyframes`
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(300%) rotate(45deg); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
`

const Hero = styled(motion.img)`
	height: 300px;
	width: 200px;
`

const CharacterContainer = styled.div`
	position: relative;
	width: 100%;
	max-width: 600px;
	height: 550px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: 100px 1fr 100px;
	grid-template-rows: 60px 100px 180px 100px 60px;
	gap: 10px;
	align-items: center;
	justify-items: center;

	&::before {
		content: '';
		position: absolute;
		top: -10px;
		left: -10px;
		right: -10px;
		bottom: -10px;
		background: ${colors.background.secondary};
		border-radius: 20px;
		z-index: -1;
		border: 2px solid ${colors.ui.border};
	}
`

const PlayerLevel = styled(motion.div)`
	grid-column: 1 / -1;
	grid-row: 1;
	background: linear-gradient(
		135deg,
		${colors.rarity.legendary.primary},
		${colors.rarity.legendary.secondary}
	);
	color: ${colors.ui.textAccent};
	padding: 12px 24px;
	border-radius: 25px;
	font-weight: bold;
	font-size: 1.2rem;
	box-shadow: 0 4px 15px ${colors.rarity.legendary.glow};
	border: 2px solid ${colors.rarity.legendary.border};
	white-space: nowrap;
	justify-self: center;
	position: relative;
	overflow: hidden; /* Добавляем overflow: hidden */

	&::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -100%; /* Начинаем левее */
		width: 300%; /* Увеличиваем ширину */
		height: 200%;
		background: linear-gradient(
			45deg,
			transparent 0%,
			transparent 30%,
			rgba(255, 255, 255, 0.1) 45%,
			rgba(255, 255, 255, 0.2) 50%,
			rgba(255, 255, 255, 0.1) 55%,
			transparent 70%,
			transparent 100%
		);
		animation: shimmerLevel 4s ease-in-out infinite;
	}

	@keyframes shimmerLevel {
		0% {
			transform: translateX(-100%) rotate(45deg);
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		100% {
			transform: translateX(100%) rotate(45deg);
			opacity: 0;
		}
	}
`

const HelmetSlot = styled.div`
	grid-column: 2;
	grid-row: 2;
`

const ArmorSlot = styled.div`
	grid-column: 3;
	grid-row: 2;
`

const CharacterBody = styled(motion.div)`
	grid-column: 2;
	grid-row: 3;
	width: 120px;
	height: 180px;
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 0;
	animation: ${breathe} 4s ease-in-out infinite;
`

const RightHandSlot = styled.div`
	grid-column: 3;
	grid-row: 3;
	align-self: center;
`

const LeftHandSlot = styled.div`
	grid-column: 1;
	grid-row: 3;
	align-self: center;
`

const BootsSlot = styled.div`
	grid-column: 2;
	grid-row: 5;
`

const EquipmentSlot = styled(motion.div)<{
	$level: number
	$itemType: EquipmentType
}>`
	width: 90px;
	height: 90px;
	background: ${(props) => getItemBackground(props.$itemType, props.$level)};
	border: 3px solid ${(props) => getItemBorder(props.$level)};
	border-radius: 15px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;
	backdrop-filter: blur(5px);
	position: relative;
	box-shadow:
		inset 0 1px 2px rgba(255, 255, 255, 0.1),
		0 4px 8px rgba(0, 0, 0, 0.3);
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.2),
			transparent
		);
		transition: left 0.5s ease;
	}

	&:hover {
		transform: translateY(-5px) scale(1.05);
		box-shadow:
			0 10px 25px rgba(0, 0, 0, 0.4),
			0 0 20px ${(props) => getItemGlow(props.$level)};
		animation: ${float} 2s ease-in-out infinite;
		z-index: 10;

		&::before {
			left: 100%;
		}
	}
`

const ItemIcon = styled(motion.div)`
	font-size: 2.2rem;
	line-height: 1;
	filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.6));
	animation: ${pulse} 3s ease-in-out infinite;
`

const ItemLevel = styled(motion.div)<{ $level: number }>`
	font-size: 0.85rem;
	font-weight: bold;
	background: ${(props) => getLevelBackground(props.$level)};
	color: ${colors.ui.textAccent};
	padding: 2px 8px;
	border-radius: 12px;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
	margin-top: 2px;
	border: 1px solid rgba(255, 255, 255, 0.2);
`

const ItemTooltip = styled.div`
	position: absolute;
	bottom: 105%;
	left: 50%;
	transform: translateX(-50%);
	background: ${colors.background.card};
	color: ${colors.ui.text};
	padding: 12px 16px;
	border-radius: 8px;
	font-size: 0.8rem;
	white-space: nowrap;
	z-index: 20;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.3s ease;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
	border: 2px solid ${colors.ui.border};

	${EquipmentSlot}:hover & {
		opacity: 1;
	}

	&::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 6px solid transparent;
		border-top-color: ${colors.background.card};
	}
`

const ExperienceBar = styled.div`
	width: 70px;
	height: 4px;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 2px;
	margin-top: 3px;
	overflow: hidden;
	border: 1px solid ${colors.ui.border};
`

const ExperienceFill = styled(motion.div)<{ $progress: number }>`
	height: 100%;
	width: ${(props) => props.$progress}%;
	background: linear-gradient(90deg, ${colors.ui.success}, #58d68d);
	border-radius: 2px;
	transition: width 0.3s ease;
	box-shadow: 0 0 8px ${colors.ui.success};
	position: relative;

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.4),
			transparent
		);
		animation: ${shimmer} 2s infinite;
	}
`

// Утилитарные функции с новой палитрой
function getItemBackground(type: EquipmentType, level: number): string {
	const rarity = getRarityByLevel(level)
	return `linear-gradient(135deg, ${colors.rarity[rarity].primary}, ${colors.rarity[rarity].secondary})`
}

function getItemBorder(level: number): string {
	const rarity = getRarityByLevel(level)
	return colors.rarity[rarity].border
}

function getItemGlow(level: number): string {
	const rarity = getRarityByLevel(level)
	return colors.rarity[rarity].glow
}

function getLevelBackground(level: number): string {
	const rarity = getRarityByLevel(level)
	return `linear-gradient(135deg, ${colors.rarity[rarity].primary}, ${colors.rarity[rarity].secondary})`
}

function getRarityByLevel(level: number): keyof typeof colors.rarity {
	if (level >= 15) return 'set'
	if (level >= 10) return 'legendary'
	if (level >= 7) return 'epic'
	if (level >= 4) return 'rare'
	return 'common'
}

// Обновляем EquipmentSlotComponent
interface EquipmentSlotComponentProps {
	item: Item
	onClick?: () => void
	dataAttribute: string // Новый пропс
}

const EquipmentSlotComponent: React.FC<EquipmentSlotComponentProps> = ({
	item,
	onClick,
	dataAttribute,
}) => {
	const expProgress = (item.experience / item.maxExperience) * 100

	return (
		<EquipmentSlot
			$level={item.level}
			$itemType={item.type}
			onClick={onClick}
			data-equipment={dataAttribute} // Добавляем data-атрибут
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
		>
			<ItemTooltip>
				<div
					style={{
						color: colors.rarity[getRarityByLevel(item.level)]
							.border,
					}}
				>
					<strong>{item.name}</strong>
				</div>
				<div>Уровень {item.level}</div>
				<div>
					Опыт: {item.experience}/{item.maxExperience}
				</div>
				<div
					style={{
						fontSize: '0.7rem',
						opacity: 0.8,
						marginTop: '4px',
					}}
				>
					{item.description}
				</div>
			</ItemTooltip>

			<ItemIcon
				animate={{
					scale: [1, 1.05, 1],
					rotateZ: [0, 1, 0],
				}}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			>
				{item.icon}
			</ItemIcon>

			<ItemLevel $level={item.level} whileHover={{ scale: 1.2 }}>
				{item.level}
			</ItemLevel>

			<ExperienceBar>
				<ExperienceFill
					$progress={expProgress}
					initial={{ width: 0 }}
					animate={{ width: `${expProgress}%` }}
					transition={{ duration: 1, delay: 0.5 }}
				/>
			</ExperienceBar>
		</EquipmentSlot>
	)
}

export const CharacterDisplay: React.FC = () => {
	const { player } = useGameStore()
	const { equipment } = player

	return (
		<CharacterContainer>
			{/* Уровень игрока */}
			<PlayerLevel
				data-player-level // Добавляем data-атрибут для эффектов
				initial={{ opacity: 0, y: -30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, type: 'spring' }}
			>
				🎯 Уровень {player.level}
			</PlayerLevel>

			{/* Шлем */}
			<HelmetSlot>
				<EquipmentSlotComponent
					item={equipment.helmet}
					dataAttribute="helmet" // Добавляем для эффектов
				/>
			</HelmetSlot>

			<ArmorSlot>
				<EquipmentSlotComponent
					item={equipment.armor}
					dataAttribute="armor"
				/>
			</ArmorSlot>

			<LeftHandSlot>
				<EquipmentSlotComponent
					item={equipment.leftHand}
					dataAttribute="leftHand"
				/>
			</LeftHandSlot>

			<CharacterBody>
				<Hero src="/man.png" alt="Character" />
			</CharacterBody>

			<RightHandSlot>
				<EquipmentSlotComponent
					item={equipment.rightHand}
					dataAttribute="rightHand"
				/>
			</RightHandSlot>

			<BootsSlot>
				<EquipmentSlotComponent
					item={equipment.boots}
					dataAttribute="boots"
				/>
			</BootsSlot>
		</CharacterContainer>
	)
}
