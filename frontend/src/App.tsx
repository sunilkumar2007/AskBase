import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layouts/Layout'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ChatPage from './pages/ChatPage'
import ChartsPage from './pages/ChartsPage'
import DashboardsPage from './pages/DashboardsPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'

function App() {
 return (
 <Router>
 <Layout>
 <Routes>
 <Route path="/" element={<HomePage />} />
 <Route path="/login" element={<LoginPage />} />
 <Route path="/projects" element={<ProjectsPage />} />
 <Route path="/chat/:projectId" element={<ChatPage />} />
 <Route path="/charts/:projectId" element={<ChartsPage />} />
 <Route path="/dashboards" element={<DashboardsPage />} />
 <Route path="/reports" element={<ReportsPage />} />
 <Route path="/settings" element={<SettingsPage />} />
 </Routes>
 </Layout>
 </Router>
 )
}

export default App
