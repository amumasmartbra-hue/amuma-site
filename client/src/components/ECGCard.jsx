import { useMemo } from 'react'

function ECGCard({ ecgSamples = [], heartRate = 0 }) {
  const width = 1200
  const height = 220
  const padding = 16
  const maxVisibleSamples = 120

  const numericSamples = useMemo(() => {
    const normalized = Array.isArray(ecgSamples)
      ? ecgSamples
      : Object.values(ecgSamples ?? {})

    const clean = normalized
      .map((value) => Number(value))
      .filter((value) => !Number.isNaN(value))

    return clean.slice(-maxVisibleSamples)
  }, [ecgSamples])

  const smoothedSamples = useMemo(() => {
    if (numericSamples.length === 0) return []

    return numericSamples.map((_, index, arr) => {
      const prev = arr[index - 1] ?? arr[index]
      const curr = arr[index]
      const next = arr[index + 1] ?? arr[index]
      return (prev + curr + next) / 3
    })
  }, [numericSamples])

  const ecgPath = useMemo(() => {
    if (smoothedSamples.length < 2) {
      return `M 0 ${height / 2} L ${width} ${height / 2}`
    }

    const minValue = Math.min(...smoothedSamples)
    const maxValue = Math.max(...smoothedSamples)
    const range = maxValue - minValue || 1

    const usableWidth = width - padding * 2
    const usableHeight = height - padding * 2

    const points = smoothedSamples.map((sample, index) => {
      const x = padding + (index / (smoothedSamples.length - 1)) * usableWidth
      const normalized = (sample - minValue) / range
      const y = padding + (1 - normalized) * usableHeight
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })

    return points.join(' ')
  }, [smoothedSamples])

  return (
    <section className="ecg-card">
      <div className="ecg-header">
        <div>
          <h2>Electrocardiogram (ECG)</h2>
          <p>Real-time heart activity</p>
        </div>

        <div className="ecg-live-badge">
          <span>Live reading</span>
          <span className="ecg-dot">•</span>
          <span>{heartRate > 0 ? 'Connected' : 'Waiting'}</span>
        </div>
      </div>

      <div className="ecg-graph-wrapper">
        <div className="ecg-grid"></div>

        <svg
          className="ecg-svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <path className="ecg-line ecg-line-animated" d={ecgPath} />
        </svg>

        <div className="ecg-scan-line"></div>
      </div>

      <div className="ecg-footer">
        <div className="ecg-bpm">
          <span className="ecg-bpm-value">{heartRate}</span>
          <span className="ecg-bpm-unit">BPM</span>
        </div>

        <div className="ecg-status-pill">
          <span>{heartRate > 0 ? 'Normal' : 'Waiting'}</span>
          <span className="ecg-status-arrow">›</span>
        </div>
      </div>
    </section>
  )
}

export default ECGCard