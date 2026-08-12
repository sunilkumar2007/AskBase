export function cn(...classes: (string | boolean | undefined | null | Record<string, boolean>)[]): string {
 return classes.filter(Boolean).join(' ')
}
