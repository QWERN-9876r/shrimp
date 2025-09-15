import { useState, type CSSProperties } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { colors } from '../../styles/colors'
import type { Potion, Task, TaskCategory } from '../../types'
import {
	generatePotionsByTask,
	getBestPotion,
	getCategoryIcon,
	getCategoryName,
} from '../../utils/gameUtils'

export const SHOW_POTION_ANIMATION_DURATION = 1500

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 5px ${colors.ui.border}; }
  50% { box-shadow: 0 0 20px ${colors.rarity.legendary.glow}, 0 0 30px ${colors.rarity.legendary.primary}; }
`

const sparkleTrail = keyframes`
  0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translateY(-50px) rotate(360deg) scale(0); opacity: 0; }
`

const TaskListContainer = styled.div`
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

const TaskCount = styled.span`
	background: ${colors.rarity.rare.primary};
	color: ${colors.ui.textAccent};
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 0.8rem;
	border: 1px solid ${colors.rarity.rare.border};
`

const FilterContainer = styled(motion.div)`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-bottom: 1.5rem;
	padding: 1rem;
	background: ${colors.background.card};
	border-radius: 10px;
	border: 1px solid ${colors.ui.border};
`

const FilterButton = styled(motion.button)<{ $active: boolean }>`
	background: ${(props) =>
		props.$active
			? `linear-gradient(135deg, ${colors.rarity.rare.primary}, ${colors.rarity.rare.secondary})`
			: colors.background.panel};
	color: ${(props) =>
		props.$active ? colors.ui.textAccent : colors.ui.text};
	border: 2px solid
		${(props) =>
			props.$active ? colors.rarity.rare.border : colors.ui.border};
	padding: 6px 12px;
	border-radius: 20px;
	cursor: pointer;
	font-size: 0.8rem;
	font-weight: 500;
	transition: all 0.3s ease;
	position: relative;
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
		border-color: ${colors.rarity.rare.border};
		box-shadow: 0 0 10px ${colors.rarity.rare.glow};

		&::before {
			left: 100%;
		}
	}
`

const SortSelect = styled.select`
	background: ${colors.background.panel};
	border: 2px solid ${colors.ui.border};
	border-radius: 8px;
	padding: 6px 12px;
	color: ${colors.ui.text};
	font-size: 0.8rem;
	cursor: pointer;

	&:focus {
		outline: none;
		border-color: ${colors.rarity.rare.border};
		box-shadow: 0 0 10px ${colors.rarity.rare.glow};
	}
`

const TaskGrid = styled.div`
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
`

const TaskItem = styled(motion.div)<{ $difficulty: number }>`
	background: ${colors.background.card};
	border: 2px solid
		${(props) => {
			if (props.$difficulty >= 8) return colors.ui.danger
			if (props.$difficulty >= 6) return colors.ui.warning
			if (props.$difficulty >= 4) return colors.rarity.rare.border
			return colors.ui.border
		}};
	border-radius: 12px;
	padding: 1.5rem;
	position: relative;
	cursor: pointer;
	transition: all 0.3s ease;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: ${(props) => {
			if (props.$difficulty >= 8)
				return `linear-gradient(90deg, ${colors.ui.danger}, #ff6b6b)`
			if (props.$difficulty >= 6)
				return `linear-gradient(90deg, ${colors.ui.warning}, #ffd93d)`
			if (props.$difficulty >= 4)
				return `linear-gradient(90deg, ${colors.rarity.rare.primary}, ${colors.rarity.rare.border})`
			return `linear-gradient(90deg, ${colors.ui.success}, #6bcf7f)`
		}};
	}

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.1),
			transparent
		);
		transition: left 0.6s ease;
	}

	&:hover {
		&::after {
			left: 100%;
		}
	}
`

const CompletionOverlay = styled(motion.div)`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(
		135deg,
		${colors.rarity.legendary.primary} 40,
		${colors.ui.success} 40
	);
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
`

const CompletionEffect = styled(motion.div)`
	font-size: 4rem;
	filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.8));
`

const Sparkles = styled(motion.div)`
	position: absolute;
	pointer-events: none;
	z-index: 5;

	&::before,
	&::after {
		content: '✨';
		position: absolute;
		font-size: 1.5rem;
	}

	&::before {
		top: 10%;
		left: 10%;
		animation: ${sparkleTrail} ${SHOW_POTION_ANIMATION_DURATION}ms ease-out
			infinite;
		animation-delay: 0s;
	}

	&::after {
		top: 80%;
		right: 10%;
		animation: ${sparkleTrail} ${SHOW_POTION_ANIMATION_DURATION}ms ease-out
			infinite;
		animation-delay: 0.5s;
	}
