import { motion, useAnimation } from 'framer-motion'
import { useMemo, useState } from 'react'
import {
	generatePotionsByTask,
	getCategoryIcon,
	getCategoryName,
} from '../../utils/gameUtils'
import type { Potion, Task, TaskCategory } from '../../types'
import { colors } from '../../styles/colors'
import styled, { css, keyframes } from 'styled-components'
import { usePotionDrop } from '../../hooks/usePotionDrop'

export const SHOW_POTION_ANIMATION_DURATION = 1500

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 5px ${colors.ui.border}; }
  50% { box-shadow: 0 0 20px ${colors.rarity.legendary.glow}, 0 0 30px ${colors.rarity.legendary.primary}; }
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

interface TaskItemComponentProps {
	task: Task
	onComplete: (taskId: string, positions: Potion[]) => void
	onDelete: (taskId: string) => void
}

export const TaskItemComponent: React.FC<TaskItemComponentProps> = ({
	task,
	onComplete,
	onDelete,
}) => {
	const [isCompleting, setIsCompleting] = useState(false)
	const controls = useAnimation()
	const openBag = usePotionDrop()
	const potions = useMemo(() => generatePotionsByTask(task), [task])

	const handleComplete = async () => {
		setIsCompleting(true)

		// Анимация завершения
		await controls.start({
			scale: [1, 1.05, 1],
			rotateY: [0, 10, -10, 0],
			transition: { duration: 0.5 },
		})

		openBag({
			potions: potions.potionsArray,
			onComplete: () => onComplete(task.id, potions.dropped),
		})
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
