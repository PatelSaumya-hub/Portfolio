import React, { useState } from 'react';
import { loginUser, registerUser, verify2FA, updateProfilePic } from '../api';

const AuthModal = ({ isOpen, onClose, user, onLoginSuccess, onLogout, addToast }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState(user ? 'profile' : 'login'); // 'login' | 'register' | '2fa' | 'profile'
  const [formData, setFormData] = useState({
    identifier: '',
    username: '',
    email: '',
    password: '',
    profilePic: ''
  });

  // 2FA state
  const [twoFactorPayload, setTwoFactorPayload] = useState(null); // { userId, username, hintCode }
  const [securityCode, setSecurityCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Handle Login Step 1
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await loginUser({
        identifier: formData.identifier,
        password: formData.password
      });

      if (res.requires2FA) {
        setTwoFactorPayload({
          userId: res.userId,
          username: res.username,
          hintCode: res.hintCode || '123456'
        });
        setMode('2fa');
        addToast('Password accepted. 2-Step Verification required.', 'info', 'Step 1 Complete');
      }
    } catch (err) {
      setErrorMsg(err.message);
      addToast(err.message, 'danger', 'Login Error');
    } finally {
      setLoading(false);
    }
  };

  // Handle 2FA Verification Step 2
  const handle2FAVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await verify2FA(twoFactorPayload.userId, securityCode);
      onLoginSuccess(res.user);
      addToast(`Welcome back, ${res.user.username}! 2FA verified.`, 'success', 'Authenticated');
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
      addToast(err.message, 'danger', '2FA Failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        profilePic: formData.profilePic
      });

      addToast(res.message, 'success', 'Account Created');
      setMode('login');
      setFormData({ ...formData, identifier: formData.username });
    } catch (err) {
      setErrorMsg(err.message);
      addToast(err.message, 'danger', 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Profile Picture Update
  const handleProfilePicSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await updateProfilePic(user._id, formData.profilePic);
      onLoginSuccess(res.user);
      addToast('Profile picture updated successfully!', 'success', 'Avatar Changed');
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
      addToast(err.message, 'danger', 'Update Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        {/* Modal Header & Tabs */}
        {!user && mode !== '2fa' && (
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setErrorMsg(null); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setErrorMsg(null); }}
            >
              Register Account
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="validation-error-alert">
            {errorMsg}
          </div>
        )}

        {/* MODE: LOGIN STEP 1 */}
        {mode === 'login' && !user && (
          <form onSubmit={handleLoginSubmit} className="task-form">
            <h3 className="modal-title">Welcome Back</h3>
            <p className="modal-subtitle">Log in to track task actions and system audit logs.</p>

            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <input
                type="text"
                required
                placeholder="e.g. saumya or saumya@example.com"
                value={formData.identifier}
                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                {loading ? 'Verifying...' : 'Next: 2-Step Auth →'}
              </button>
            </div>
          </form>
        )}

        {/* MODE: 2FA STEP 2 */}
        {mode === '2fa' && (
          <form onSubmit={handle2FAVerifySubmit} className="task-form">
            <div className="twofa-icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>

            <h3 className="modal-title">2-Step Authentication</h3>
            <p className="modal-subtitle">
              Enter the 6-digit security code for <strong>{twoFactorPayload?.username}</strong>.
            </p>

            <div className="twofa-hint-box">
              <span>Demo Security Code: <strong>{twoFactorPayload?.hintCode || '123456'}</strong></span>
            </div>

            <div className="form-group">
              <label className="form-label">6-Digit Code</label>
              <input
                type="text"
                maxLength="6"
                required
                placeholder="123456"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                className="form-input security-code-input"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setMode('login')}
              >
                ← Back
              </button>
              <button type="submit" disabled={loading} className="btn btn-success flex-1">
                {loading ? 'Authenticating...' : 'Verify & Log In'}
              </button>
            </div>
          </form>
        )}

        {/* MODE: REGISTER */}
        {mode === 'register' && !user && (
          <form onSubmit={handleRegisterSubmit} className="task-form">
            <h3 className="modal-title">Create User Account</h3>
            <p className="modal-subtitle">Register to enable 2FA and record personal audit logs.</p>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                required
                placeholder="e.g. saumya_patel"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                placeholder="saumya@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                placeholder="Create password..."
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Picture Avatar URL (Optional)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.profilePic}
                onChange={(e) => setFormData({ ...formData, profilePic: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                {loading ? 'Creating Account...' : 'Register Account'}
              </button>
            </div>
          </form>
        )}

        {/* MODE: LOGGED IN USER PROFILE & AVATAR CHANGE */}
        {user && (
          <div className="profile-modal-content">
            <div className="profile-header-card">
              <img src={user.profilePic} alt={user.username} className="profile-avatar-lg" />
              <div>
                <h3 className="profile-username">{user.username}</h3>
                <span className="profile-email">{user.email}</span>
                <div className="twofa-status-badge">
                  <span className="dot-active"></span> 2-Step Auth Enabled
                </div>
              </div>
            </div>

            <form onSubmit={handleProfilePicSubmit} className="task-form mt-4">
              <h4>Update Profile Picture Avatar</h4>
              <p className="form-hint">
                Updating your avatar creates a "PROFILE_PIC_UPDATE" entry in audit logs.
              </p>

              <div className="form-group">
                <label className="form-label">Avatar Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.profilePic || user.profilePic}
                  onChange={(e) => setFormData({ ...formData, profilePic: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => { onLogout(); onClose(); }}
                >
                  Log Out
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  Save New Profile Pic
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
