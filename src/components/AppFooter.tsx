import React from 'react';
import { IonIcon } from '@ionic/react';
import { logoFacebook, logoTwitter, logoInstagram } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './AppFooter.css';

const links = [
  { label: 'Home', path: '/guest/home' },
  { label: 'About', path: '/about' },
  { label: 'Privacy', path: '/privacy' },
  { label: 'Terms', path: '/terms' },
  { label: 'Contact', path: '/contact' },
];

const AppFooter: React.FC = () => {
  const history = useHistory();

  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div className="app-footer-top">
          <span className="app-footer-brand">E-Hatid</span>
          <div className="app-footer-social">
            <button className="app-footer-social-btn" onClick={() => {}} aria-label="Facebook">
              <IonIcon icon={logoFacebook} />
            </button>
            <button className="app-footer-social-btn" onClick={() => {}} aria-label="Twitter">
              <IonIcon icon={logoTwitter} />
            </button>
            <button className="app-footer-social-btn" onClick={() => {}} aria-label="Instagram">
              <IonIcon icon={logoInstagram} />
            </button>
          </div>
        </div>
        <div className="app-footer-links">
          {links.map(link => (
            <button key={link.label} className="app-footer-link" onClick={() => history.push(link.path)}>
              {link.label}
            </button>
          ))}
        </div>
        <span className="app-footer-copyright">&copy; {new Date().getFullYear()} E-hatid. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default AppFooter;