`

const RippleEffect = styled(motion.div)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 20px;
	height: 20px;
	border: 2px solid ${colors.ui.success};
	border-radius: 50%;
	pointer-events: none;
`

const TaskHeader = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: 1rem;
	gap: 1rem;
`

const TaskTitle = styled(motion.h4)`
	color: ${colors.ui.textAccent};
	margin: 0;
	font-size: 1.1rem;
	line-height: 1.3;
	flex: 1;
`

const CategoryBadge = styled(motion.div)<{ $category: TaskCategory }>`
	background: ${(props) => {
		const categoryColors = {
			english: colors.rarity.rare.primary,
			work: colors.rarity.epic.primary,
			university: colors.rarity.legendary.primary,
			home: colors.stats.agility,
			fitness: colors.ui.danger,
			personal: colors.stats.intelligence,
		}
		return categoryColors[props.$category]
	}};
	color: ${colors.ui.textAccent};
	padding: 4px 8px;
	border-radius: 12px;
	font-size: 0.7rem;
	font-weight: bold;
	text-align: center;
	min-width: 60px;
	border: 1px solid rgba(255, 255, 255, 0.2);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`

const TaskDescription = styled(motion.p)`
	color: ${colors.ui.textSecondary};
	margin: 0 0 1rem 0;
	font-size: 0.9rem;
	line-height: 1.4;
	font-style: italic;
`

const TaskStats = styled(motion.div)`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1rem;
	margin-bottom: 1.5rem;
`

const StatBlock = styled(motion.div)`
	text-align: center;
	padding: 0.5rem;
	background: rgba(0, 0, 0, 0.2);
	border-radius: 8px;
	border: 1px solid ${colors.ui.border};
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-2px);
		background: rgba(0, 0, 0, 0.3);
		border-color: ${colors.rarity.rare.border};
	}
`

const StatValue = styled(motion.div)<{
	$type: 'difficulty' | 'unwillingness' | 'experience'
}>`
	font-size: 1.2rem;
	font-weight: bold;
	color: ${(props) => {
		if (props.$type === 'experience') return colors.rarity.legendary.primary
		if (props.$type === 'difficulty') return colors.ui.warning
		return colors.ui.danger
	}};
	margin-bottom: 0.25rem;
`

const StatLabel = styled.div`
	font-size: 0.7rem;
	color: ${colors.ui.textSecondary};
	text-transform: uppercase;
	letter-spacing: 0.5px;
`

const ActionContainer = styled(motion.div)`
	display: flex;
	gap: 0.5rem;
`

const CompleteButton = styled(motion.button)<{ $isCompleting: boolean }>`
	flex: 1;
	background: ${(props) =>
		props.$isCompleting
			? `linear-gradient(135deg, ${colors.rarity.legendary.primary}, ${colors.rarity.legendary.secondary})`
			: `linear-gradient(135deg, ${colors.ui.success}, #2ecc71)`};
	color: ${colors.ui.textAccent};
	border: none;
	padding: 12px;
	border-radius: 8px;
	cursor: pointer;
	font-weight: bold;
	font-size: 0.9rem;
	border: 2px solid
		${(props) =>
			props.$isCompleting
				? colors.rarity.legendary.border
				: colors.ui.success};
	position: relative;
	overflow: hidden;

	${(props) =>
		props.$isCompleting &&
		css`
			animation: ${glowPulse} 1s ease-in-out infinite;
		`}

	&:hover {
		background: ${(props) =>
			props.$isCompleting
				? `linear-gradient(135deg, ${colors.rarity.legendary.secondary}, ${colors.rarity.legendary.primary})`
				: `linear-gradient(135deg, #2ecc71, ${colors.ui.success})`};
		box-shadow: 0 0 20px
			${(props) =>
				props.$isCompleting
					? colors.rarity.legendary.glow
					: 'rgba(39, 174, 96, 0.4)'};
	}

	&:disabled {
		cursor: not-allowed;
	}
`

const DeleteButton = styled(motion.button)`
	background: ${colors.background.panel};
	color: ${colors.ui.danger};
	border: 2px solid ${colors.ui.danger};
	padding: 12px;
	border-radius: 8px;
	cursor: pointer;
	font-weight: bold;
	width: 45px;

	&:hover {
		background: ${colors.ui.danger};
		color: ${colors.ui.textAccent};
		box-shadow: 0 0 15px rgba(231, 76, 60, 0.4);
	}
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

