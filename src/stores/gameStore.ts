import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, Task, Potion, EquipmentType } from '../types'
import {
	createInitialPlayer,
	calculatePlayerStats,
	calculateTaskExperience,
	CATEGORY_TO_EQUIPMENT,
} from '../utils/gameUtils'
import { SHOW_POTION_ANIMATION_DURATION } from '../components/Tasks/TaskList'

interface GameStore extends GameState {
	// Actions для игрока
	addPlayerExperience: (
		amount: number,
		showEffect?: boolean,
		position?: { x: number; y: number },
	) => boolean // возвращает true если был levelup
	levelUpPlayer: () => void

	// Actions для экипировки
	addItemExperience: (
		equipmentType: EquipmentType,
		amount: number,
		showEffect?: boolean,
	) => boolean // возвращает true если был levelup
	levelUpItem: (equipmentType: EquipmentType) => void
	updatePlayerStats: () => void

	// Actions для заданий
	addTask: (task: Omit<Task, 'id' | 'experience' | 'createdAt'>) => void
	completeTask: (taskId: string, potions: Potion[]) => void
	removeTask: (taskId: string) => void

	// Actions для зелий
	addPotion: (potion: Potion) => void
	usePotion: (potionId: string) => void

	// Utility actions
	resetGame: () => void
	addTestExperience: (amount: number) => void
}

const initialState: GameState = {
	player: createInitialPlayer(),
	tasks: [],
	potions: [],
	receivedPotions: [],
	completedTasksCount: 0,
	totalExperienceGained: 0,
}

// Утилитарная функция для получения позиции элемента на экране
const getElementPosition = (selector: string): { x: number; y: number } => {
	const element = document.querySelector(selector)
	if (element) {
		const rect = element.getBoundingClientRect()
		return {
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2,
		}
	}
	return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
}

