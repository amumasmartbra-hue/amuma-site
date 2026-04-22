function InfoCard({ title, icon, arrow = false, children }) {
  return (
    <div className="info-card">
      <div className="info-card-header">
        <div className="info-title-wrap">
          <span className="info-icon">{icon}</span>
          <h3>{title}</h3>
        </div>

        {arrow && <span className="info-arrow">›</span>}
      </div>

      <div className="info-card-body">{children}</div>
    </div>
  )
}

export default InfoCard