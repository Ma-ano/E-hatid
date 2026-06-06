// src/components/Stall/MenuItem.tsx
import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { add, flame, checkmarkCircle } from 'ionicons/icons';
import { MenuItem as MenuItemType } from '../../types';
import './MenuItem.css';

interface MenuItemProps {
  item: MenuItemType;
  onAdd: () => void;
  quantity?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onAdd, quantity }) => {
  return (
    <div className="menu-item-card">
      {/* Image Container */}
      <div className="menu-item-image-wrapper">
        <img src={item.image} alt={item.name} className="menu-item-image" />
        <div className="menu-item-overlay"></div>
        
        {/* Popular Badge */}
        {item.popular && (
          <div className="menu-item-popular-badge">
            <IonIcon icon={flame} className="popular-icon" />
            <span>Popular</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="menu-item-content">
        {/* Header with Name and Action */}
        <div className="menu-item-header">
          <div className="menu-item-info">
            <h3 className="menu-item-name">{item.name}</h3>
            <p className="menu-item-description">{item.description}</p>
          </div>
        </div>

        {/* Footer with Price and Button */}
        <div className="menu-item-footer">
          <div className="menu-item-price-section">
            <span className="menu-item-price">₱{item.price.toFixed(2)}</span>
          </div>
          
          {quantity ? (
            <div className="menu-item-quantity-badge">
              <IonIcon icon={checkmarkCircle} className="quantity-check-icon" />
              <span className="quantity-count">{quantity}</span>
            </div>
          ) : (
            <IonButton
              className="menu-item-add-button"
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
            >
              <IonIcon icon={add} className="add-icon" />
            </IonButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;