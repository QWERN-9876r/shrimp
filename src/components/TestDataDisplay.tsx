import styled from 'styled-components'
import { motion } from 'framer-motion'
import type { GameState, Task, Potion, PotionRarity } from '../types'
import {
	getCategoryIcon,
	getCategoryName,
	getRarityColor,
} from '../utils/gameUtils'

const DisplayContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 1.5rem;
	max-width: 1200px;
	margin: 0 auto;
`

const Section = styled(motion.div)`
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.2);
	border-radius: 15px;
	padding: 1.5rem;
	color: white;
`

const SectionTitle = styled.h3`
	margin-bottom: 1rem;
	color: #81c784;
	display: flex;
	align-items: center;
	gap: 0.5rem;
`

const PlayerCard = styled.div`
	background: rgba(76, 175, 80, 0.1);
	border: 1px solid rgba(76, 175, 80, 0.3);
	border-radius: 10px;
	padding: 1rem;
	margin-bottom: 1rem;
`

const EquipmentGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	gap: 0.5rem;
	margin-top: 1rem;
`

const EquipmentItem = styled.div`
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	padding: 0.5rem;
	text-align: center;
	font-size: 0.8rem;
`

const TaskItem = styled.div`
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	padding: 0.75rem;
	margin-bottom: 0.5rem;
`

const TaskHeader = styled.div`
	display: flex;
	justify-content: between;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 0.5rem;
`

const PotionItem = styled.div<{ $rarity: PotionRarity }>`
	background: ${(props) => `${getRarityColor(props.$rarity)}20`};
	border: ${(props) => `1px solid ${getRarityColor(props.$rarity)}50`};
	border-radius: 8px;
	padding: 0.75rem;
	margin-bottom: 0.5rem;
`

const StatBar = styled.div`
	background: rgba(255, 255, 255, 0.1);
	border-radius: 10px;
	height: 8px;
	overflow: hidden;
	margin-top: 0.25rem;
`

const StatFill = styled.div<{ $width: number }>`
	height: 100%;
	background: linear-gradient(90deg, #4caf50, #8bc34a);
	width: ${(props) => props.$width}%;
	transition: width 0.3s ease;
`

const JsonViewer = styled.pre`
	background: rgba(0, 0, 0, 0.3);
	border-radius: 8px;
	padding: 1rem;
	font-size: 0.75rem;
	overflow-x: auto;
	max-height: 200px;
	overflow-y: auto;
`

interface TestDataDisplayProps {
	gameState: GameState
}

const TestDataDisplay: React.FC<TestDataDisplayProps> = ({ gameState }) => {
	const { player, tasks, potions } = gameState

	return (
		<DisplayContainer>
			{/* Игрок */}
			<Section
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5 }}
			>
				<SectionTitle>👤 Игрок</SectionTitle>
				<PlayerCard>
					<h4>{player.name}</h4>
					<p>Уровень: {player.level}</p>
					<p>
						Опыт: {player.experience}/{player.maxExperience}
					</p>
					<StatBar>
						<StatFill
							$width={
								(player.experience / player.maxExperience) * 100
							}
						/>
					</StatBar>
				</PlayerCard>

				<div>
					<strong>Характеристики:</strong>
					<div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
						<div>💪 Сила: {player.totalStats.strength}</div>
						<div>🛡️ Защита: {player.totalStats.defense}</div>
						<div>
							🧠 Интеллект: {player.totalStats.intelligence}
						</div>
						<div>⚡ Ловкость: {player.totalStats.agility}</div>
						<div>❤️ Здоровье: {player.totalStats.health}</div>
					</div>
				</div>
			</Section>

			{/* Экипировка */}
			<Section
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<SectionTitle>⚔️ Экипировка</SectionTitle>
				<EquipmentGrid>
					{Object.entries(player.equipment).map(([slot, item]) => (
						<EquipmentItem key={slot}>
							<div
								style={{
									fontSize: '1.2rem',
									marginBottom: '0.25rem',
								}}
							>
								{item.icon}
							</div>
							<div>{item.name}</div>
							<div>Ур. {item.level}</div>
							<StatBar>
								<StatFill
									$width={
										(item.experience / item.maxExperience) *
										100
									}
								/>
							</StatBar>
						</EquipmentItem>
					))}
				</EquipmentGrid>
			</Section>

			{/* Задания */}
			<Section
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				<SectionTitle>📋 Задания ({tasks.length})</SectionTitle>
				{tasks.slice(0, 4).map((task: Task) => (
					<TaskItem key={task.id}>
						<TaskHeader>
							<span>{getCategoryIcon(task.category)}</span>
							<strong style={{ flex: 1, fontSize: '0.9rem' }}>
								{task.title}
							</strong>
						</TaskHeader>
						<div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
							<div>{getCategoryName(task.category)}</div>
							<div>
								Сложность: {task.difficulty}/10 | Нежелание:{' '}
								{task.unwillingness}/10
							</div>
							<div>Опыт: +{task.experience}</div>
						</div>
					</TaskItem>
				))}
				{tasks.length > 4 && <div>... и еще {tasks.length - 4}</div>}
			</Section>

			{/* Зелья */}
			<Section
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, delay: 0.3 }}
			>
				<SectionTitle>🧪 Зелья ({potions.length})</SectionTitle>
				{potions.map((potion: Potion) => (
					<PotionItem key={potion.id} $rarity={potion.rarity}>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '0.5rem',
								marginBottom: '0.25rem',
							}}
						>
							<span style={{ fontSize: '1.2rem' }}>
								{potion.icon}
							</span>
							<strong style={{ fontSize: '0.9rem' }}>
								{potion.name}
							</strong>
							<span
								style={{
									fontSize: '0.7rem',
									textTransform: 'uppercase',
									opacity: 0.8,
								}}
							>
								{potion.rarity}
							</span>
						</div>
						<div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
							{potion.description}
						</div>
					</PotionItem>
				))}
			</Section>

			{/* Raw JSON (для разработчика) */}
			<Section
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				style={{ gridColumn: '1 / -1' }}
			>
				<SectionTitle>🔧 Raw JSON (для разработчика)</SectionTitle>
				<JsonViewer>{JSON.stringify(gameState, null, 2)}</JsonViewer>
			</Section>
		</DisplayContainer>
	)
}

export default TestDataDisplay
