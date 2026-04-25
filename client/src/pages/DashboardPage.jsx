import { useEffect, useRef, useState } from 'react'
import { ref, onValue, get, push, set } from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../firebase'

import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import ECGCard from '../components/ECGCard'

function DashboardPage({ setActivePage }) {
  const lastSavedTimestamp = useRef(null)

  const [assignedDevice, setAssignedDevice] = useState('')
  const [currentData, setCurrentData] = useState({
    heartRate: 0,
    respiratoryRate: 0,
    lungSound: 'No Data',
    ecgSamples: [],
    timestamp: null,
  })

  useEffect(() => {
    let unsubscribeDeviceData = null

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setActivePage('login')
        return
      }

      try {
        const userRef = ref(db, `amuma/users/${user.uid}`)
        const userSnap = await get(userRef)

        if (!userSnap.exists()) {
          console.log('User data not found.')
          return
        }

        const userData = userSnap.val()
        const deviceId = userData.assignedDevice

        if (!deviceId) {
          console.log('No assigned device found.')
          return
        }

        setAssignedDevice(deviceId)

        const currentReadingsRef = ref(
          db,
          `amuma/devices/${deviceId}/currentReadings`
        )

        unsubscribeDeviceData = onValue(currentReadingsRef, async (snapshot) => {
          const data = snapshot.val()

          if (!data) return

          const formattedData = {
            deviceId,
            heartRate: data.heartRate ?? 0,
            respiratoryRate: data.respiratoryRate ?? 0,
            lungSound: data.lungSound ?? 'No Data',
            ecgSamples: Array.isArray(data.ecgSamples)
              ? data.ecgSamples
              : Object.values(data.ecgSamples ?? {}),
            timestamp: data.timestamp ?? new Date().toISOString(),
          }

          setCurrentData(formattedData)

          if (formattedData.timestamp !== lastSavedTimestamp.current) {
            lastSavedTimestamp.current = formattedData.timestamp

            const historyRef = push(ref(db, `amuma/users/${user.uid}/history`))

            await set(historyRef, {
              ...formattedData,
              savedAt: new Date().toISOString(),
            })
          }
        })
      } catch (error) {
        console.error('Dashboard data error:', error)
      }
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeDeviceData) unsubscribeDeviceData()
    }
  }, [setActivePage])

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
        <Topbar assignedDevice={assignedDevice} />

        {/* CLEAN STATS */}
        <section className="stats-grid">
          <StatCard
            type="heart"
            title="Heart Rate"
            value={currentData.heartRate || '--'}
            unit="BPM"
            subtitle="Live"
            status={getHeartStatus(currentData.heartRate)}
            bigStatus={getHeartStatus(currentData.heartRate)}
          />

          <StatCard
            type="lungs"
            title="Lungs"
            value={getLungStatusText(currentData.lungSound)}
            subtitle="Analysis"
            status={getLungStatusText(currentData.lungSound)}
            bigStatus={getLungStatusText(currentData.lungSound)}
          />

          <StatCard
            type="respiration"
            title="Respiration"
            value={currentData.respiratoryRate || '--'}
            unit="BrPM"
            subtitle="Live"
            status={getRespirationStatus(currentData.respiratoryRate)}
            bigStatus={getRespirationStatus(currentData.respiratoryRate)}
          />
        </section>

        {/* ECG */}
        <ECGCard
          ecgSamples={currentData.ecgSamples}
          heartRate={currentData.heartRate}
        />
      </main>
    </div>
  )
}

export default DashboardPage