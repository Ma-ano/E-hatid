// src/components/Cart/CartItem.tsx
import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { add, remove, trash } from 'ionicons/icons';
import { CartItem as CartItemType } from '../../types';
import './CartItem.css';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const hasCustomizations = (item.selectedOptions && item.selectedOptions.length > 0) ||
    (item.selectedAddOns && item.selectedAddOns.length > 0) ||
    item.specialInstructions;

  return (
    <div className="cart-item-card">
      <div className="cart-item-image-wrapper">
        <img src={item.image} alt={item.name} className="cart-item-image" />
      </div>

      <div className="cart-item-content">
        <div className="cart-item-info">
          <h4 className="cart-item-name">{item.name}</h4>
          {hasCustomizations && (
            <div className="cart-item-customizations">
              {item.selectedOptions?.map(opt => (
                <span key={opt.optionId} className="cart-item-option">
                  {opt.optionName}: <strong>{opt.choiceName}</strong>
                  {opt.choicePrice > 0 && <span className="option-surcharge">+₱{opt.choicePrice.toFixed(2)}</span>}
                </span>
              ))}
              {item.selectedAddOns?.map(addOn => (
                <span key={addOn.addOnId} className="cart-item-option">
                  + {addOn.name} <span className="option-surcharge">₱{addOn.price.toFixed(2)}</span>
                </span>
              ))}
              {item.specialInstructions && (
                <span className="cart-item-option instructions">
                  📝 {item.specialInstructions}
                </span>
              )}
            </div>
          )}
          <p className="cart-item-price">₱{item.price.toFixed(2)} each</p>
        </div>

        <div className="cart-item-total">
          <span className="total-label">Total:</span>
          <span className="total-amount">₱{(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-controls">
          <IonButton
            className="quantity-button decrease-btn"
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            title="Decrease quantity"
          >
            <IonIcon icon={item.quantity === 1 ? trash : remove} className="control-icon" />
          </IonButton>

          <span className="quantity-display">{item.quantity}</span>

          <IonButton
            className="quantity-button increase-btn"
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            title="Increase quantity"
          >
            <IonIcon icon={add} className="control-icon" />
          </IonButton>
        </div>

        <IonButton
          className="remove-btn"
          onClick={onRemove}
          title="Remove item"
        >
          <IonIcon icon={trash} className="remove-icon" />
        </IonButton>
      </div>
    </div>
  );
};

export default CartItem;