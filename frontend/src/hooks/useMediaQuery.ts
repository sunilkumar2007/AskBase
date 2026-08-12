import { useEffect, useState } from 'react'

type MediaQuery = '(min-width: 768px)' | '(min-width: 1024px)'

export function useMediaQuery(query: MediaQuery): boolean {
 const [matches, setMatches] = useState(false)

 useEffect(() => {
 const media = window.matchMedia(query)
 setMatches(media.matches)
 const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
 media.addEventListener('change', handler)
 return () => media.removeEventListener('change', handler)
 }, [query])

 return matches
}
