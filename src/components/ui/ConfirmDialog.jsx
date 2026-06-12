const ConfirmDialog = ({
  open,
  title = 'Confirm action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-dialog__actions">
          <button type="button" className="btn btn--outline" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn btn--${variant === 'danger' ? 'danger' : 'primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
