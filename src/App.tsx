
import Header from './components/Header'
import WelcomeStats from './components/WelcomeStats'
import ProfileSection from './components/ProfileSection'
import ProgressChart from './components/ProgressChart'
import Calendar from './components/Calendar'
import TimeTracker from './components/TimeTracker'
import OnboardingSummary from './components/OnboardingSummary'
import TaskList from './components/TaskList'

function App() {
  return (
    <div className="dashboard-wrapper">
        <div className="dashboard">
            <Header />
            <WelcomeStats />

            <div className="main-grid">
                <ProfileSection />
                
                <div className="col-mid">
                    <ProgressChart />
                    <Calendar />
                </div>
                
                <div className="col-right">
                    <div className="right-top-cards">
                        <TimeTracker />
                        <OnboardingSummary />
                    </div>
                    <TaskList />
                </div>
            </div>
        </div>
    </div>
  )
}

export default App
