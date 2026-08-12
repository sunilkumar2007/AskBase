export interface Dashboard {
 id: string
 name: string
 description: string
 widgets: Widget[]
 created_at: string
 updated_at: string
}

export interface Widget {
 id: string
 type: 'chart' | 'kpi' | 'table'
 title: string
 config: Record<string, any>
 position: { x: number; y: number; w: number; h: number }
}
