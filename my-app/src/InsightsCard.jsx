import React, { useContext, useMemo } from 'react'
import { SleepScheduleContext } from './SleepScheduleContext.jsx'

function formatDurationMs(durationMs) {
  const totalMinutes = Math.max(0, Math.floor(durationMs / 60000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) {
    return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`
  }
  return `${minutes} min${minutes !== 1 ? 's' : ''}`
}

export default function InsightsCard() {
  const { napLogs, schedule } = useContext(SleepScheduleContext)

  const totalSleepMs = useMemo(() => {
    if (!Array.isArray(napLogs)) return 0
    return napLogs.reduce((sum, log) => {
      const start = log?.start ? new Date(log.start).getTime() : 0
      const end = log?.end ? new Date(log.end).getTime() : 0
      const diff = Math.max(0, end - start)
      return sum + diff
    }, 0)
  }, [napLogs])

  const nextNapText = useMemo(() => {
    if (!Array.isArray(schedule) || schedule.length === 0) return 'No upcoming naps'
    const next = new Date(schedule[0]).getTime()
    const now = Date.now()
    const diff = next - now
    if (diff <= 0) return 'No upcoming naps'
    return formatDurationMs(diff)
  }, [schedule])

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <div className="flex flex-col gap-2">
        <div className="text-gray-800">
          Total Sleep Today: <span className="font-semibold">{formatDurationMs(totalSleepMs)}</span>
        </div>
        <div className="text-gray-800">
          Next Nap In: <span className="font-semibold">{nextNapText}</span>
        </div>
      </div>
    </div>
  )
}


