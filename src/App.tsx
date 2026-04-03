
import Header from './components/Header'
import WelcomeStats from './components/WelcomeStats'
import ProfileSection from './components/ProfileSection'
import QuickSummary from './components/QuickSummary'
import ReadingList from './components/ReadingList'
import Calendar from './components/Calendar'
import GithubHeatmap from './components/GithubHeatmap'
import OnboardingSummary from './components/OnboardingSummary'
import TaskList from './components/TaskList'

function App() {
  return (
    <div className="dashboard-wrapper">
        <div className="dashboard">
            <Header />
            <WelcomeStats />

            <div className="main-grid">
                {/* Row 1 */}
                <ProfileSection />
                <ReadingList />
                <GithubHeatmap />

                {/* Row 2 */}
                <QuickSummary />
                <Calendar />
                <div className="right-bottom-cards">
                    <OnboardingSummary />
                    <TaskList />
                </div>
            </div>
        </div>
    </div>
  )
}

export default App
