import { useState } from 'react'
import { changePassword, getProfile, updateProfile } from '../api/profile'
import ChangePasswordModal from '../components/profile/ChangePasswordModal'
import EditProfileModal from '../components/profile/EditProfileModal'
import ProfileCard from '../components/profile/ProfileCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import PageHeader from '../components/ui/PageHeader'
import { useToast } from '../context/ToastContext'
import useCachedResource from '../hooks/useCachedResource'
import { CACHE_KEYS, invalidateAfterProfileChange } from '../utils/pageCache'

const Profile = () => {
  const { showToast } = useToast()
  const [editOpen, setEditOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const { data: profile, loading, setCached } = useCachedResource(
    CACHE_KEYS.profile,
    async () => {
      try {
        return await getProfile()
      } catch {
        showToast('Failed to load profile', 'error')
        throw new Error('Failed to load profile')
      }
    }
  )

  const handleProfileUpdate = async (form) => {
    setSavingProfile(true)
    try {
      const data = await updateProfile(form)
      setCached(data)
      invalidateAfterProfileChange()
      setEditOpen(false)
      showToast('Profile updated successfully')
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to update profile'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordChange = async (form, onSuccess) => {
    setChangingPassword(true)
    try {
      await changePassword(form)
      onSuccess()
      showToast('Password changed successfully')
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to change password'
      showToast(typeof message === 'string' ? message : 'Something went wrong', 'error')
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullPage />
  }

  return (
    <div className="profile-page">
      <PageHeader
        title="Profile"
        subtitle="Manage your personal and account information"
        actions={
          <div className="profile-page__actions">
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => setPasswordOpen(true)}
            >
              Update Password
            </button>
            <button type="button" className="btn btn--primary" onClick={() => setEditOpen(true)}>
              Edit Profile
            </button>
          </div>
        }
      />

      <ProfileCard profile={profile} />

      <EditProfileModal
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSubmit={handleProfileUpdate}
        submitting={savingProfile}
      />

      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => !changingPassword && setPasswordOpen(false)}
        onSubmit={handlePasswordChange}
        submitting={changingPassword}
      />
    </div>
  )
}

export default Profile
