import React from 'react';
import { IonIcon } from '@ionic/react';
import { carOutline, logoFacebook, logoTwitter, logoInstagram } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const quickLinks = [
  { label: 'Home', path: '/guest/home' },
  { label: 'Browse Stalls', path: '/guest/home' },
  { label: 'Become a Vendor', path: '/vendor/register' },
  { label: 'Become a Rider', path: '/rider/register' },
];

const supportLinks = [
  { label: 'Contact Us', path: '/contact' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Help Center', path: '/help' },
  { label: 'Report an Issue', path: '/report' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
];

const socialLinks = [
  { icon: logoFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: logoTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: logoInstagram, href: 'https://instagram.com', label: 'Instagram' },
];

const AppFooter: React.FC = () => {
  const history = useHistory();

  return (
    <footer className="bg-[var(--tw-card-background)] border-t border-[var(--tw-border-color)] py-8 sm:py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-10">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[var(--ion-color-primary)] flex items-center justify-center shrink-0">
                <IonIcon icon={carOutline} className="text-lg text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-[var(--tw-text-color)]">E-Hatid</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--tw-text-secondary)] leading-relaxed max-w-xs">
              Your favorite food, delivered fast. Order from the best local restaurants and stalls near you.
            </p>
            <div className="flex gap-2 pt-1">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-[var(--tw-light)] hover:bg-[var(--ion-color-primary)]/10 hover:text-[var(--ion-color-primary)] transition-colors flex items-center justify-center text-[var(--tw-text-secondary)]"
                >
                  <IonIcon icon={social.icon} className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-[var(--tw-text-color)]">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => history.push(link.path)}
                    className="text-xs sm:text-sm text-[var(--tw-text-secondary)] hover:text-[var(--ion-color-primary)] transition-colors min-h-[36px] text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-[var(--tw-text-color)]">Support</h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {supportLinks.map(link => (
                <li key={link.label}>
                  <button
                    onClick={() => history.push(link.path)}
                    className="text-xs sm:text-sm text-[var(--tw-text-secondary)] hover:text-[var(--ion-color-primary)] transition-colors min-h-[36px] text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--tw-border-color)] pt-5 sm:pt-6">
          <span className="text-[10px] sm:text-xs text-[var(--tw-text-secondary)] block text-center">
            &copy; {new Date().getFullYear()} E-Hatid. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
