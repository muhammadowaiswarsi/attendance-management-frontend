const LoadingSpinner = ({ fullPage = false }) => {
  return (
    <div className={`loading-spinner ${fullPage ? 'loading-spinner--full' : ''}`}>
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  )
}

export default LoadingSpinner
