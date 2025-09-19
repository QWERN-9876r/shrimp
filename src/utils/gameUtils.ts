import type {
	Item,
	Player,
	Equipment,
	TaskCategory,
	EquipmentType,
	PlayerStats,
	Task,
	Potion,
	PotionRarity,
} from '../types'

// Маппинг категорий заданий на типы экипировки
export const CATEGORY_TO_EQUIPMENT: Record<TaskCategory, EquipmentType> = {
	english: 'armor',
	work: 'rightHand',
	university: 'helmet',
	home: 'boots',
	fitness: 'leftHand',
	personal: 'armor', // по умолчанию броня
}

// Данные для создания предметов
const ITEM_DATA: Record<
	EquipmentType,
	{ name: string; icon: string; description: string }
> = {
	helmet: {
		name: 'Шлем Знаний',
		icon: '🎓',
		description: 'Защищает от невежества и дает мудрость',
	},
	armor: {
		name: 'Броня Полиглота',
		icon: '🛡️',
		description: 'Защищает от языковых барьеров',
	},
	leftHand: {
		name: 'Щит Здоровья',
		icon: '💪',
		description: 'Дает силу и выносливость',
	},
	rightHand: {
		name: 'Меч Продуктивности',
		icon: '⚔️',
		description: 'Рубит рабочие задачи как масло',
	},
	boots: {
		name: 'Сапоги Домовенка',
		icon: '👟',
		description: 'Увеличивают скорость домашних дел',
	},
}

// Создание начального предмета
export const createInitialItem = (type: EquipmentType): Item => {
	const itemData = ITEM_DATA[type]
	return {
		id: `${type}_initial`,
		type,
		name: itemData.name,
		icon: itemData.icon,
		description: itemData.description,
		level: 1,
		experience: 0,
		maxExperience: 250,
	}
}

// Создание начального снаряжения
export const createInitialEquipment = (): Equipment => ({
	helmet: createInitialItem('helmet'),
	armor: createInitialItem('armor'),
	leftHand: createInitialItem('leftHand'),
	rightHand: createInitialItem('rightHand'),
	boots: createInitialItem('boots'),
})

// Расчет статистик игрока
export const calculatePlayerStats = (equipment: Equipment): PlayerStats => ({
	strength: equipment.rightHand.level * 10 + equipment.leftHand.level * 5,
	defense: equipment.armor.level * 15,
	intelligence: equipment.helmet.level * 12,
	agility: equipment.boots.level * 8,
	health: equipment.leftHand.level * 20,
})

// Создание начального игрока
export const createInitialPlayer = (): Player => {
	const equipment = createInitialEquipment()
	return {
		id: 'player_main',
		name: 'Герой Реальности',
		level: 1,
		experience: 0,
		maxExperience: 300,
		equipment,
		totalStats: calculatePlayerStats(equipment),
	}
}

// Расчет опыта за задание
export const calculateTaskExperience = (
	difficulty: number,
	unwillingness: number,
): number => {
	return Math.floor(difficulty * unwillingness * 10)
}

// Создание тестового задания
export const createTestTask = (
	title: string,
	category: TaskCategory,
	difficulty: number = 5,
	unwillingness: number = 5,
): Task => ({
	id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
	title,
	description: `Тестовое задание категории ${category}`,
	difficulty,
	unwillingness,
	category,
	completed: false,
	experience: calculateTaskExperience(difficulty, unwillingness),
	realDifficulty: difficulty,
	createdAt: new Date(),
})

// Генерация тестовых заданий
export const generateTestTasks = (): Task[] => [
	createTestTask('Изучить 20 английских слов', 'english', 6, 4),
	createTestTask('Закончить отчет по проекту', 'work', 8, 7),
	createTestTask('Прочитать главу по математике', 'university', 5, 8),
	createTestTask('Убрать в квартире', 'home', 4, 9),
	createTestTask('Тренировка в зале', 'fitness', 7, 6),
	createTestTask('Медитация 15 минут', 'personal', 3, 5),
]

// Утилиты для отображения
export const getCategoryIcon = (category: TaskCategory): string => {
	const icons = {
		english: '🛡️',
		work: '⚔️',
		university: '🎓',
		home: '👟',
		fitness: '💪',
		personal: '✨',
	}
	return icons[category]
}

export const getCategoryName = (category: TaskCategory): string => {
	const names = {
		english: 'Английский язык',
		work: 'Работа',
		university: 'Университет',
		home: 'Домашние дела',
		fitness: 'Фитнес',
		personal: 'Личное развитие',
	}
	return names[category]
}

export const getRarityColor = (rarity: PotionRarity): string => {
	const colors = {
		common: '#95a5a6',
		rare: '#3498db',
		epic: '#9b59b6',
		legendary: '#f39c12',
	}
	return colors[rarity]
}

