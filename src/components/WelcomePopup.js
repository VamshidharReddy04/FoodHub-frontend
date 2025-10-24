import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WelcomePopup({ visible = true, onClose = () => {} }) {
  const navigate = useNavigate();

  // do not auto-show if user explicitly dismissed or has logged in
  const seen = typeof window !== 'undefined' && (localStorage.getItem('welcomeSeen') || localStorage.getItem('userToken'));
  if (!visible || seen) return null;

  const openLogin = () => {
    localStorage.setItem('welcomeSeen', '1');
    onClose();
    navigate('/login');
  };
  const openSignUp = () => {
    localStorage.setItem('welcomeSeen', '1');
    onClose();
    navigate('/createuser');
  };
  const dismiss = () => {
    localStorage.setItem('welcomeSeen', '1');
    onClose();
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: 'fixed', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.65))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 20
      }}
    >
      <div style={{ width: 720, maxWidth: '96%', borderRadius: 12, overflow: 'hidden', display: 'flex', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ flex: 1, background: 'linear-gradient(135deg,#ffb4a2,#e63946)', padding: 24, color: '#fff' }}>
          <h1 style={{ margin: 0, fontSize: 30 }}>FoodHub</h1>
          <p style={{ marginTop: 8, fontSize: 14, opacity: 0.95 }}>Fast. Fresh. Friendly.</p>
          <p style={{ marginTop: 12, fontSize: 13, lineHeight: 1.4 }}>
            Order mouth-watering meals, track delivery progress in real time and confirm receipt when delivered.
          </p>
          <ul style={{ marginTop: 12, paddingLeft: 18 }}>
            <li>Wide menu — local favourites & chef specials</li>
            <li>Easy checkout — COD or Online</li>
            <li>Delivery progress & confirmation</li>
          </ul>
        </div>

        <div style={{ flex: 1, background: '#fff', padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 style={{ margin: 0, color: '#e63946' }}>Welcome</h2>
              <div style={{ marginTop: 6, color: '#444' }}>Sign in to continue or create an account for faster checkout.</div>
            </div>
            <button onClick={dismiss} className="btn btn-link text-muted" style={{ border: 'none' }}>✕</button>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={openLogin} style={{ minWidth: 130 }}>Login</button>
            <button className="btn btn-outline-primary" onClick={openSignUp} style={{ minWidth: 160 }}>Create Account</button>
            <button className="btn btn-link text-muted" onClick={dismiss} style={{ marginLeft: 'auto' }}>Continue as guest</button>
          </div>

          <div style={{ marginTop: 14, fontSize: 12, color: '#777' }}>
            Note: after signup/login this popup will not show automatically on Home.
          </div>
        </div>
      </div>
    </div>
  );
}