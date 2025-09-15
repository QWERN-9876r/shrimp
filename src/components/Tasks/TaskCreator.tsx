import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { colors } from '../../styles/colors'
import type { TaskCategory } from '../../types'
import { getCategoryIcon, getCategoryName } from '../../utils/gameUtils'

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const TaskCreatorContainer = styled.div`
	background: ${colors.background.panel};
	border: 2px solid ${colors.ui.border};
	border-radius: 15px;
	padding: 1.5rem;
	margin-bottom: 1.5rem;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
`

const SectionTitle = styled.h3`
	color: ${colors.ui.textAccent};
	margin: 0 0 1rem 0;
	font-size: 1.1rem;
	display: flex;
	align-items: center;
	gap: 0.5rem;
`

const CreateButton = styled(motion.button)`
	background: linear-gradient(135deg, ${colors.ui.success}, #2ecc71);
	color: ${colors.ui.textAccent};
	border: none;
	padding: 12px 24px;
	border-radius: 25px;
	cursor: pointer;
	font-size: 1rem;
	font-weight: bold;
	margin-bottom: 1rem;
	box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
	border: 2px solid rgba(39, 174, 96, 0.5);

	&:hover {
		box-shadow: 0 6px 20px rgba(39, 174, 96, 0.5);
		border-color: ${colors.ui.success};
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`

const FormRow = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1.5rem;
	margin-bottom: 1.5rem;
`

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`

const FormLabel = styled.label`
	color: ${colors.ui.text};
	font-size: 0.9rem;
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 0.5rem;
`

const Input = styled.input`
	background: ${colors.background.panel};
	border: 2px solid ${colors.ui.border};
	border-radius: 8px;
	padding: 12px;
	color: ${colors.ui.text};
	font-size: 0.9rem;
	transition: all 0.3s ease;

	&::placeholder {
		color: ${colors.ui.textSecondary};
	}

	&:focus {
		outline: none;
		border-color: ${colors.rarity.rare.border};
		box-shadow: 0 0 15px ${colors.rarity.rare.glow};
		background: ${colors.background.card};
	}
`

const TextArea = styled.textarea`
	background: ${colors.background.panel};
	border: 2px solid ${colors.ui.border};
	border-radius: 8px;
	padding: 12px;
	color: ${colors.ui.text};
	font-size: 0.9rem;
	resize: vertical;
	min-height: 80px;
	font-family: inherit;
	transition: all 0.3s ease;

	&::placeholder {
		color: ${colors.ui.textSecondary};
	}

	&:focus {
		outline: none;
		border-color: ${colors.rarity.rare.border};
		box-shadow: 0 0 15px ${colors.rarity.rare.glow};
		background: ${colors.background.card};
	}
`

const Select = styled.select`
	background: ${colors.background.panel};
	border: 2px solid ${colors.ui.border};
	border-radius: 8px;
	padding: 12px;
	color: ${colors.ui.text};
	font-size: 0.9rem;
	cursor: pointer;
	transition: all 0.3s ease;

	&:focus {
		outline: none;
		border-color: ${colors.rarity.rare.border};
		box-shadow: 0 0 15px ${colors.rarity.rare.glow};
		background: ${colors.background.card};
	}

	option {
		background: ${colors.background.card};
		color: ${colors.ui.text};
		padding: 8px;
	}
`

const SliderContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`

const SliderLabel = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const SliderValue = styled.span<{ $value: number; $max: number }>`
	font-weight: bold;
	color: ${(props) => {
		const ratio = props.$value / props.$max
		if (ratio < 0.3) return colors.ui.success
		if (ratio < 0.6) return colors.ui.warning
		return colors.ui.danger
	}};
	font-size: 1.1rem;
`

const Slider = styled.input`
	width: 100%;
	height: 8px;
	border-radius: 4px;
	background: ${colors.background.panel};
	outline: none;
	border: 1px solid ${colors.ui.border};

	&::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: linear-gradient(
			135deg,
			${colors.rarity.rare.primary},
			${colors.rarity.rare.secondary}
		);
		cursor: pointer;
		border: 2px solid ${colors.rarity.rare.border};
		box-shadow: 0 0 10px ${colors.rarity.rare.glow};
		transition: all 0.2s ease;

		&:hover {
			transform: scale(1.2);
			box-shadow: 0 0 15px ${colors.rarity.rare.glow};
		}
	}

	&::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: linear-gradient(
			135deg,
			${colors.rarity.rare.primary},
			${colors.rarity.rare.secondary}
		);
		cursor: pointer;
		border: 2px solid ${colors.rarity.rare.border};
		box-shadow: 0 0 10px ${colors.rarity.rare.glow};
	}
