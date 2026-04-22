import { useEffect, useState } from 'react'
import { ref, onValue } from 'firebase/database'
import { db } from '../firebase'

import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import InfoCard from '../components/InfoCard'
import ECGCard from '../components/ECGCard'

function DashboardPage({ setActivePage }) {
  const [currentData, setCurrentData] = useState({
    heartRate: 0,
    respiratoryRate: 0,
    lungSound: 'No Data',
    ecgSamples: [],
    timestamp: null,
  })

  useEffect(() => {
    const currentReadingsRef = ref(db, 'amuma/currentReadings')

    const unsubscribe = onValue(currentReadingsRef, (snapshot) => {
      const data = snapshot.val()

      if (data) {
        setCurrentData({
          heartRate: data.heartRate ?? 0,
          respiratoryRate: data.respiratoryRate ?? 0,
          lungSound: data.lungSound ?? 'No Data',
          ecgSamples: Array.isArray(data.ecgSamples)
            ? data.ecgSamples
            : Object.values(data.ecgSamples ?? {}),
          timestamp: data.timestamp ?? null,
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const getLungStatusText = (lungSound) => {
    if (!lungSound) return 'No Data'
    return lungSound
  }

  const getRespirationStatus = (rate) => {
    if (rate <= 0) return 'No Data'
    if (rate >= 12 && rate <= 20) return 'Stable'
    return 'Monitor'
  }

  const getHeartStatus = (rate) => {
    if (rate <= 0) return 'No Data'
    if (rate >= 60 && rate <= 100) return 'Normal'
    return 'Monitor'
  }

  return (
    <div className="app-shell">
      <Sidebar activePage="dashboard" setActivePage={setActivePage} />

      <main className="main-content">
        <Topbar />

        <section className="stats-grid">
          <StatCard
            type="heart"
            title="Heart Rate"
            value={String(currentData.heartRate)}
            unit="BPM"
            subtitle="Live heartbeat reading"
            status={getHeartStatus(currentData.heartRate)}
            bottomLeft={`${currentData.heartRate} BPM`}
            bigStatus={getHeartStatus(currentData.heartRate)}
          />

          <StatCard
            type="lungs"
            title="Lungs"
            value={getLungStatusText(currentData.lungSound)}
            unit=""
            subtitle="Breathing sound analysis"
            status={getLungStatusText(currentData.lungSound)}
            bottomLeft={`${currentData.ecgSamples?.length || 0}`}
            bigStatus="Normal"
          />

          <StatCard
            type="respiration"
            title="Respiration"
            value={String(currentData.respiratoryRate)}
            unit="BrPM"
            subtitle="Live respiration reading"
            status={getRespirationStatus(currentData.respiratoryRate)}
            bottomLeft={`${currentData.respiratoryRate} BrPM`}
            bigStatus={getRespirationStatus(currentData.respiratoryRate)}
          />
        </section>

        <ECGCard ecgSamples={currentData.ecgSamples} heartRate={currentData.heartRate} />
      </main>
    </div>
  )
}

export default DashboardPage