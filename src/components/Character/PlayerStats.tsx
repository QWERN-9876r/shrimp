import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { colors } from '../../styles/colors'

const StatsContainer = styled(motion.div)`
	background: ${colors.background.panel};
	backdrop-filter: blur(10px);
	border: 2px solid ${colors.ui.border};
	border-radius: 15px;
	padding: 1.5rem;
	margin-top: 2rem;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
`

const SectionTitle = styled.h3`
	color: ${colors.ui.textAccent};
	margin: 0 0 1rem 0; /* Убираем верхний отступ */
	font-size: 1.1rem;
	text-align: left;
`

const StatsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 1rem;
	margin-top: 1rem;
`

const StatItem = styled(motion.div)`
	background: ${colors.background.card};
	border: 2px solid ${colors.ui.border};
	border-radius: 10px;
	padding: 1rem;
	text-align: center;
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
		border-color: ${colors.ui.borderLight};
	}
`

const StatIcon = styled.div`
	font-size: 2rem;
	margin-bottom: 0.5rem;
`

const StatValue = styled.div<{ $statType: string }>`
	font-size: 1.5rem;
	font-weight: bold;
	color: ${(props) =>
		colors.stats[props.$statType as keyof typeof colors.stats] ||
		colors.ui.success};
	margin-bottom: 0.25rem;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`

const StatLabel = styled.div`
	font-size: 0.9rem;
	color: ${colors.ui.text};
`

const PlayerLevelInfo = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1rem;
	padding: 1rem;
	background: ${colors.background.card};
	border: 2px solid ${colors.rarity.legendary.border};
	border-radius: 10px;
	box-shadow: 0 0 15px ${colors.rarity.legendary.glow};
`

const LevelDisplay = styled.div`
	font-size: 1.2rem;
	font-weight: bold;
	color: ${colors.ui.textAccent};
`

const ExpBar = styled.div`
	flex: 1;
	height: 20px;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 10px;
	margin: 0 1rem;
	overflow: hidden;
	position: relative;
	border: 1px solid ${colors.ui.border};
`

const ExpFill = styled(motion.div)<{ $progress: number }>`
	height: 100%;
	background: linear-gradient(
		90deg,
		${colors.rarity.legendary.primary},
		${colors.rarity.legendary.border}
	);
	border-radius: 10px;
	width: ${(props) => props.$progress}%;
	position: relative;
	box-shadow: 0 0 10px ${colors.rarity.legendary.glow};
	overflow: hidden; /* Добавляем overflow: hidden */

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: -50%; /* Начинаем левее */
		width: 200%; /* Увеличиваем ширину */
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent 0%,
			transparent 20%,
			rgba(255, 255, 255, 0.1) 40%,
			rgba(255, 255, 255, 0.4) 50%,
			rgba(255, 255, 255, 0.1) 60%,
			transparent 80%,
			transparent 100%
		);
		animation: shimmer 3s ease-in-out infinite;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			transform: translateX(100%);
			opacity: 0;
		}
	}
`

const ExpText = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 0.8rem;
	font-weight: bold;
	color: ${colors.ui.textAccent};
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
	z-index: 1;
`

export const PlayerStats: React.FC = () => {
	const { player } = useGameStore()
	const { totalStats } = player

	const expProgress = (player.experience / player.maxExperience) * 100

	const stats = [
		{
			icon: '💪',
			label: 'Сила',
			value: totalStats.strength,
			description: 'Урон в бою',
			type: 'strength',
		},
		{
			icon: '🛡️',
			label: 'Защита',
			value: totalStats.defense,
			description: 'Сопротивление урону',
			type: 'defense',
		},
		{
			icon: '🧠',
			label: 'Интеллект',
			value: totalStats.intelligence,
			description: 'Изучение нового',
			type: 'intelligence',
		},
		{
			icon: '⚡',
			label: 'Ловкость',
			value: totalStats.agility,
			description: 'Скорость действий',
			type: 'agility',
		},
		{
			icon: '❤️',
			label: 'Здоровье',
			value: totalStats.health,
			description: 'Выносливость',
			type: 'health',
		},
	]

	return (
		<StatsContainer
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<SectionTitle>📊 Характеристики персонажа</SectionTitle>

			<PlayerLevelInfo>
				<LevelDisplay>👤 Уровень {player.level}</LevelDisplay>

				<ExpBar>
					<ExpText>
						{player.experience} / {player.maxExperience} опыта
					</ExpText>
					<ExpFill
						$progress={expProgress}
						initial={{ width: 0 }}
						animate={{ width: `${expProgress}%` }}
						transition={{ duration: 1, ease: 'easeOut' }}
					/>
				</ExpBar>

				<div
					style={{
						fontSize: '0.9rem',
						color: colors.ui.textSecondary,
					}}
				>
					{Math.round(expProgress)}%
				</div>
			</PlayerLevelInfo>

			<StatsGrid>
				{stats.map((stat, index) => (
					<StatItem
						key={stat.label}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: index * 0.1, duration: 0.3 }}
						whileHover={{ scale: 1.05 }}
					>
						<StatIcon>{stat.icon}</StatIcon>
						<StatValue $statType={stat.type}>
							{stat.value}
						</StatValue>
						<StatLabel>{stat.label}</StatLabel>
						<div
							style={{
								fontSize: '0.7rem',
								color: colors.ui.textSecondary,
								marginTop: '0.25rem',
							}}
						>
							{stat.description}
						</div>
					</StatItem>
				))}
			</StatsGrid>
		</StatsContainer>
	)
}
