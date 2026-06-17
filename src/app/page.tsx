"use client"

import { useState, useEffect } from "react"

const EMPTY_STATE = "--:--.---"

export default function Home() {
    const [startTime, setStartTime] = useState<number | null>(null)
    const [elapsedTime, setElapsedTime] = useState<number>(0)
    const [displayTime, setDisplayTime] = useState<string>(EMPTY_STATE)
    const [mode, setMode] = useState<string>("clear")

    const reset = () => {
        setStartTime(null)
        setElapsedTime(0)
        setDisplayTime(EMPTY_STATE)
        setMode("clear")
    }

    const startTimer = () => {
        setStartTime(Date.now())
        setMode("timing")
    }

    const stopTimer = () => {
        setStartTime(null)
    }

    const getFormattedTime = (time: number) => {
        const dateObject = new Date(time)
        const minutes = dateObject.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 })
        const seconds = dateObject.getSeconds().toLocaleString('en-US', { minimumIntegerDigits: 2 })
        const milliseconds = dateObject.getMilliseconds().toLocaleString('en-US', { minimumIntegerDigits: 3 })

        return `${minutes}:${seconds}.${milliseconds}`
    }

    useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if (e.repeat) return

            if (e.code === "Space") {
                if (mode === "timing" && startTime !== null) stopTimer()
                else reset()
            }
        }

        const keyupHandler = (e: KeyboardEvent) => {
            if (e.code === "Space" && mode === 'clear') startTimer()
        }

        if (startTime !== null) setDisplayTime(getFormattedTime(elapsedTime))

        window.addEventListener("keydown", keydownHandler)
        window.addEventListener("keyup", keyupHandler)

        return () => {
            window.removeEventListener("keydown", keydownHandler)
            window.removeEventListener("keyup", keyupHandler)
        }
    }, [startTime, elapsedTime])

    useEffect(() => {
        if (startTime === null) return

        const handleInterval = setInterval(() => setElapsedTime(Date.now() - startTime), 0)

        return () => clearInterval(handleInterval)
    }, [startTime])

    return (
        <div className="w-screen h-screen grid place-items-center font-mono text-4xl">
            <p>{displayTime}</p>
        </div>
    )
}