const POTION_REWARDS_EXTENDED = {
	common: [
		{
			name: 'Кофе-брейк',
			icon: '☕',
			description: '15 минут отдыха с любимым напитком',
		},
		{
			name: 'Сладкий перекус',
			icon: '🍫',
			description: 'Маленькое сладкое удовольствие',
		},
		{
			name: 'Прогулка',
			icon: '🚶',
			description: '30-минутная прогулка на свежем воздухе',
		},
		{ name: 'Чай с печеньем', icon: '🍪', description: 'Уютный чаепитие' },
	],
	rare: [
		{
			name: 'Игровая сессия',
			icon: '🎮',
			description: '1 час любимой игры',
		},
		{
			name: 'Вкусный ужин',
			icon: '🍕',
			description: 'Заказать что-то вкусное',
		},
		{
			name: 'Фильм вечером',
			icon: '🎬',
			description: 'Посмотреть интересный фильм',
		},
		{
			name: 'Покупка желания',
			icon: '🛒',
			description: 'Купить что-то приятное (до 1000₽)',
		},
	],
	epic: [
		{
			name: 'Поход в Burger King',
			icon: '🍔',
			description: 'Любимый фастфуд',
		},
		{
			name: 'Сеанс в кино',
			icon: '🎭',
			description: 'Билет на новый фильм',
		},
		{
			name: 'Покупка мечты',
			icon: '🎁',
			description: 'Купить что-то особенное (до 3000₽)',
		},
		{
			name: 'День без дел',
			icon: '🏖️',
			description: 'Целый день полного отдыха',
		},
		{
			name: 'Новая книга/игра',
			icon: '📚',
			description: 'Купить долгожданную новинку',
		},
	],
	legendary: [
		{
			name: 'Выходные мечты',
			icon: '🏖️',
			description: 'Идеальные выходные по твоему плану',
		},
		{
			name: 'Желание исполнилось',
			icon: '⭐',
			description: 'Исполни любое разумное желание',
		},
		{
			name: 'Большая покупка',
			icon: '💎',
			description: 'Крупная покупка (до 10000₽)',
		},
		{
			name: 'Мини-отпуск',
			icon: '✈️',
			description: 'Короткая поездка куда захочешь',
		},
		{
			name: 'VIP день',
			icon: '👑',
			description: 'День, когда все крутится вокруг тебя',
		},
	],
}

const RARITY_ORDER = ['common', 'rare', 'epic', 'legendary']
const RARITY_PRICE: Record<PotionRarity, number> = {
	common: 40,
	rare: 65,
	epic: 92,
	legendary: 102,
}

function getRandomPotionByRarity(rarity: PotionRarity) {
	const potions = POTION_REWARDS_EXTENDED[rarity]
	const potion = potions[Math.floor(Math.random() * potions.length)]

	return {
		id: `potion_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
		name: potion.name,
		icon: potion.icon,
		description: potion.description,
		rarity,
		used: false,
		createdAt: new Date(),
	}
}

export const getBestPotion = (potions: Potion[]) => {
	return potions.reduce((best, current) => {
		if (
			RARITY_ORDER.indexOf(current.rarity) >
			RARITY_ORDER.indexOf(best.rarity)
		) {
			return current
		}
		return best
	}, potions[0])
}

export const getRandomPotion = (realDifficulty: number) => {
	let rarity: PotionRarity = 'common'

	const roll = Math.random() * 100 + realDifficulty / 23 // 23 = max(realDifficulty) * 10

	if (roll >= RARITY_PRICE.legendary) rarity = 'legendary'
	else if (roll >= RARITY_PRICE.epic) rarity = 'epic'
	else if (roll >= RARITY_PRICE.rare) rarity = 'rare'
	else rarity = 'common'

	return getRandomPotionByRarity(rarity)
}

export const generateArrayOfCommonsPotions = (count: number) => {
	const potions: Potion[] = new Array(count)

	for (let i = 0; i < count; i++) {
		potions[i] = getRandomPotionByRarity('common')
	}

	return potions
}

export const generatePotionsArrayByTask = (
	task: Task,
	countPotions: number,
) => {
	const potions: Potion[] = new Array(countPotions)

	for (let i = 0; i < countPotions; i++) {
		potions[i] = getRandomPotion(task.realDifficulty)
	}

	return potions
}

export const generatePotionsByTask = (task: Task) => {
	const rewardCount = Math.min(
		Math.round((task.realDifficulty / 30) * (Math.random() / 2 + 0.5)),
		3,
	)

	if (rewardCount === 0) return { potionsArray: [], dropped: [] }

	const potionsArray = generatePotionsArrayByTask(
		task,
		Math.round(Math.random() * 125) + 75,
	)

	return {
		potionsArray,
		dropped: [
			potionsArray[Math.round((potionsArray.length * 2) / 3)],
			...generateArrayOfCommonsPotions(rewardCount - 1),
		],
	}
}
