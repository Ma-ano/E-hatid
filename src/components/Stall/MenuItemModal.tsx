import React, { useState, useMemo } from 'react';
import {
  IonModal,
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { closeOutline, add, remove, cartOutline } from 'ionicons/icons';
import { MenuItem, SelectedOption, SelectedAddOn } from '../../types';
import './MenuItemModal.css';

interface MenuItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  onAddToCart: (input: {
    item: MenuItem;
    selectedOptions: SelectedOption[];
    selectedAddOns: SelectedAddOn[];
    specialInstructions: string;
  }) => void;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({
  item,
  isOpen,
  isMobile,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleOptionChange = (optionId: string, choiceId: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionId]: choiceId }));
  };

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => ({ ...prev, [addOnId]: !prev[addOnId] }));
  };

  const selectedOptionsList: SelectedOption[] = useMemo(() => {
    return Object.entries(selectedOptions)
      .map(([optionId, choiceId]) => {
        const option = item.options?.find(o => o.id === optionId);
        const choice = option?.choices.find(c => c.id === choiceId);
        if (!option || !choice) return null;
        return {
          optionId,
          optionName: option.name,
          choiceId,
          choiceName: choice.name,
          choicePrice: choice.price,
        };
      })
      .filter((o): o is SelectedOption => o !== null);
  }, [selectedOptions, item.options]);

  const selectedAddOnsList: SelectedAddOn[] = useMemo(() => {
    return Object.entries(selectedAddOns)
      .filter(([, selected]) => selected)
      .map(([addOnId]) => {
        const addOn = item.addOns?.find(a => a.id === addOnId);
        if (!addOn) return null;
        return { addOnId: addOn.id, name: addOn.name, price: addOn.price };
      })
      .filter((a): a is SelectedAddOn => a !== null);
  }, [selectedAddOns, item.addOns]);

  const totalPrice = useMemo(() => {
    const optionsPrice = selectedOptionsList.reduce((s, o) => s + o.choicePrice, 0);
    const addOnsPrice = selectedAddOnsList.reduce((s, a) => s + a.price, 0);
    return (item.price + optionsPrice + addOnsPrice) * quantity;
  }, [item.price, selectedOptionsList, selectedAddOnsList, quantity]);

  const allRequiredFilled = useMemo(() => {
    if (!item.options) return true;
    return item.options
      .filter(o => o.required)
      .every(o => selectedOptions[o.id]);
  }, [item.options, selectedOptions]);

  const handleAddToCart = () => {
    onAddToCart({
      item,
      selectedOptions: selectedOptionsList,
      selectedAddOns: selectedAddOnsList,
      specialInstructions,
    });
    setQuantity(1);
    setSelectedOptions({});
    setSelectedAddOns({});
    setSpecialInstructions('');
    onClose();
  };

  const content = (
    <div className="modal-content-wrapper">
      <div className="modal-item-hero" style={{ backgroundImage: `url(${item.image})` }}>
        <div className="modal-item-hero-overlay" />
        <h2 className="modal-item-title">{item.name}</h2>
      </div>

      <div className="modal-body">
        <p className="modal-item-desc">{item.description}</p>
        <p className="modal-item-base-price">Base price: ₱{item.price.toFixed(2)}</p>

        {item.options?.map(option => (
          <div key={option.id} className="option-group">
            <div className="option-group-header">
              <span className="option-group-title">{option.name}</span>
              {option.required && <span className="option-required">Required</span>}
              {!option.required && <span className="option-optional">Optional</span>}
            </div>
            <div className="option-choices">
              {option.choices.map(choice => {
                const isSelected = selectedOptions[option.id] === choice.id;
                return (
                  <div
                    key={choice.id}
                    className={`choice-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleOptionChange(option.id, choice.id)}
                  >
                    <div className={`choice-radio ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <div className="choice-radio-dot" />}
                    </div>
                    <span className="choice-name">{choice.name}</span>
                    {choice.price > 0 && (
                      <span className="choice-price">+₱{choice.price.toFixed(2)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {item.addOns && item.addOns.length > 0 && (
          <div className="option-group">
            <div className="option-group-header">
              <span className="option-group-title">Add-ons</span>
              <span className="option-optional">Optional</span>
            </div>
            <div className="option-choices">
              {item.addOns.map(addOn => {
                const isSelected = !!selectedAddOns[addOn.id];
                return (
                  <div
                    key={addOn.id}
                    className={`choice-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleAddOnToggle(addOn.id)}
                  >
                    <div className={`choice-checkbox ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <div className="choice-checkmark">✓</div>}
                    </div>
                    <span className="choice-name">{addOn.name}</span>
                    <span className="choice-price">+₱{addOn.price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="option-group">
          <div className="option-group-header">
            <span className="option-group-title">Special Instructions</span>
            <span className="option-optional">Optional</span>
          </div>
          <textarea
            className="special-instructions-input"
            placeholder="e.g., allergic to peanuts, no onions, extra sauce..."
            value={specialInstructions}
            onChange={e => setSpecialInstructions(e.target.value)}
            rows={3}
          />
        </div>

        <div className="modal-quantity-section">
          <span className="option-group-title">Quantity</span>
          <div className="quantity-selector">
            <button
              className="qty-btn-modal"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <IonIcon icon={remove} />
            </button>
            <span className="qty-modal-value">{quantity}</span>
            <button
              className="qty-btn-modal"
              onClick={() => setQuantity(q => q + 1)}
            >
              <IonIcon icon={add} />
            </button>
          </div>
        </div>
      </div>

      <div className="modal-footer-fixed">
        <IonButton
          expand="block"
          size="large"
          className="add-to-cart-btn"
          disabled={!allRequiredFilled}
          onClick={handleAddToCart}
        >
          <IonIcon icon={cartOutline} slot="start" />
          Add to Cart • ₱{totalPrice.toFixed(2)}
        </IonButton>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <IonPage className="menu-item-page">
        <IonHeader className="ion-no-border">
          <IonToolbar style={{ '--background': 'var(--ion-card-background)' }}>
            <IonButtons slot="start">
              <IonButton onClick={onClose} style={{ '--color': '#6366F1' }}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{ '--background': 'var(--ion-background-color)' }}>
          {content}
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className="menu-item-modal"
      style={{ '--max-width': '520px', '--height': '90vh', '--border-radius': '16px' } as any}
    >
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': 'transparent' }}>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ '--background': 'var(--ion-background-color)' }}>
        {content}
      </IonContent>
    </IonModal>
  );
};

export default MenuItemModal;
