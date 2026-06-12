import { useEffect, useState } from 'react'

const emptyForm = {
  phoneNumber: '',
  address: '',
}

const EditProfileModal = ({ open, profile, onClose, onSubmit, submitting }) => {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!open) return
    setForm({
      phoneNumber: profile?.phoneNumber || '',
      address: profile?.address || '',
    })
  }, [open, profile])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  if (!open) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--sm" onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h2>Edit Profile</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <p className="account-profile__hint">
            Email, role, and employee code cannot be changed here.
          </p>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="+92 300 0000000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows={4}
              value={form.address}
              onChange={handleChange}
              placeholder="Street, city, country"
            />
          </div>

          <div className="modal__footer">
            <button type="button" className="btn btn--outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
