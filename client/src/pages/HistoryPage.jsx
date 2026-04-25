import { useEffect, useMemo, useState } from 'react'
import { ref, onValue, remove } from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import { db, auth } from '../firebase'
import Sidebar from '../components/Sidebar'

function HistoryPage({ setActivePage }) {
  const [historyData, setHistoryData] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'No timestamp'

    const date = new Date(timestamp)

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString()
    }

    return String(timestamp)
  }

  useEffect(() => {
    let unsubscribeHistory = null

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCurrentUser(null)
        setHistoryData([])
        return
      }

      setCurrentUser(user)

      const historyRef = ref(db, `amuma/users/${user.uid}/history`)

      unsubscribeHistory = onValue(historyRef, (snapshot) => {
        const data = snapshot.val()

        if (!data) {
          setHistoryData([])
          return
        }

        const formatted = Object.entries(data).map(([key, value]) => {
          const displayTime = value.timestamp || value.savedAt || null

          return {
            id: key,
            deviceId: value.deviceId ?? 'No Device',
            time: formatTimestamp(displayTime),
            rawTimestamp: new Date(displayTime).getTime() || 0,
            heartRate: value.heartRate ?? 0,
            respiration: value.respiratoryRate ?? 0,
            lungs: value.lungSound ?? 'No Data',
            ecgSamples: Array.isArray(value.ecgSamples)
              ? value.ecgSamples.join(', ')
              : Object.values(value.ecgSamples ?? {}).join(', '),
          }
        })

        formatted.sort((a, b) => b.rawTimestamp - a.rawTimestamp)
        setHistoryData(formatted)
      })
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeHistory) unsubscribeHistory()
    }
  }, [])

  const averageHeartRate = useMemo(() => {
    if (historyData.length === 0) return 0
    const total = historyData.reduce((sum, item) => sum + item.heartRate, 0)
    return Math.round(total / historyData.length)
  }, [historyData])

  const averageRespiration = useMemo(() => {
    if (historyData.length === 0) return 0
    const total = historyData.reduce((sum, item) => sum + item.respiration, 0)
    return Math.round(total / historyData.length)
  }, [historyData])

  const handleExportExcel = () => {
    if (historyData.length === 0) {
      alert('No history data to export.')
      return
    }

    const excelData = historyData.map((item, index) => ({
      'No.': index + 1,
      'Record ID': item.id,
      Device: item.deviceId,
      Time: item.time,
      'Heart Rate (BPM)': item.heartRate,
      'Respiration (BrPM)': item.respiration,
      Lungs: item.lungs,
      'ECG Samples': item.ecgSamples,
    }))

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Health History')

    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 24 },
      { wch: 16 },
      { wch: 24 },
      { wch: 18 },
      { wch: 22 },
      { wch: 20 },
      { wch: 60 },
    ]

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const fileData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    const now = new Date()
    const fileName = `amuma_user_history_${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`

    saveAs(fileData, fileName)
  }

  const handleDeleteAllHistory = async () => {
    if (historyData.length === 0) {
      alert('No history data to delete.')
      return
    }

    if (!currentUser) {
      alert('No logged-in user found.')
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete all your history data? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      setIsDeleting(true)

      const historyRef = ref(db, `amuma/users/${currentUser.uid}/history`)
      await remove(historyRef)

      alert('All history data has been deleted successfully.')
    } catch (error) {
      console.error('Delete history error:', error)
      alert('Failed to delete history data.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar activePage="history" setActivePage={setActivePage} />

      <main className="main-content">
        <section className="history-page">
          <div className="history-top history-top-row">
            <h1>Health History</h1>

            <div className="history-actions">
              <button className="export-btn" onClick={handleExportExcel}>
                Export Excel
              </button>

              <button
                className="delete-history-btn"
                onClick={handleDeleteAllHistory}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete All History'}
              </button>
            </div>
          </div>

          <div className="history-divider"></div>

          <section className="history-summary-card">
            <div className="history-summary-grid">
              <div className="history-summary-item">
                <div className="history-summary-icon soft-red-bg">🧾</div>
                <div>
                  <p>Total Records</p>
                  <h3>
                    {historyData.length} <span>Entries</span>
                  </h3>
                </div>
              </div>

              <div className="history-summary-item">
                <div className="history-summary-icon soft-heart-bg">❤</div>
                <div>
                  <p>Average Heart Rate</p>
                  <h3>
                    {averageHeartRate} <span>BPM</span>
                  </h3>
                </div>
              </div>

              <div className="history-summary-item">
                <div className="history-summary-icon soft-blue-bg">🫁</div>
                <div>
                  <p>Average Respiration</p>
                  <h3>
                    {averageRespiration} <span>BrPM</span>
                  </h3>
                </div>
              </div>
            </div>
          </section>

          <section className="history-table-card">
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Device</th>
                    <th>Heart Rate</th>
                    <th>Respiration</th>
                    <th>Lungs</th>
                  </tr>
                </thead>

                <tbody>
                  {historyData.length > 0 ? (
                    historyData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.time}</td>
                        <td>{item.deviceId}</td>
                        <td>{item.heartRate} BPM</td>
                        <td>{item.respiration} BrPM</td>
                        <td>{item.lungs}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: 'center', padding: '30px' }}
                      >
                        No history data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </main>
    </div>
  )
}

export default HistoryPage