import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { colors } from '../../styles/colors'

const float = keyframes`
  0% { transform: translateY(0px); opacity: 1; }
  100% { transform: translateY(-80px); opacity: 0; }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`

const ExperienceContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	z-index: 1000;
	overflow: hidden;
`

const ExperiencePopup = styled(motion.div)`
	position: absolute;
	background: linear-gradient(
		135deg,
		${colors.rarity.legendary.primary},
		${colors.rarity.legendary.secondary}
	);
	color: ${colors.ui.textAccent};
	padding: 12px 20px;
	border-radius: 25px;
	font-weight: bold;
	font-size: 1.2rem;
	border: 3px solid ${colors.rarity.legendary.border};
	box-shadow: 0 0 30px ${colors.rarity.legendary.glow};
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
	white-space: nowrap;
`

const LevelUpEffect = styled(motion.div)`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 4rem;
	color: ${colors.rarity.legendary.primary};
	text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
	font-weight: bold;
	z-index: 1001;
`

const LevelUpBackground = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: radial-gradient(
		circle,
		${colors.rarity.legendary.glow} 0%,
		transparent 50%
	);
	z-index: 999;
`

const EquipmentLevelUp = styled(motion.div)<{
	$position: { x: number; y: number }
}>`
	position: absolute;
	left: ${(props) => props.$position.x}px;
	top: ${(props) => props.$position.y}px;
	transform: translate(-50%, -50%);
	background: linear-gradient(
		135deg,
		${colors.rarity.epic.primary},
		${colors.rarity.epic.secondary}
	);
	color: ${colors.ui.textAccent};
	padding: 8px 16px;
	border-radius: 20px;
	font-weight: bold;
	border: 2px solid ${colors.rarity.epic.border};
	box-shadow: 0 0 20px ${colors.rarity.epic.glow};
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
`

interface ExperienceGainProps {
	experience: number
	position: { x: number; y: number }
	onComplete?: () => void
}

export const ExperienceGainPopup: React.FC<ExperienceGainProps> = ({
	experience,
	position,
	onComplete,
}) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onComplete?.()
		}, 2000)
		return () => clearTimeout(timer)
	}, [onComplete])

	return (
		<ExperiencePopup
			initial={{
				x: position.x,
				y: position.y,
				scale: 0,
				opacity: 0,
			}}
			animate={{
				x: position.x,
				y: position.y - 80,
				scale: 1,
				opacity: 1,
			}}
			exit={{
				opacity: 0,
				scale: 0.5,
				y: position.y - 120,
			}}
			transition={{
				duration: 2,
				ease: 'easeOut',
			}}
		>
			+{experience} XP
		</ExperiencePopup>
	)
}

interface LevelUpEffectProps {
	type: 'player' | 'equipment'
	level: number
	equipmentName?: string
	position?: { x: number; y: number }
	onComplete?: () => void
}

export const LevelUpEffectComponent: React.FC<LevelUpEffectProps> = ({
	type,
	level,
	equipmentName,
	position,
	onComplete,
}) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onComplete?.()
		}, 3000)
		return () => clearTimeout(timer)
	}, [onComplete])

	if (type === 'player') {
		return (
			<>
				<LevelUpBackground
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.3 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}
				/>
				<LevelUpEffect
					initial={{ scale: 0, rotate: -180, opacity: 0 }}
					animate={{
						scale: [0, 1.5, 1],
						rotate: [0, 360, 0],
						opacity: 1,
					}}
					exit={{ scale: 0, opacity: 0 }}
					transition={{
						duration: 2,
						ease: 'easeOut',
						scale: { times: [0, 0.6, 1] },
					}}
				>
					🎯 УРОВЕНЬ {level}! 🎯
				</LevelUpEffect>
			</>
		)
	}

	return (
		<EquipmentLevelUp
			$position={position!}
			initial={{ scale: 0, opacity: 0, rotateY: -90 }}
			animate={{
				scale: [0, 1.3, 1],
				opacity: 1,
				rotateY: 0,
			}}
			exit={{ scale: 0, opacity: 0 }}
			transition={{
				duration: 1.5,
				ease: 'easeOut',
			}}
		>
			{equipmentName} ⬆️ {level}
		</EquipmentLevelUp>
	)
}

interface ExperienceSystemProps {
	children: React.ReactNode
}

export const ExperienceSystem: React.FC<ExperienceSystemProps> = ({
	children,
}) => {
	const [effects, setEffects] = useState<
		Array<{
			id: string
			type: 'experience' | 'playerLevel' | 'equipmentLevel'
			data: unknown
		}>
	>([])

	const addEffect = (
		type: 'experience' | 'playerLevel' | 'equipmentLevel',
		data: unknown,
	) => {
		const id = `${type}_${Date.now()}_${Math.random()}`
		setEffects((prev) => [...prev, { id, type, data }])
	}

	const removeEffect = (id: string) => {
		setEffects((prev) => prev.filter((effect) => effect.id !== id))
	}

	// Глобальный доступ к системе эффектов
	useEffect(() => {
		window.experienceSystem = {
			showExperience: (
				experience: number,
				position: { x: number; y: number },
			) => {
				addEffect('experience', { experience, position })
			},
			showPlayerLevelUp: (level: number) => {
				addEffect('playerLevel', { level })
			},
			showEquipmentLevelUp: (
				level: number,
				equipmentName: string,
				position: { x: number; y: number },
			) => {
				addEffect('equipmentLevel', { level, equipmentName, position })
			},
		}
	}, [])

	return (
		<>
			{children}
			<ExperienceContainer>
				<AnimatePresence>
					{effects.map((effect) => {
						if (effect.type === 'experience') {
							return (
								<ExperienceGainPopup
									key={effect.id}
									experience={effect.data.experience}
									position={effect.data.position}
									onComplete={() => removeEffect(effect.id)}
								/>
							)
						}

						if (effect.type === 'playerLevel') {
							return (
								<LevelUpEffectComponent
									key={effect.id}
									type="player"
									level={effect.data.level}
									onComplete={() => removeEffect(effect.id)}
								/>
							)
						}

						if (effect.type === 'equipmentLevel') {
							return (
								<LevelUpEffectComponent
									key={effect.id}
									type="equipment"
									level={effect.data.level}
									equipmentName={effect.data.equipmentName}
									position={effect.data.position}
									onComplete={() => removeEffect(effect.id)}
								/>
							)
						}

						return null
					})}
				</AnimatePresence>
			</ExperienceContainer>
		</>
	)
}
