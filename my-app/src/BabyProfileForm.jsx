import React, { useContext, useState } from 'react'
import { SleepScheduleContext } from './SleepScheduleContext.jsx'

export default function BabyProfileForm() {
  const { setBabyProfile } = useContext(SleepScheduleContext)

  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('') // YYYY-MM-DD
  const [napsCount, setNapsCount] = useState(3)

  function handleSubmit(e) {
    e.preventDefault()
    setBabyProfile({ name, birthdate, napsCount: Number(napsCount) })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="baby-name" className="text-sm font-medium text-gray-800">Baby Name</label>
        <input
          id="baby-name"
          type="text"
          className="p-2 border border-gray-300 rounded"
          placeholder="e.g., Ava"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="baby-birthdate" className="text-sm font-medium text-gray-800">Birthdate</label>
        <input
          id="baby-birthdate"
          type="date"
          className="p-2 border border-gray-300 rounded"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="baby-naps" className="text-sm font-medium text-gray-800">Number of Naps</label>
        <select
          id="baby-naps"
          className="p-2 border border-gray-300 rounded"
          value={napsCount}
          onChange={(e) => setNapsCount(Number(e.target.value))}
        >
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white text-lg font-semibold py-2 px-4 rounded-lg"
      >
        Save Profile
      </button>
    </form>
  )
}


