import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useChat(projectId: string) {
 const queryClient = useQueryClient()

 const { data: messages } = useQuery({
 queryKey: ['chat', projectId],
 queryFn: async () => {
 const res = await fetch(`/api/chat/history/${projectId}`)
 return res.json()
 },
 enabled: !!projectId,
 })

 const sendMessage = useMutation({
 mutationFn: async (message: string) => {
 const res = await fetch(`/api/chat/message`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ projectId, message }),
 })
 return res.json()
 },
 onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chat', projectId] }),
 })

 return { messages, sendMessage }
}
