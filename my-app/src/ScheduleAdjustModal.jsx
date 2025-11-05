import React, { useContext, useEffect, useMemo, useState } from 'react'
import { SleepScheduleContext } from './SleepScheduleContext.jsx'

export default function ScheduleAdjustModal({ show, onClose }) {
  const { schedule, adjustSchedule } = useContext(SleepScheduleContext)

  const labels = useMemo(() => {
    const len = Array.isArray(schedule) ? schedule.length : 0
    return Array.from({ length: len }, (_, idx) => (idx === len - 1 ? 'Bedtime' : `Nap ${idx + 1}`))
  }, [schedule])

  const [times, setTimes] = useState([]) // ["HH:MM", ...]

  useEffect(() => {
    if (!show) return
    const initial = (schedule || []).map((d) => {
      const date = new Date(d)
      const hh = String(date.getHours()).padStart(2, '0')
      const mm = String(date.getMinutes()).padStart(2, '0')
      return `${hh}:${mm}`
    })
    setTimes(initial)
  }, [schedule, show])

  if (!show) return null

  function handleChange(idx, value) {
    setTimes((prev) => {
      const next = [...prev]
      next[idx] = value
      return next
    })
  }

  function handleCancel() {
    onClose && onClose()
  }

  function handleSave() {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const day = today.getDate()
    const updated = (times || []).map((t) => {
      const [hStr, mStr] = String(t || '00:00').split(':')
      const h = Number(hStr)
      const m = Number(mStr)
      const d = new Date(year, month, day, h, m, 0, 0)
      return d
    })
    adjustSchedule(updated)
    onClose && onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="adjust-schedule-title"
      >
        <h2 id="adjust-schedule-title" className="text-lg font-semibold mb-4">Adjust Today's Schedule</h2>

        <div className="flex flex-col gap-4">
          {(times || []).map((t, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3">
              <label className="text-gray-800 min-w-24">{labels[idx] || `Item ${idx + 1}`}</label>
              <input
                type="time"
                className="p-2 border border-gray-300 rounded w-36"
                value={t ?? ''}
                onChange={(e) => handleChange(idx, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded border border-gray-300 text-gray-800"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-blue-500 text-white font-semibold"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}


