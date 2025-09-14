declare global {
	interface Window {
		experienceSystem: {
			showExperience: (
				experience: number,
				position: { x: number; y: number },
			) => void
			showPlayerLevelUp: (level: number) => void
			showEquipmentLevelUp: (
				level: number,
				itemName: string,
				position: { x: number; y: number },
			) => void
		}
	}
}

export interface Item {
	id: string
	name: string
	level: number
	experience: number
	maxExperience: number
	type: EquipmentType
	icon: string
	description: string
}

export type EquipmentType =
	| 'helmet'
	| 'armor'
	| 'leftHand'
	| 'rightHand'
	| 'boots'

export interface Equipment {
	helmet: Item
	armor: Item
	leftHand: Item
	rightHand: Item
	boots: Item
}

export interface Player {
	id: string
	name: string
	level: number
	experience: number
	maxExperience: number
	equipment: Equipment
	totalStats: PlayerStats
}

export interface PlayerStats {
	strength: number // от оружия
	defense: number // от брони
	intelligence: number // от шлема
	agility: number // от сапог
	health: number // от щита
}

export interface Task {
	id: string
	title: string
	description?: string
	difficulty: number // 1-100
	unwillingness: number // 1-10
	category: TaskCategory
	completed: boolean
	experience: number
	createdAt: Date
	completedAt?: Date
}

export type TaskCategory =
	| 'english' // броня (защита от незнания)
	| 'work' // правая рука (атака на задачи)
	| 'university' // шлем (ум и знания)
	| 'home' // сапоги (скорость в быту)
	| 'fitness' // левая рука (здоровье)
	| 'personal' // общий опыт

export interface Potion {
	id: string
	name: string
	description: string
	icon: string
	rarity: PotionRarity
	used: boolean
	createdAt: Date
}

export type PotionRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface GameState {
	player: Player
	tasks: Task[]
	potions: Potion[]
	receivedPotions: Potion[]
	completedTasksCount: number
	totalExperienceGained: number
}
