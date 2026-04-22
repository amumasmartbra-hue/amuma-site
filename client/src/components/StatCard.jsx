function StatCard({
  type,
  title,
  value,
  unit,
  subtitle,
  status,
  bottomLeft,
  bigStatus,
}) {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-top">
        <div className={`stat-icon ${type}`}>
          {type === 'heart' && '❤'}
          {type === 'lungs' && '🫁'}
          {type === 'respiration' && '🫁'}
        </div>

        <div className="stat-heading">
          <h3>{title}</h3>
        </div>

        <span className={`mini-badge ${type}`}>{status}</span>
      </div>

      <div className="stat-body">
        <div className="stat-value-row">
          <span className={`stat-value ${type === 'lungs' ? 'text-only' : ''}`}>
            {value}
          </span>
          {unit && <span className="stat-unit">{unit}</span>}
        </div>

        <p className="stat-subtitle">{subtitle}</p>

        <div className={`graph-placeholder ${type}`}>
          <div className="graph-line"></div>
        </div>
      </div>

      <div className="stat-footer">
        <span className={`footer-reading ${type}`}>{bottomLeft}</span>
        <span className={`footer-pill ${type}`}>{bigStatus}</span>
      </div>
    </div>
  )
}

export default StatCard