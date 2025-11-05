import React, { useContext, useState } from 'react'
import './App.css'
import { SleepScheduleContext } from './SleepScheduleContext.jsx'
import BabyProfileForm from './BabyProfileForm.jsx'
import DailyScheduleView from './DailyScheduleView.jsx'
import NapLogControls from './NapLogControls.jsx'
import ScheduleAdjustModal from './ScheduleAdjustModal.jsx'
import InsightsCard from './InsightsCard.jsx'

function App() {
  const { babyProfile } = useContext(SleepScheduleContext)
  const [showAdjustModal, setShowAdjustModal] = useState(false)

  if (!babyProfile) {
    return <BabyProfileForm />
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="md:flex md:space-x-4 md:items-start">
        <div className="md:flex-1 mb-4 md:mb-0">
          <InsightsCard />
        </div>
        <div className="md:flex-1">
          <DailyScheduleView />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <NapLogControls />
        <button
          type="button"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg"
          onClick={() => setShowAdjustModal(true)}
        >
          Adjust Schedule
        </button>
      </div>

      <ScheduleAdjustModal
        show={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
      />
    </div>
  )
}

export default App
