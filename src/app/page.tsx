"use client"

import { useEffect, useState } from "react"

const EMPTY_STATE = "--:--.---"
type Mode = "clear" | "timing" | "stopped"

export default function Home() {
    const [startTime, setStartTime] = useState<number | null>(null)
    const [elapsedTime, setElapsedTime] = useState<number>(0)
    const [mode, setMode] = useState<Mode>("clear")

    const reset = () => {
        setStartTime(null)
        setElapsedTime(0)
        setMode("clear")
    }

    const startTimer = () => {
        setStartTime(Date.now())
        setMode("timing")
    }

    const stopTimer = () => {
        if (startTime !== null) setElapsedTime(Date.now() - startTime)
        setStartTime(null)
        setMode("stopped")
    }

    const getFormattedTime = (time: number) => {
        const dateObject = new Date(time)
        const minutes = dateObject.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2 })
        const seconds = dateObject.getSeconds().toLocaleString("en-US", { minimumIntegerDigits: 2 })
        const milliseconds = dateObject.getMilliseconds().toLocaleString("en-US", { minimumIntegerDigits: 3 })

        return `${minutes}:${seconds}.${milliseconds}`
    }

    useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if (e.repeat || e.code !== "Space") return

            if (mode === "timing") stopTimer()
            else if (mode === "stopped") reset()
        }

        const keyupHandler = (e: KeyboardEvent) => {
            if (e.code === "Space" && mode === "clear") startTimer()
        }

        window.addEventListener("keydown", keydownHandler)
        window.addEventListener("keyup", keyupHandler)

        return () => {
            window.removeEventListener("keydown", keydownHandler)
            window.removeEventListener("keyup", keyupHandler)
        }
    }, [mode, stopTimer, startTimer, reset])

    useEffect(() => {
        if (startTime === null) return

        const handleInterval = setInterval(() => setElapsedTime(Date.now() - startTime), 10)

        return () => clearInterval(handleInterval)
    }, [startTime])

    const displayTime = mode === "clear" ? EMPTY_STATE : getFormattedTime(elapsedTime)

    return (
        <div className="grid h-screen w-screen place-items-center font-mono text-4xl">
            <p>{displayTime}</p>
        </div>
    )
}
