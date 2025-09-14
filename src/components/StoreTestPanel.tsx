import { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { colors } from '../styles/colors'
import type { TaskCategory, EquipmentType } from '../types'
import { generatePotionsByTask } from '../utils/gameUtils'

const TestPanel = styled(motion.div)`
	background: ${colors.background.panel};
	border: 2px solid ${colors.ui.border};
	border-radius: 15px;
	padding: 1.5rem;
	margin-bottom: 2rem;
	max-width: 800px;
	margin-left: auto;
	margin-right: auto;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
`

const SectionTitle = styled.h3`
	color: ${colors.ui.textAccent};
	margin: 0 0 1rem 0; /* Убираем верхний отступ */
	font-size: 1.1rem;
`

const SubSectionTitle = styled.h4`
	color: ${colors.ui.text};
	margin: 1.5rem 0 0.5rem 0; /* Контролируем отступы */
	font-size: 1rem;
`

const ButtonGroup = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-bottom: 1rem;
`

const TestButton = styled(motion.button)`
	background: linear-gradient(
		135deg,
		${colors.rarity.rare.primary},
		${colors.rarity.rare.secondary}
	);
	color: ${colors.ui.textAccent};
	border: 2px solid ${colors.rarity.rare.border};
	padding: 8px 16px;
	border-radius: 20px;
	cursor: pointer;
	font-size: 0.9rem;
	font-weight: 500;

	&:hover {
		background: linear-gradient(
			135deg,
			${colors.rarity.rare.secondary},
			${colors.rarity.rare.primary}
		);
		box-shadow: 0 0 15px ${colors.rarity.rare.glow};
	}
`

const DangerButton = styled(TestButton)`
	background: linear-gradient(135deg, ${colors.ui.danger}, #c0392b);
	border-color: ${colors.ui.danger};

	&:hover {
		background: linear-gradient(135deg, #c0392b, ${colors.ui.danger});
		box-shadow: 0 0 15px rgba(231, 76, 60, 0.4);
	}
`

const SuccessButton = styled(TestButton)`
	background: linear-gradient(135deg, ${colors.ui.success}, #2ecc71);
	border-color: ${colors.ui.success};

	&:hover {
		background: linear-gradient(135deg, #2ecc71, ${colors.ui.success});
		box-shadow: 0 0 15px rgba(39, 174, 96, 0.4);
	}
`

const TestForm = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	margin-top: 1rem;
	padding: 1rem;
	background: ${colors.background.card};
	border-radius: 10px;
	border: 1px solid ${colors.ui.border};
`

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`

const FormLabel = styled.label`
	color: ${colors.ui.text};
	font-size: 0.9rem;
	font-weight: 500;
`

const Input = styled.input`
	background: ${colors.background.panel};
	border: 2px solid ${colors.ui.border};
	border-radius: 6px;
	padding: 8px 12px;
	color: ${colors.ui.text};
	font-size: 0.9rem;

	&::placeholder {
		color: ${colors.ui.textSecondary};
	}

	&:focus {
		outline: none;
		border-color: ${colors.rarity.rare.border};
		box-shadow: 0 0 10px ${colors.rarity.rare.glow};
	}
`

const Select = styled.select`
	background: ${colors.background.panel};
	border: 2px solid ${colors.ui.border};
	border-radius: 6px;
	padding: 8px 12px;
	color: ${colors.ui.text};
	font-size: 0.9rem;

	&:focus {
		outline: none;
		border-color: ${colors.rarity.rare.border};
		box-shadow: 0 0 10px ${colors.rarity.rare.glow};
	}

	option {
		background: ${colors.background.card};
		color: ${colors.ui.text};
	}
`

const StatsDisplay = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 1rem;
	margin-top: 1rem;
	padding: 1rem;
	background: ${colors.background.card};
	border: 2px solid ${colors.rarity.legendary.border};
	border-radius: 10px;
	box-shadow: 0 0 10px ${colors.rarity.legendary.glow};
`

const StatItem = styled.div`
	text-align: center;
`

const StatValue = styled.div`
	font-size: 1.5rem;
	font-weight: bold;
	color: ${colors.ui.success};
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`

const StatLabel = styled.div`
	font-size: 0.9rem;
	color: ${colors.ui.textSecondary};
`

const CreateButton = styled(TestButton)`
	background: linear-gradient(135deg, ${colors.ui.success}, #2ecc71);
	border-color: ${colors.ui.success};
	margin-top: 1rem;

	&:hover {
		background: linear-gradient(135deg, #2ecc71, ${colors.ui.success});
		box-shadow: 0 0 15px rgba(39, 174, 96, 0.4);
	}
`

const StoreTestPanel = () => {
	const {
		player,
		tasks,
		potions,
		completedTasksCount,
		totalExperienceGained,
		addTestExperience,
		addItemExperience,
		levelUpPlayer,
		addTask,
		completeTask,
		resetGame,
	} = useGameStore()

	const [taskForm, setTaskForm] = useState({
		title: 'Тестовое задание',
		category: 'english' as TaskCategory,
		difficulty: 5,
		unwillingness: 5,
	})

	const handleCreateTask = () => {
		addTask({
			title: taskForm.title,
			description: 'Создано через тестовую панель',
			category: taskForm.category,
			difficulty: taskForm.difficulty,
			unwillingness: taskForm.unwillingness,
			completed: false,
		})
	}

	const handleCompleteRandomTask = () => {
		const incompleteTasks = tasks.filter((t) => !t.completed)
		if (incompleteTasks.length > 0) {
			const randomTask =
				incompleteTasks[
					Math.floor(Math.random() * incompleteTasks.length)
				]

			completeTask(randomTask.id, generatePotionsByTask(randomTask))
		}
	}

	const equipmentTypes: EquipmentType[] = [
		'helmet',
		'armor',
		'leftHand',
		'rightHand',
		'boots',
	]

	return (
		<TestPanel
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<SectionTitle>🧪 Панель тестирования Store</SectionTitle>

			{/* Быстрые действия */}
			<ButtonGroup>
				<TestButton
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => addTestExperience(25)}
				>
					+25 опыта
				</TestButton>

				<TestButton
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => addTestExperience(100)}
				>
					+100 опыта
				</TestButton>

				<SuccessButton
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={levelUpPlayer}
				>
					Повысить уровень
				</SuccessButton>

				<TestButton
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleCompleteRandomTask}
				>
					Выполнить случайное задание
				</TestButton>

				<DangerButton
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={resetGame}
				>
					Сбросить игру
				</DangerButton>
			</ButtonGroup>

			{/* Тестирование предметов */}
			<div>
				<SubSectionTitle>⚔️ Тестирование экипировки</SubSectionTitle>
				<ButtonGroup>
					{equipmentTypes.map((type) => (
						<TestButton
							key={type}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => addItemExperience(type, 50)}
						>
							+50 опыта {player.equipment[type].icon}
						</TestButton>
					))}
				</ButtonGroup>
			</div>

			{/* Форма создания задания */}
			<div>
				<SubSectionTitle>📋 Создание задания</SubSectionTitle>
				<TestForm>
					<FormGroup>
						<FormLabel>Название:</FormLabel>
						<Input
							value={taskForm.title}
							onChange={(e) =>
								setTaskForm((prev) => ({
									...prev,
									title: e.target.value,
								}))
							}
							placeholder="Название задания"
						/>
					</FormGroup>

					<FormGroup>
						<FormLabel>Категория:</FormLabel>
						<Select
							value={taskForm.category}
							onChange={(e) =>
								setTaskForm((prev) => ({
									...prev,
									category: e.target.value as TaskCategory,
								}))
							}
						>
							<option value="english">🛡️ Английский</option>
							<option value="work">⚔️ Работа</option>
							<option value="university">🎓 Университет</option>
							<option value="home">👟 Дом</option>
							<option value="fitness">💪 Фитнес</option>
							<option value="personal">✨ Личное</option>
						</Select>
					</FormGroup>

					<FormGroup>
						<FormLabel>Сложность: {taskForm.difficulty}</FormLabel>
						<Input
							type="range"
							min="1"
							max="10"
							value={taskForm.difficulty}
							onChange={(e) =>
								setTaskForm((prev) => ({
									...prev,
									difficulty: +e.target.value,
								}))
							}
						/>
					</FormGroup>

					<FormGroup>
						<FormLabel>
							Нежелание: {taskForm.unwillingness}
						</FormLabel>
						<Input
							type="range"
							min="1"
							max="10"
							value={taskForm.unwillingness}
							onChange={(e) =>
								setTaskForm((prev) => ({
									...prev,
									unwillingness: +e.target.value,
								}))
							}
						/>
					</FormGroup>
				</TestForm>

				<CreateButton
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleCreateTask}
				>
					Создать задание (опыт:{' '}
					{taskForm.difficulty * taskForm.unwillingness * 10})
				</CreateButton>
			</div>

			{/* Статистика */}
			<div>
				<SubSectionTitle>📊 Текущая статистика</SubSectionTitle>
				<StatsDisplay>
					<StatItem>
						<StatValue>{player.level}</StatValue>
						<StatLabel>👤 Уровень игрока</StatLabel>
					</StatItem>
					<StatItem>
						<StatValue>
							{player.experience}/{player.maxExperience}
						</StatValue>
						<StatLabel>⭐ Опыт игрока</StatLabel>
					</StatItem>
					<StatItem>
						<StatValue>
							{tasks.filter((t) => !t.completed).length}
						</StatValue>
						<StatLabel>📋 Активные задания</StatLabel>
					</StatItem>
					<StatItem>
						<StatValue>{completedTasksCount}</StatValue>
						<StatLabel>✅ Выполнено заданий</StatLabel>
					</StatItem>
					<StatItem>
						<StatValue>
							{potions.filter((p) => !p.used).length}
						</StatValue>
						<StatLabel>🧪 Зелий в инвентаре</StatLabel>
					</StatItem>
					<StatItem>
						<StatValue>{totalExperienceGained}</StatValue>
						<StatLabel>🎯 Всего опыта</StatLabel>
					</StatItem>
				</StatsDisplay>
			</div>
		</TestPanel>
	)
}

export default StoreTestPanel
