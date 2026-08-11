export interface Chart {
 id: string
 type: 'line' | 'bar' | 'pie' | 'scatter'
 title: string
 data: Record<string, any>[]
 xAxis?: string
 yAxis?: string
 options?: Record<string, any>
}
