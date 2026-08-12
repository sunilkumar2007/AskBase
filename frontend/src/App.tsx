import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layouts/Layout'
import LandingPage from './landing/LandingPage'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import ChatPage from './pages/ChatPage'
import SchemaPage from './pages/SchemaPage'
import ChartsPage from './pages/ChartsPage'
import DashboardsPage from './pages/DashboardsPage'
import ReportsPage from './pages/ReportsPage'
import VoicePage from './pages/VoicePage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import KnowledgeBasePage from './pages/KnowledgeBasePage'

function App() {
 return (
 <Router>
 <Routes>
 <Route path="/" element={<LandingPage />} />
 <Route path="/home" element={<Layout><HomePage /></Layout>} />
 <Route path="/login" element={<LoginPage />} />
 <Route path="/projects" element={<Layout><ProjectsPage /></Layout>} />
 <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
 <Route path="/chat/:projectId" element={<Layout><ChatPage /></Layout>} />
 <Route path="/knowledge" element={<Layout><KnowledgeBasePage /></Layout>} />
 <Route path="/schema" element={<Layout><SchemaPage /></Layout>} />
 <Route path="/schema/:projectId" element={<Layout><SchemaPage /></Layout>} />
 <Route path="/charts" element={<Layout><ChartsPage /></Layout>} />
 <Route path="/charts/:projectId" element={<Layout><ChartsPage /></Layout>} />
 <Route path="/dashboards" element={<Layout><DashboardsPage /></Layout>} />
 <Route path="/reports" element={<Layout><ReportsPage /></Layout>} />
 <Route path="/voice" element={<Layout><VoicePage /></Layout>} />
 <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
 </Routes>
 </Router>
 )
}

export default App
