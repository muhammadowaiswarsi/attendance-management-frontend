const DeleteDepartmentModal = ({
  open,
  department,
  deleting,
  onConfirm,
  onCancel,
}) => {
  if (!open || !department) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <h3>Delete Department</h3>
        <p>Are you sure you want to delete this department?</p>
        <p className="confirm-dialog__meta">
          <strong>{department.name}</strong>
          {department.totalEmployees > 0 && (
            <span>
              {' '}
              — This department has {department.totalEmployees} employee
              {department.totalEmployees === 1 ? '' : 's'} assigned.
            </span>
          )}
        </p>
        <div className="confirm-dialog__actions">
          <button type="button" className="btn btn--outline" onClick={onCancel} disabled={deleting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteDepartmentModal
