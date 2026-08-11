export interface Project {
 id: string
 name: string
 description: string
 database_type: 'postgresql' | 'mysql' | 'sqlite'
 connection_string: string
 user_id: string
 created_at: string
 updated_at: string
}
