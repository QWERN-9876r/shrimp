import { createContext, useContext } from 'react'
import type { Potion } from '../types'

interface PotionDropOptions {
	potions: Potion[]
	onComplete: () => void
}

export type OpenBag = (options: PotionDropOptions) => void

const PotionDropContext = createContext<OpenBag | undefined>(undefined)

export const usePotionDropContext = () => {
	const context = useContext(PotionDropContext)
	if (!context) {
		throw new Error(
			'usePotionDropContext must be used within PotionDropProvider',
		)
	}
	return context
}

export const PotionDropContext_Provider = PotionDropContext.Provider