export const useGameStore = create<GameStore>()(
	persist(
		(set, get) => ({
			...initialState,

			// === ИГРОК ===
			addPlayerExperience: (
				amount: number,
				showEffect = true,
				position,
			) => {
				let leveledUp = false

				set((state) => {
					let currentExp = state.player.experience + amount
					let currentMaxExp = state.player.maxExperience
					let currentLevel = state.player.level

					while (currentExp >= currentMaxExp) {
						leveledUp = true
						currentExp -= currentMaxExp
						currentLevel++
						currentMaxExp = Math.floor(currentMaxExp * 1.5)
					}

					return {
						player: {
							...state.player,
							level: currentLevel,
							experience: currentExp,
							maxExperience: currentMaxExp,
						},
						totalExperienceGained:
							state.totalExperienceGained + amount,
					}
				})

				// Показываем визуальные эффекты
				if (showEffect && window.experienceSystem) {
					const effectPosition =
						position || getElementPosition('[data-player-level]')
					window.experienceSystem.showExperience(
						amount,
						effectPosition,
					)

					if (leveledUp) {
						setTimeout(() => {
							window.experienceSystem.showPlayerLevelUp(
								get().player.level,
							)
						}, 500)
					}
				}

				return leveledUp
			},

			// === ЭКИПИРОВКА ===
			addItemExperience: (
				equipmentType: EquipmentType,
				amount: number,
				showEffect = true,
			) => {
				let leveledUp = false

				set((state) => {
					const currentItem = state.player.equipment[equipmentType]
					let currentExp = currentItem.experience + amount
					let currentMaxExp = currentItem.maxExperience
					let currentLevel = currentItem.level

					// Проверяем множественные повышения уровня предмета
					while (currentExp >= currentMaxExp) {
						leveledUp = true
						currentExp -= currentMaxExp
						currentLevel++
						currentMaxExp = Math.floor(currentMaxExp * 1.2)
					}

					const updatedItem = {
						...currentItem,
						level: currentLevel,
						experience: currentExp,
						maxExperience: currentMaxExp,
					}

					const newEquipment = {
						...state.player.equipment,
						[equipmentType]: updatedItem,
					}

					return {
						player: {
							...state.player,
							equipment: newEquipment,
							totalStats: calculatePlayerStats(newEquipment),
						},
					}
				})

				// Показываем визуальные эффекты
				if (showEffect && leveledUp && window.experienceSystem) {
					const equipmentPosition = getElementPosition(
						`[data-equipment="${equipmentType}"]`,
					)
					const itemName = get().player.equipment[equipmentType].name
					const newLevel = get().player.equipment[equipmentType].level

					setTimeout(() => {
						window.experienceSystem.showEquipmentLevelUp(
							newLevel,
							itemName,
							equipmentPosition,
						)
					}, 1000)
				}

				return leveledUp
			},

			// Исправляем levelUpPlayer (для тестовой кнопки):
			levelUpPlayer: () => {
				set((state) => ({
					player: {
						...state.player,
						level: state.player.level + 1,
						experience: 0, // ИСПРАВЛЕНО: сбрасываем опыт на 0
						maxExperience: Math.floor(
							state.player.maxExperience * 1.5,
						),
					},
				}))

				if (window.experienceSystem) {
					window.experienceSystem.showPlayerLevelUp(
						get().player.level,
					)
				}
			},

			levelUpItem: (equipmentType: EquipmentType) => {
				set((state) => {
					const currentItem = state.player.equipment[equipmentType]
					const updatedItem = {
						...currentItem,
						level: currentItem.level + 1,
						experience: 0,
						maxExperience: Math.floor(
							currentItem.maxExperience * 1.2,
						),
					}

					const newEquipment = {
						...state.player.equipment,
						[equipmentType]: updatedItem,
					}

					return {
						player: {
							...state.player,
							equipment: newEquipment,
							totalStats: calculatePlayerStats(newEquipment),
						},
					}
				})

				if (window.experienceSystem) {
					const equipmentPosition = getElementPosition(
						`[data-equipment="${equipmentType}"]`,
					)
					const itemName = get().player.equipment[equipmentType].name
					const newLevel = get().player.equipment[equipmentType].level

					window.experienceSystem.showEquipmentLevelUp(
						newLevel,
						itemName,
						equipmentPosition,
					)
				}
			},

			updatePlayerStats: () => {
				set((state) => ({
					player: {
						...state.player,
						totalStats: calculatePlayerStats(
							state.player.equipment,
						),
					},
				}))
			},

			// === ЗАДАНИЯ ===
			addTask: (taskData) => {
				const newTask: Task = {
					...taskData,
					id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
					experience: calculateTaskExperience(
						taskData.difficulty,
						taskData.unwillingness,
					),
					difficulty:
						taskData.difficulty *
							0.5 *
							(taskData.unwillingness * 0.7) +
						20,
					createdAt: new Date(),
				}

				set((state) => ({
					tasks: [...state.tasks, newTask],
				}))
			},

			completeTask: (taskId: string, potions: Potion[]) => {
				const { tasks, addPlayerExperience, addItemExperience } = get()
				const task = tasks.find((t) => t.id === taskId)

				if (!task || task.completed) return

				// Отмечаем задание как выполненное
				set((state) => ({
					tasks: state.tasks.map((t) =>
						t.id === taskId
							? { ...t, completed: true, completedAt: new Date() }
							: t,
					),
					completedTasksCount: state.completedTasksCount + 1,
				}))

				set(() => ({
					receivedPotions: potions,
				}))

				setTimeout(() => {
					set((state) => ({
						receivedPotions: [],
						potions: [...state.potions, ...potions],
					}))
					addPlayerExperience(task.experience)
					addItemExperience(
						CATEGORY_TO_EQUIPMENT[task.category],
						task.experience,
					)
				}, SHOW_POTION_ANIMATION_DURATION)
			},

			removeTask: (taskId: string) => {
				set((state) => ({
					tasks: state.tasks.filter((t) => t.id !== taskId),
				}))
			},

			// === ЗЕЛЬЯ ===
			addPotion: (potion: Potion) => {
				set((state) => ({
					potions: [...state.potions, potion],
				}))
			},

			usePotion: (potionId: string) => {
				set((state) => ({
					potions: state.potions.map((p) =>
						p.id === potionId ? { ...p, used: true } : p,
					),
				}))
			},

			// === УТИЛИТЫ ===
			resetGame: () => {
				set(initialState)
			},

			addTestExperience: (amount: number) => {
				const { addPlayerExperience, addItemExperience } = get()
				addPlayerExperience(amount, true)

				// Добавляем опыт случайному предмету
				const equipmentTypes: EquipmentType[] = [
					'helmet',
					'armor',
					'leftHand',
					'rightHand',
					'boots',
				]
				const randomType =
					equipmentTypes[
						Math.floor(Math.random() * equipmentTypes.length)
					]
				addItemExperience(randomType, amount, true)
			},
		}),
		{
			name: 'life-rpg-storage',
			version: 1,
		},
	),
)
