import { ReactNode, useEffect } from 'react'

interface ModalProps {
 isOpen: boolean
 onClose: () => void
 title?: string
 children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = 'hidden'
 }
 return () => {
 document.body.style.overflow = 'unset'
 }
 }, [isOpen])

 if (!isOpen) return null

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center">
 <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
 <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
 {title && (
 <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
 <h3 className="text-lg font-semibold">{title}</h3>
 <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
 ✕
 </button>
 </div>
 )}
 <div className="p-6">
 {children}
 </div>
 </div>
 </div>
 )
}
