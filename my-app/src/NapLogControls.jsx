import React, { useContext } from 'react'
import { SleepScheduleContext } from './SleepScheduleContext.jsx'

export default function NapLogControls() {
  const { isNapping, startNap, endNap } = useContext(SleepScheduleContext)

  const baseBtn = 'w-full text-xl font-semibold py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2'

  if (isNapping) {
    return (
      <button
        type="button"
        className={`${baseBtn} bg-red-500 text-white focus:ring-red-600`}
        onClick={() => endNap()}
      >
        End Nap
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`${baseBtn} bg-green-500 text-white focus:ring-green-600`}
      onClick={() => startNap()}
    >
      Start Nap
    </button>
  )
}


