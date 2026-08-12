# Database Schema

## Tables

### users
- \`id\` UUID PRIMARY KEY
- \`email\` VARCHAR(255) UNIQUE NOT NULL
- \`password_hash\` VARCHAR(255) NOT NULL
- \`name\` VARCHAR(255)
- \`created_at\` TIMESTAMP DEFAULT NOW()
- \`updated_at\` TIMESTAMP DEFAULT NOW()

### projects
- \`id\` UUID PRIMARY KEY
- \`name\` VARCHAR(255) NOT NULL
- \`description\` TEXT
- \`user_id\` UUID REFERENCES users(id)
- \`database_config\` JSONB
- \`created_at\` TIMESTAMP DEFAULT NOW()
- \`updated_at\` TIMESTAMP DEFAULT NOW()

### chats
- \`id\` UUID PRIMARY KEY
- \`project_id\` UUID REFERENCES projects(id)
- \`session_id\` VARCHAR(255)
- \`messages\` JSONB
- \`created_at\` TIMESTAMP DEFAULT NOW()

### reports
- \`id\` UUID PRIMARY KEY
- \`project_id\` UUID REFERENCES projects(id)
- \`name\` VARCHAR(255) NOT NULL
- \`format\` VARCHAR(50)
- \`file_path\` VARCHAR(500)
- \`created_at\` TIMESTAMP DEFAULT NOW()

### dashboards
- \`id\` UUID PRIMARY KEY
- \`project_id\` UUID REFERENCES projects(id)
- \`name\` VARCHAR(255) NOT NULL
- \`config\` JSONB
- \`created_at\` TIMESTAMP DEFAULT NOW()
- \`updated_at\` TIMESTAMP DEFAULT NOW()
