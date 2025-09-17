import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { colors } from '../../styles/colors'
import type { TaskCategory } from '../../types'
import {
	generatePotionsArrayByTask,
	generatePotionsByTask,
} from '../../utils/gameUtils'
import { TaskItemComponent } from './TaskItemComponent'

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
