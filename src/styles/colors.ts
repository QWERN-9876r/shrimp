// Цветовая палитра в стиле Heroes of Might & Magic / Diablo
export const colors = {
	// Основные цвета фона
	background: {
		primary:
			'linear-gradient(135deg, #1a0f0a 0%, #2d1810 50%, #1a0f0a 100%)',
		secondary: 'linear-gradient(135deg, #2a1810, #1f1208)',
		panel: 'rgba(20, 10, 5, 0.85)',
		card: 'rgba(40, 25, 15, 0.9)',
	},

	// Редкость предметов (как в Diablo)
	rarity: {
		common: {
			primary: '#8C7853', // Серо-коричневый
			secondary: '#6B5B42',
			border: '#A0916F',
			glow: 'rgba(140, 120, 83, 0.4)',
		},
		rare: {
			primary: '#4A90E2', // Синий
			secondary: '#2E5C8A',
			border: '#6BA6F5',
			glow: 'rgba(74, 144, 226, 0.4)',
		},
		epic: {
			primary: '#9B59B6', // Фиолетовый
			secondary: '#7D4A93',
			border: '#B569D1',
			glow: 'rgba(155, 89, 182, 0.4)',
		},
		legendary: {
			primary: '#F39C12', // Золотой
			secondary: '#D68910',
			border: '#F7C52D',
			glow: 'rgba(243, 156, 18, 0.6)',
		},
		set: {
			primary: '#27AE60', // Зеленый (сет предметы)
			secondary: '#1F8A4F',
			border: '#2ECC71',
			glow: 'rgba(39, 174, 96, 0.5)',
		},
	},

	// Интерфейс
	ui: {
		text: '#E8D5B7', // Пергаментный
		textSecondary: '#B8A082',
		textAccent: '#F4E4BC',
		border: '#8B6F47',
		borderLight: '#A0916F',
		success: '#27AE60',
		warning: '#F39C12',
		danger: '#E74C3C',
	},

	// Характеристики
	stats: {
		strength: '#E74C3C', // Красный
		defense: '#3498DB', // Синий
		intelligence: '#9B59B6', // Фиолетовый
		agility: '#27AE60', // Зеленый
		health: '#E67E22', // Оранжевый
	},
}

export const animations = {
	shimmer: `
      @keyframes smoothShimmer {
        0% { 
          transform: translateX(-100%);
          opacity: 0;
        }
        15% {
          opacity: 1;
        }
        85% {
          opacity: 1;
        }
        100% { 
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `,

	shimmerDiagonal: `
      @keyframes smoothShimmerDiagonal {
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
    `,
}

// Функция для создания плавного градиента shimmer
export const createShimmerGradient = (intensity = 0.3) => `
    linear-gradient(90deg, 
      transparent 0%, 
      transparent 25%, 
      rgba(255,255,255,${intensity * 0.5}) 45%,
      rgba(255,255,255,${intensity}) 50%,
      rgba(255,255,255,${intensity * 0.5}) 55%,
      transparent 75%, 
      transparent 100%
    )
  `
