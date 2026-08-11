import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import chatRoutes from './api/chat.js'
import agentRoutes from './api/agent.js'
import projectsRoutes from './api/projects.js'
import reportsRoutes from './api/reports.js'
import dashboardsRoutes from './api/dashboards.js'
import filesRoutes from './api/files.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/chat', chatRoutes)
app.use('/api/agent', agentRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/reports', reportsRoutes)
app.use('/api/dashboards', dashboardsRoutes)
app.use('/api/files', filesRoutes)

app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`)
})

export default app
