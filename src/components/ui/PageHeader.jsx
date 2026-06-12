const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className={`page-header ${actions ? 'page-header--with-actions' : ''}`}>
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </div>
  )
}

export default PageHeader
