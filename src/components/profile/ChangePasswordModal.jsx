import ChangePasswordForm from './ChangePasswordForm'

const ChangePasswordModal = ({ open, onClose, onSubmit, submitting }) => {
  if (!open) return null

  const handleSubmit = async (form, resetForm) => {
    await onSubmit(form, () => {
      resetForm()
      onClose()
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--sm" onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h2>Update Password</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal__form">
          <ChangePasswordForm onSubmit={handleSubmit} submitting={submitting} />
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordModal
