function Topbar({ assignedDevice }) {
  const deviceName =
    assignedDevice === 'device_1'
      ? 'Device 1'
      : assignedDevice === 'device_2'
      ? 'Device 2'
      : 'No Device'

  return (
    <header className="topbar">
      <div>
        <h1>Dashboard</h1>
        <p>Real-time maternal health monitoring</p>
      </div>

      <div className="topbar-right">
        <div className="device-connected">
          <span className="online-dot"></span>
          <span>{deviceName}</span>
          <span className="chevron">›</span>
        </div>

        <div className="date-time">
          {new Date().toLocaleString()}
        </div>
      </div>
    </header>
  )
}

export default Topbar