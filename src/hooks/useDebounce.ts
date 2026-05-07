import { useCallback, useEffect, useRef } from "react"

export function useDebounce(fn: () => void, delay: number) {
    const fnRef = useRef(fn)
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

    useEffect(() => {
        fnRef.current = fn
    }, [fn])

    return useCallback(() => {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => fnRef.current(), delay)
    }, [delay])
}