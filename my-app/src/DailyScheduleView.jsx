import React, { useContext, useMemo } from 'react'
import { SleepScheduleContext } from './SleepScheduleContext.jsx'

export default function DailyScheduleView() {
  const { babyProfile, schedule } = useContext(SleepScheduleContext)

  const items = useMemo(() => {
    const dates = (schedule || []).map(d => new Date(d))
    return dates.map((date, idx) => {
      const isLast = idx === dates.length - 1
      const label = isLast ? 'Bedtime' : `Nap ${idx + 1}`
      const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      return { label, time, key: `${label}-${date.getTime()}` }
    })
  }, [schedule])

  if (!babyProfile || !babyProfile.name || !schedule || schedule.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl md:text-2xl font-semibold">Today's Schedule</h2>
        <p className="text-gray-600 mt-2">No schedule yet. Add a profile to generate one.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-xl md:text-2xl font-semibold mb-3">{`Today's Schedule for ${babyProfile.name}`}</h2>
      <div className="divide-y divide-gray-300 rounded-md border border-gray-200 overflow-hidden">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-3">
            <span className="text-gray-800 md:text-lg">{item.label}</span>
            <time className="text-gray-700 font-medium md:text-lg">{item.time}</time>
          </div>
        ))}
      </div>
    </div>
  )
}


