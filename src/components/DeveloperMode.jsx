import { useState } from 'react';
import './DeveloperMode.css';

export default function DeveloperMode() {
  const [isDevMode, setIsDevMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleOpenModal = () => {
    setShowPasswordModal(true);
    setPassword('');
    setError('');
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setError('');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = process.env.REACT_APP_DEV_PASSWORD;
    
    if (password === correctPassword) {
      setIsDevMode(true);
      setShowPasswordModal(false);
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleExitDevMode = () => {
    setIsDevMode(false);
  };

  return (
    <>
      {/* Developer Mode Button */}
      <div className="dev-mode-button">
        {!isDevMode ? (
          <button onClick={handleOpenModal} className="dev-btn" title="Developer Mode">
            🔧
          </button>
        ) : (
          <button onClick={handleExitDevMode} className="dev-btn active" title="Exit Developer Mode">
            ✓ DEV
          </button>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="dev-modal-overlay" onClick={handleCloseModal}>
          <div className="dev-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Enter Developer Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="dev-password-input"
              />
              {error && <p className="dev-error">{error}</p>}
              <div className="dev-modal-buttons">
                <button type="submit" className="dev-submit-btn">
                  Enter
                </button>
                <button type="button" onClick={handleCloseModal} className="dev-cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Developer Mode Indicator (when active) */}
      {isDevMode && (
        <div className="dev-mode-indicator">
          Developer Mode Active
        </div>
      )}
    </>
  );
}