interface TaskItemComponentProps {
	task: Task
	potions: Potion[]
	onComplete: (taskId: string, positions: Potion[]) => void
	onDelete: (taskId: string) => void
}

const TaskItemComponent: React.FC<TaskItemComponentProps> = ({
	task,
	potions,
	onComplete,
	onDelete,
}) => {
	const [isCompleting, setIsCompleting] = useState(false)
	const [showCompletionEffect, setShowCompletionEffect] = useState(false)
	const controls = useAnimation()
	potions = potions.filter(Boolean)
	const bestPotion = getBestPotion(potions)

	const handleComplete = async () => {
		setIsCompleting(true)
		setShowCompletionEffect(true)

		// Анимация завершения
		await controls.start({
			scale: [1, 1.05, 1],
			rotateY: [0, 10, -10, 0],
			transition: { duration: 0.5 },
		})

		setTimeout(async () => {
			onComplete(task.id, potions)
		}, 1000)
	}

	const handleDelete = async () => {
		// Анимация удаления
		await controls.start({
			x: [0, -10, 10, -5, 5, 0],
			transition: { duration: 0.5 },
		})
		onDelete(task.id)
	}

	const createdDate = new Date(task.createdAt).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit',
	})

	return (
		<TaskItem
			$difficulty={task.difficulty}
			layout
			initial={{
				opacity: 0,
				scale: 0.8,
				rotateX: -90,
				y: 50,
			}}
			animate={{
				opacity: 1,
				scale: 1,
				rotateX: 0,
				y: 0,
			}}
			exit={{
				opacity: 0,
				scale: 0.8,
				rotateX: 90,
				y: -50,
				transition: { duration: 0.4 },
			}}
			transition={{
				type: 'spring',
				stiffness: 200,
				damping: 20,
				duration: 0.15,
				layout: { duration: 0.15 },
			}}
			whileHover={{
				scale: 1.02,
				y: -5,
				transition: { duration: 0.2 },
			}}
			whileTap={{ scale: 0.98 }}
		>
			<AnimatePresence>
				{showCompletionEffect && (
					<CompletionOverlay
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						style={
							bestPotion
								? ({
										background: `linear-gradient(
                                        135deg,
                                        ${colors.rarity[bestPotion!.rarity].primary}40,
                                        ${colors.ui.success}40
                                    )`,
									} as CSSProperties)
								: {}
						}
					>
						<CompletionEffect
							initial={{ scale: 0, rotate: -180 }}
							animate={{
								scale: [0, 1.5, 1],
								rotate: [0, 360, 720],
							}}
							transition={{
								duration: 1.2,
								ease: 'easeOut',
							}}
						>
							{bestPotion?.icon}
						</CompletionEffect>

						<Sparkles
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						/>

						<RippleEffect
							initial={{ scale: 0, opacity: 0.8 }}
							animate={{
								scale: [0, 1, 2, 3],
								opacity: [0.8, 0.6, 0.3, 0],
							}}
							transition={{
								duration: 1.5,
								ease: 'easeOut',
							}}
						/>
					</CompletionOverlay>
				)}
			</AnimatePresence>

			<TaskHeader>
				<TaskTitle whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
					{task.title}
				</TaskTitle>
				<CategoryBadge
					$category={task.category}
					whileHover={{
						scale: 1.1,
						rotate: [0, -5, 5, 0],
					}}
					transition={{ duration: 0.3 }}
				>
					{getCategoryIcon(task.category)}
					<div style={{ fontSize: '0.6rem', marginTop: '2px' }}>
						{getCategoryName(task.category)}
					</div>
				</CategoryBadge>
			</TaskHeader>

			{task.description && (
				<TaskDescription
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					"{task.description}"
				</TaskDescription>
			)}

			<TaskStats
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
			>
				{[
					{
						type: 'difficulty' as const,
						value: task.difficulty,
						label: 'Сложность',
					},
					{
						type: 'unwillingness' as const,
						value: task.unwillingness,
						label: 'Нежелание',
					},
					{
						type: 'experience' as const,
						value: task.experience,
						label: 'Опыт',
						prefix: '+',
					},
				].map((stat, index) => (
					<StatBlock
						key={stat.label}
						whileHover={{
							scale: 1.1,
							y: -3,
						}}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 + index * 0.1 }}
					>
						<StatValue
							$type={stat.type}
							whileHover={{ scale: 1.2 }}
						>
							{stat.prefix || ''}
							{stat.value}
						</StatValue>
						<StatLabel>{stat.label}</StatLabel>
					</StatBlock>
				))}
			</TaskStats>

			<motion.div
				style={{
					fontSize: '0.8rem',
					color: colors.ui.textSecondary,
					marginBottom: '1rem',
					textAlign: 'center',
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.6 }}
			>
				📅 Создано: {createdDate}
			</motion.div>

			<ActionContainer
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.7 }}
			>
				<CompleteButton
					$isCompleting={isCompleting}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleComplete}
					disabled={isCompleting}
				>
					{isCompleting ? (
						<motion.span
							animate={{ opacity: [1, 0.5, 1] }}
							transition={{ duration: 1, repeat: Infinity }}
						>
							🎯 Завершаю...
						</motion.span>
					) : (
						'✅ Выполнить'
					)}
				</CompleteButton>

				<DeleteButton
					whileHover={{
						scale: 1.1,
						rotate: [0, -10, 10, 0],
					}}
					whileTap={{ scale: 0.9 }}
					onClick={handleDelete}
					disabled={isCompleting}
				>
					🗑️
				</DeleteButton>
			</ActionContainer>
		</TaskItem>
	)
}

