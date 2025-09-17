import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useGameStore } from './stores/gameStore'
import TestDataDisplay from './components/TestDataDisplay'
import StoreTestPanel from './components/StoreTestPanel'
import { CharacterDisplay } from './components/Character/CharacterDisplay'
import { PlayerStats } from './components/Character/PlayerStats'
import { TaskCreator } from './components/Tasks/TaskCreator'
import { TaskList } from './components/Tasks/TaskList'
import { PotionInventory } from './components/Potions/PotionInventory'
import { ExperienceSystem } from './components/Experience/ExperienceGain'
import { colors } from './styles/colors'
import { useState } from 'react'
import { PotionDropProvider } from './components/Potions/PotionDropProvider'

const AppContainer = styled.div`
	min-height: 100vh;
	background: ${colors.background.primary};
	color: ${colors.ui.text};
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	padding: 20px;
`

const Header = styled(motion.div)`
	text-align: center;
	margin-bottom: 2rem;
`

const Title = styled(motion.h1)`
	font-size: 3rem;
	margin-bottom: 1rem;
	color: ${colors.ui.textAccent};
	text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.7);
	background: linear-gradient(
		45deg,
		${colors.rarity.legendary.primary},
		${colors.rarity.legendary.border}
	);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;

	@media (max-width: 768px) {
		font-size: 2rem;
	}
`

const OpenTestPanelButton = styled(motion.button)`
	position: fixed;
	bottom: 2rem;
	right: 2rem;
	cursor: pointer;
	background: ${colors.background.card};
	color: ${colors.ui.text};
	padding: 0.9rem 1rem;
	border-radius: 50%;
	border: 2px solid ${colors.ui.border};
	margin-bottom: 2rem;
	box-shadow: 0 0 15px ${colors.ui.border};
`

const MainContent = styled.div`
	display: flex;
	gap: 2rem;
	justify-content: center;
	max-width: 1400px;
	margin: 0 auto;

	@media (max-width: 1200px) {
		grid-template-columns: 1fr;
	}
`

const LeftColumn = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 0;
`

const CharacterSection = styled(motion.div)`
	background: ${colors.background.panel};
	backdrop-filter: blur(10px);
	border: 2px solid ${colors.ui.border};
	border-radius: 15px;
	padding: 2rem;
	text-align: center;
	box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
	margin-bottom: 2rem;
`

const CharacterSectionTitle = styled.h2`
	color: ${colors.ui.textAccent};
	margin: 0 0 2rem 0;
	font-size: 1.3rem;
`

const TasksSection = styled(motion.div)`
	margin-bottom: 2rem;
`

const DataSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	width: 400px;
`

function App() {
	const gameState = useGameStore()
	const [isDevMode, setIsDevMode] = useState(false)

	return (
		<PotionDropProvider>
			<ExperienceSystem>
				<AppContainer>
					<Header
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<Title>⚔️ Shrimp ⚔️</Title>
					</Header>

					<MainContent>
						<LeftColumn>
							<TasksSection
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3, duration: 0.8 }}
							>
								<TaskCreator />
								<TaskList />
							</TasksSection>

							{/* Добавляем инвентарь зелий */}
							<motion.div
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.4, duration: 0.8 }}
							>
								<PotionInventory />
							</motion.div>

							<CharacterSection
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5, duration: 0.8 }}
							>
								<CharacterSectionTitle>
									👤 Твой персонаж
								</CharacterSectionTitle>
								<CharacterDisplay />
								<PlayerStats />
							</CharacterSection>
						</LeftColumn>
						{isDevMode && (
							<DataSection>
								<StoreTestPanel />

								<motion.div
									initial={{ opacity: 0, x: 50 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.7, duration: 0.8 }}
								>
									<TestDataDisplay gameState={gameState} />
								</motion.div>
							</DataSection>
						)}
					</MainContent>
					<OpenTestPanelButton
						onClick={() => setIsDevMode(!isDevMode)}
					>
						🔍
					</OpenTestPanelButton>
				</AppContainer>
			</ExperienceSystem>
		</PotionDropProvider>
	)
}

export default App