`

const ExperiencePreview = styled(motion.div)`
	background: linear-gradient(
		135deg,
		${colors.rarity.legendary.primary},
		${colors.rarity.legendary.secondary}
	);
	color: ${colors.ui.textAccent};
	padding: 1rem 1.5rem;
	border-radius: 12px;
	text-align: center;
	font-weight: bold;
	font-size: 1.1rem;
	border: 2px solid ${colors.rarity.legendary.border};
	box-shadow: 0 0 20px ${colors.rarity.legendary.glow};
	margin: 1rem 0;
	position: relative;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -100%;
		width: 300%;
		height: 200%;
		background: linear-gradient(
			45deg,
			transparent 30%,
			rgba(255, 255, 255, 0.1) 45%,
			rgba(255, 255, 255, 0.2) 50%,
			rgba(255, 255, 255, 0.1) 55%,
			transparent 70%
		);
		animation: shimmer 3s ease-in-out infinite;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%) rotate(45deg);
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		100% {
			transform: translateX(100%) rotate(45deg);
			opacity: 0;
		}
	}
`

const SubmitButton = styled(motion.button)`
	width: 100%;
	background: linear-gradient(135deg, ${colors.ui.success}, #2ecc71);
	color: ${colors.ui.textAccent};
	border: none;
	padding: 15px;
	border-radius: 12px;
	cursor: pointer;
	font-size: 1.1rem;
	font-weight: bold;
	border: 2px solid ${colors.ui.success};
	transition: all 0.3s ease;

	&:hover {
		background: linear-gradient(135deg, #2ecc71, ${colors.ui.success});
		box-shadow: 0 0 25px rgba(39, 174, 96, 0.5);
		transform: translateY(-2px);
	}

	&:active {
		transform: translateY(0);
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}
`

const CategoryOption = styled.option`
	background: ${colors.background.card};
	color: ${colors.ui.text};
	padding: 12px;
`

const ValidationMessage = styled(motion.div)`
	color: ${colors.ui.danger};
	font-size: 0.8rem;
	margin-top: 0.25rem;
	display: flex;
	align-items: center;
	gap: 0.25rem;
`

const TaskForm = styled(motion.div)`
	background: ${colors.background.card};
	padding: 1.5rem;
	border-radius: 12px;
	margin-top: 1rem;
	border: 1px solid ${colors.ui.border};
`

const TIME_ON_MISSION_COMPLETE = [
	'',
	'5 минут',
	'15 минут',
	'30 минут',
	'час',
	'3 часа',
	'6 часов',
	'12 часов',
	'3 дня',
	'1 неделя',
	'> недели',
] as const

export const TaskCreator = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [errors, setErrors] = useState<Record<string, string>>({})
	const { addTask } = useGameStore()

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		difficulty: 5,
		unwillingness: 5,
		category: 'english' as TaskCategory,
	})

	const expectedExp = formData.difficulty * formData.unwillingness * 10

	const categories: {
		value: TaskCategory
		label: string
		description: string
	}[] = [
		{
			value: 'english',
			label: 'Английский язык',
			description: 'Прокачивает броню (защита от языковых барьеров)',
		},
		{
			value: 'work',
			label: 'Работа',
			description: 'Прокачивает оружие (продуктивность)',
		},
		{
			value: 'university',
			label: 'Университет',
			description: 'Прокачивает шлем (знания и мудрость)',
		},
		{
			value: 'home',
			label: 'Домашние дела',
			description: 'Прокачивает сапоги (скорость в быту)',
		},
		{
			value: 'fitness',
			label: 'Фитнес',
			description: 'Прокачивает щит (здоровье и сила)',
		},
		{
			value: 'personal',
			label: 'Личное развитие',
			description: 'Общий опыт персонажа',
		},
	]

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.title.trim()) {
			newErrors.title = 'Название задания обязательно'
		} else if (formData.title.length < 3) {
			newErrors.title = 'Название должно содержать минимум 3 символа'
		}

		if (formData.description.length > 200) {
			newErrors.description = 'Описание не должно превышать 200 символов'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) return

		addTask({
			title: formData.title.trim(),
			description: formData.description.trim(),
			category: formData.category,
			difficulty: formData.difficulty,
			unwillingness: formData.unwillingness,
			completed: false,
		})

		// Сбрасываем форму
		setFormData({
			title: '',
			description: '',
			difficulty: 5,
			unwillingness: 5,
			category: 'english',
		})

		setErrors({})
		setIsOpen(false)
	}

	const handleInputChange = (
		field: string,
		value: (typeof formData)[keyof typeof formData],
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }))

		// Очищаем ошибку при изменении поля
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }))
		}
	}

	const timeOnMissionComplete = TIME_ON_MISSION_COMPLETE[formData.difficulty]

	return (
		<TaskCreatorContainer>
			<SectionTitle>📋 Создание заданий</SectionTitle>

			<CreateButton
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={() => setIsOpen(!isOpen)}
			>
				{isOpen ? '✖️ Закрыть' : '➕ Создать новое задание'}
			</CreateButton>

			<AnimatePresence>
				{isOpen && (
					<TaskForm
						initial={{ opacity: 0, height: 0, rotateX: -90 }}
						animate={{
							opacity: 1,
							height: 'auto',
							rotateX: 0,
							transition: {
								height: { duration: 0.3 },
								opacity: { duration: 0.4, delay: 0.1 },
								rotateX: { duration: 0.4, delay: 0.2 },
							},
						}}
						exit={{
							opacity: 0,
							height: 0,
							rotateX: -90,
							transition: {
								opacity: { duration: 0.2 },
								rotateX: { duration: 0.3, delay: 0.1 },
								height: { duration: 0.3, delay: 0.2 },
							},
						}}
					>
						<form onSubmit={handleSubmit}>
							<FormRow>
								<FormGroup>
									<FormLabel>📝 Название задания</FormLabel>
									<Input
										type="text"
										value={formData.title}
										onChange={(e) =>
											handleInputChange(
												'title',
												e.target.value,
											)
										}
										placeholder="Например: Изучить 20 новых слов"
										maxLength={100}
									/>
									<AnimatePresence>
										{errors.title && (
											<ValidationMessage
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
											>
												⚠️ {errors.title}
											</ValidationMessage>
										)}
									</AnimatePresence>
								</FormGroup>

								<FormGroup>
									<FormLabel>
										{getCategoryIcon(formData.category)}{' '}
										Категория
									</FormLabel>
									<Select
										value={formData.category}
										onChange={(e) =>
											handleInputChange(
												'category',
												e.target.value as TaskCategory,
											)
										}
									>
										{categories.map((cat) => (
											<CategoryOption
												key={cat.value}
												value={cat.value}
											>
												{getCategoryIcon(cat.value)}{' '}
												{cat.label}
											</CategoryOption>
										))}
									</Select>
									<div
										style={{
											fontSize: '0.8rem',
											color: colors.ui.textSecondary,
											fontStyle: 'italic',
										}}
									>
										{
											categories.find(
												(c) =>
													c.value ===
													formData.category,
											)?.description
										}
									</div>
								</FormGroup>
							</FormRow>

							<FormGroup>
								<FormLabel>
									📄 Описание (необязательно)
								</FormLabel>
								<TextArea
									value={formData.description}
									onChange={(e) =>
										handleInputChange(
											'description',
											e.target.value,
										)
									}
									placeholder="Дополнительные детали или мотивация..."
									maxLength={200}
								/>
								<div
									style={{
										fontSize: '0.8rem',
										color: colors.ui.textSecondary,
										textAlign: 'right',
									}}
								>
									{formData.description.length}/200
								</div>
								<AnimatePresence>
									{errors.description && (
										<ValidationMessage
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
										>
											⚠️ {errors.description}
										</ValidationMessage>
									)}
								</AnimatePresence>
							</FormGroup>

							<FormRow>
								<SliderContainer>
									<SliderLabel>
										<FormLabel>🎯 Сложность</FormLabel>
										<SliderValue
											$value={formData.difficulty}
											$max={10}
										>
											{formData.difficulty}/10
										</SliderValue>
									</SliderLabel>
									<Slider
										type="range"
										min="1"
										max="10"
										value={formData.difficulty}
										onChange={(e) =>
											handleInputChange(
												'difficulty',
												parseInt(e.target.value),
											)
										}
									/>
									<div
										style={{
											fontSize: '0.8rem',
											color: colors.ui.textSecondary,
										}}
									>
										{timeOnMissionComplete}
									</div>
								</SliderContainer>

								<SliderContainer>
									<SliderLabel>
										<FormLabel>😤 Нежелание</FormLabel>
										<SliderValue
											$value={formData.unwillingness}
											$max={10}
										>
											{formData.unwillingness}/10
										</SliderValue>
									</SliderLabel>
									<Slider
										type="range"
										min="1"
										max="10"
										value={formData.unwillingness}
										onChange={(e) =>
											handleInputChange(
												'unwillingness',
												parseInt(e.target.value),
											)
										}
									/>
									<div
										style={{
											fontSize: '0.8rem',
											color: colors.ui.textSecondary,
										}}
									>
										{formData.unwillingness <= 3 &&
											'💚 Хочется делать'}
										{formData.unwillingness > 3 &&
											formData.unwillingness <= 6 &&
											'😐 Нейтрально'}
										{formData.unwillingness > 6 &&
											formData.unwillingness <= 8 &&
											'😒 Не хочется'}
										{formData.unwillingness > 8 &&
											'🤢 Очень не хочется'}
									</div>
								</SliderContainer>
							</FormRow>

							<ExperiencePreview
								key={expectedExp} // Перезапускаем анимацию при изменении
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								🎯 Ожидаемый опыт: {expectedExp} XP
								<div
									style={{
										fontSize: '0.9rem',
										opacity: 0.8,
										marginTop: '0.25rem',
									}}
								>
									{expectedExp < 50 && 'Небольшая награда'}
									{expectedExp >= 50 &&
										expectedExp < 100 &&
										'Хорошая награда'}
									{expectedExp >= 100 && 'Отличная награда!'}
								</div>
							</ExperiencePreview>

							<SubmitButton
								type="submit"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								disabled={!formData.title.trim()}
							>
								🎯 Создать задание
							</SubmitButton>
						</form>
					</TaskForm>
				)}
			</AnimatePresence>
		</TaskCreatorContainer>
	)
}