type FilterType = 'all' | TaskCategory
type SortType = 'newest' | 'oldest' | 'difficulty' | 'experience'

export const TaskList = () => {
	const { tasks, completeTask, removeTask } = useGameStore()
	const [filter, setFilter] = useState<FilterType>('all')
	const [sort, setSort] = useState<SortType>('newest')

	const activeTasks = tasks.filter((task) => !task.completed)

	const filteredTasks = activeTasks.filter((task) => {
		if (filter === 'all') return true
		return task.category === filter
	})

	const sortedTasks = [...filteredTasks].sort((a, b) => {
		switch (sort) {
			case 'newest':
				return (
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime()
				)
			case 'oldest':
				return (
					new Date(a.createdAt).getTime() -
					new Date(b.createdAt).getTime()
				)
			case 'difficulty':
				return b.difficulty - a.difficulty
			case 'experience':
				return b.experience - a.experience
			default:
				return 0
		}
	})

	const filterOptions: { value: FilterType; label: string; icon: string }[] =
		[
			{ value: 'all', label: 'Все', icon: '📋' },
			{ value: 'english', label: 'Английский', icon: '🛡️' },
			{ value: 'work', label: 'Работа', icon: '⚔️' },
			{ value: 'university', label: 'Учеба', icon: '🎓' },
			{ value: 'home', label: 'Дом', icon: '👟' },
			{ value: 'fitness', label: 'Фитнес', icon: '💪' },
			{ value: 'personal', label: 'Личное', icon: '✨' },
		]

	return (
		<TaskListContainer>
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<SectionTitle>
					📋 Активные задания
					<TaskCount>{activeTasks.length}</TaskCount>
				</SectionTitle>

				{activeTasks.length > 0 && (
					<FilterContainer
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2, duration: 0.4 }}
					>
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
									whileHover={{ scale: 1.05, y: -2 }}
									whileTap={{ scale: 0.95 }}
								>
									{option.icon} {option.label}
								</FilterButton>
							))}
						</div>

						<SortSelect
							value={sort}
							onChange={(e) =>
								setSort(e.target.value as SortType)
							}
						>
							<option value="newest">🕐 Сначала новые</option>
							<option value="oldest">⏰ Сначала старые</option>
							<option value="difficulty">🔥 По сложности</option>
							<option value="experience">⭐ По опыту</option>
						</SortSelect>
					</FilterContainer>
				)}
			</motion.div>

			<AnimatePresence mode="wait">
				{sortedTasks.length > 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<TaskGrid>
							<AnimatePresence>
								{sortedTasks.map((task) => (
									<TaskItemComponent
										key={task.id}
										task={task}
										potions={generatePotionsByTask(task)}
										onComplete={completeTask}
										onDelete={removeTask}
									/>
								))}
							</AnimatePresence>
						</TaskGrid>
					</motion.div>
				) : (
					<EmptyState
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{ duration: 0.5 }}
					>
						<EmptyIcon>
							{filter === 'all'
								? '📋'
								: filterOptions.find((f) => f.value === filter)
										?.icon}
						</EmptyIcon>
						<h3
							style={{
								color: colors.ui.text,
								marginBottom: '0.5rem',
							}}
						>
							{filter === 'all'
								? 'Нет активных заданий'
								: `Нет заданий в категории "${filterOptions.find((f) => f.value === filter)?.label}"`}
						</h3>
						<p>
							{filter === 'all'
								? 'Создайте свое первое задание выше!'
								: 'Попробуйте выбрать другую категорию или создать новое задание.'}
						</p>
					</EmptyState>
				)}
			</AnimatePresence>
		</TaskListContainer>
	)
}
