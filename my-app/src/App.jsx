import { useMemo, useState } from 'react'
import './App.css'
import { useSleepSchedule } from './SleepScheduleContext.jsx'

function App() {
  const { babyProfile, schedule, bedtime, isNapping, napLogs, setBabyProfile, startNap, endNap, remainingNaps } = useSleepSchedule()
  const [localName, setLocalName] = useState('Ava')
  const [localBirthdate, setLocalBirthdate] = useState('2025-03-01')
  const [localNaps, setLocalNaps] = useState(3)

  const formattedSchedule = useMemo(() => (schedule || []).map(d => new Date(d)), [schedule])

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sleep Schedule Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Name"
          value={localName}
          onChange={e => setLocalName(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          type="date"
          value={localBirthdate}
          onChange={e => setLocalBirthdate(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          type="number"
          min={0}
          max={5}
          value={localNaps}
          onChange={e => setLocalNaps(Number(e.target.value))}
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setBabyProfile({ name: localName, birthdate: localBirthdate, napsCount: localNaps })}
      >
        Set Profile & Generate Schedule
      </button>

      <div className="mt-6 space-y-2">
        <div className="text-sm text-gray-600">Profile: {babyProfile ? `${babyProfile.name}, naps ${babyProfile.napsCount}` : '—'}</div>
        <div className="text-sm">Remaining naps: {remainingNaps}</div>
        <div className="text-sm">Status: {isNapping ? 'Napping' : 'Awake'}</div>
      </div>

      <div className="mt-6 flex gap-2">
        <button className="bg-emerald-600 text-white px-4 py-2 rounded" onClick={() => startNap()}>Start Nap</button>
        <button className="bg-rose-600 text-white px-4 py-2 rounded" onClick={() => endNap()}>End Nap</button>
      </div>

      <div className="mt-8">
        <h2 className="font-semibold mb-2">Upcoming</h2>
        <ul className="list-disc pl-6 space-y-1">
          {formattedSchedule.slice(0, Math.max(0, formattedSchedule.length - 1)).map((d, i) => (
            <li key={i}>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</li>
          ))}
        </ul>
        <div className="mt-2 text-sm text-gray-700">Bedtime: {bedtime ? new Date(bedtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</div>
      </div>

      <div className="mt-8">
        <h2 className="font-semibold mb-2">Nap Logs</h2>
        <ul className="list-disc pl-6 space-y-1">
          {napLogs.map((log, idx) => (
            <li key={idx}>
              {new Date(log.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → {new Date(log.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </li>
          ))}
          {napLogs.length === 0 && <li className="list-none text-gray-500">No naps yet</li>}
        </ul>
      </div>
    </div>
  )
}

export default App
