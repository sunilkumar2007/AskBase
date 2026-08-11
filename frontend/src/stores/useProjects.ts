import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useProjects() {
 const queryClient = useQueryClient()

 const { data: projects, isLoading } = useQuery({
 queryKey: ['projects'],
 queryFn: async () => {
 const res = await fetch('/api/projects')
 return res.json()
 },
 })

 const createProject = useMutation({
 mutationFn: async (project: { name: string; description: string }) => {
 const res = await fetch('/api/projects', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(project),
 })
 return res.json()
 },
 onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
 })

 return { projects, isLoading, createProject }
}
