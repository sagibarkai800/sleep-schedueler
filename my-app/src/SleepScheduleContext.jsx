import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

// SleepScheduleContext provides shared state for baby profile, schedule, nap status and logs
export const SleepScheduleContext = createContext(null)

function getAgeInMonths(birthdate) {
  if (!birthdate) return 0
  const birth = new Date(birthdate)
  const now = new Date()
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  // Adjust if current day in month is before birth day
  if (now.getDate() < birth.getDate()) months -= 1
  return Math.max(0, months)
}

function getWakeWindowMs(ageMonths) {
  // Approximate wake windows by age range (converted to ms)
  // Sources discuss ranges; we pick a mid-point per band
  let minutes
  if (ageMonths <= 2) minutes = 75 // 1.25h
  else if (ageMonths <= 4) minutes = 105 // 1.75h
  else if (ageMonths <= 7) minutes = 150 // 2.5h (5–7 mo ~2–3h)
  else if (ageMonths <= 10) minutes = 210 // 3.5h
  else if (ageMonths <= 14) minutes = 225 // 3.75h
  else if (ageMonths <= 18) minutes = 270 // 4.5h
  else minutes = 300 // 5h for older toddlers (coarse default)
  return minutes * 60 * 1000
}

function addMs(date, ms) {
  return new Date(date.getTime() + ms)
}

function generateSchedule({ birthdate, napsCount, startFrom, defaultNapDurationMs = 60 * 60 * 1000 }) {
  const ageMonths = getAgeInMonths(birthdate)
  const wakeWindowMs = getWakeWindowMs(ageMonths)
  const schedule = []

  let cursor = new Date(startFrom ?? Date.now())

  for (let i = 0; i < Math.max(0, Number(napsCount || 0)); i += 1) {
    const napStart = addMs(cursor, wakeWindowMs)
    schedule.push(napStart)
    // Assume ~1h nap by default; next wake time is after the nap ends
    cursor = addMs(napStart, defaultNapDurationMs)
  }

  // Bedtime is after the last wake window post-final nap (or from start if no naps)
  const bedtime = addMs(cursor, wakeWindowMs)
  schedule.push(bedtime)

  return schedule
}

export function SleepScheduleProvider({ children }) {
  const [babyProfile, setBabyProfileState] = useState(null) // { name, birthdate, napsCount }
  const [schedule, setSchedule] = useState([]) // Dates; includes bedtime as the last element
  const [isNapping, setIsNapping] = useState(false)
  const [napLogs, setNapLogs] = useState([]) // [{ start: Date, end: Date }]
  const [currentNapStart, setCurrentNapStart] = useState(null)

  const remainingNaps = useMemo(() => {
    if (!babyProfile) return 0
    const completed = napLogs.length
    const total = Number(babyProfile.napsCount || 0)
    return Math.max(0, total - completed)
  }, [babyProfile, napLogs])

  const setBabyProfile = useCallback((profile, options = {}) => {
    const normalized = {
      name: profile?.name ?? '',
      birthdate: profile?.birthdate ? new Date(profile.birthdate) : null,
      napsCount: Number(profile?.napsCount ?? 0),
    }
    setBabyProfileState(normalized)

    const startFrom = options.wakeTime ? new Date(options.wakeTime) : new Date()
    const initialSchedule = generateSchedule({
      birthdate: normalized.birthdate,
      napsCount: normalized.napsCount,
      startFrom,
    })
    setSchedule(initialSchedule)
    setIsNapping(false)
    setNapLogs([])
    setCurrentNapStart(null)
  }, [])

  const startNap = useCallback((startTime = new Date()) => {
    setIsNapping(true)
    setCurrentNapStart(new Date(startTime))
  }, [])

  const endNap = useCallback((endTime = new Date()) => {
    setIsNapping(false)
    setNapLogs(prev => {
      if (!currentNapStart) return prev
      const entry = { start: new Date(currentNapStart), end: new Date(endTime) }
      return [...prev, entry]
    })
    setCurrentNapStart(null)

    // Remove the next upcoming nap from schedule (first element) if it exists (bedtime stays last)
    setSchedule(prev => {
      const next = Array.isArray(prev) ? [...prev] : []
      // next[0..naps-1] are nap starts, next[last] is bedtime
      if (next.length > 0) {
        // Drop the first nap time if it is still in the future
        next.shift()
      }
      return next
    })

    // Recalculate remaining schedule from the end of the nap
    setSchedule(prev => {
      if (!babyProfile) return prev

      const total = Number(babyProfile.napsCount || 0)
      const completed = (napLogs?.length || 0) + 1 // include the nap we just ended
      const remaining = Math.max(0, total - completed)

      const recalculated = generateSchedule({
        birthdate: babyProfile.birthdate,
        napsCount: remaining,
        startFrom: new Date(endTime),
      })
      return recalculated
    })
  }, [babyProfile, currentNapStart, napLogs])

  const adjustSchedule = useCallback((dates) => {
    const normalized = (dates || []).map(d => new Date(d))
    setSchedule(normalized)
  }, [])

  const value = useMemo(() => {
    const bedtime = schedule.length > 0 ? schedule[schedule.length - 1] : null
    return {
      // state
      babyProfile,
      schedule, // includes bedtime as last entry
      bedtime,
      isNapping,
      napLogs,
      // actions
      setBabyProfile,
      startNap,
      endNap,
      adjustSchedule,
      // derived
      remainingNaps,
    }
  }, [adjustSchedule, babyProfile, endNap, isNapping, napLogs, remainingNaps, schedule, setBabyProfile, startNap])

  return (
    <SleepScheduleContext.Provider value={value}>
      {children}
    </SleepScheduleContext.Provider>
  )
}

export function useSleepSchedule() {
  const ctx = useContext(SleepScheduleContext)
  if (!ctx) {
    throw new Error('useSleepSchedule must be used within a SleepScheduleProvider')
  }
  return ctx
}


