import React, { useState, useRef } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonToggle,
} from '@ionic/react';
import { closeOutline, addOutline, trashOutline, cameraOutline } from 'ionicons/icons';
import { MenuItem, MenuItemOption, OptionChoice, MenuItemAddOn } from '../../../types';
import './ProductEditorModal.css';

interface ProductEditorModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: MenuItem) => void;
}

const emptyOption = (): MenuItemOption => ({
  id: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: '',
  required: false,
  maxSelections: 1,
  choices: [],
});

const emptyChoice = (): OptionChoice => ({
  id: `ch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: '',
  price: 0,
});

const emptyAddOn = (): MenuItemAddOn => ({
  id: `addon-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: '',
  price: 0,
});

const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description || '');
  const [price, setPrice] = useState(item.price);
  const [category, setCategory] = useState(item.category);
  const [available, setAvailable] = useState(item.available);
  const [popular, setPopular] = useState(item.popular || false);
  const [image, setImage] = useState(item.image || '');
  const [options, setOptions] = useState<MenuItemOption[]>(item.options || []);
  const [addOns, setAddOns] = useState<MenuItemAddOn[]>(item.addOns || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addOption = () => setOptions(prev => [...prev, emptyOption()]);
  const removeOption = (optId: string) => setOptions(prev => prev.filter(o => o.id !== optId));

  const updateOption = (optId: string, field: string, value: any) => {
    setOptions(prev => prev.map(o => o.id === optId ? { ...o, [field]: value } : o));
  };

  const addChoice = (optId: string) => {
    setOptions(prev => prev.map(o =>
      o.id === optId ? { ...o, choices: [...o.choices, emptyChoice()] } : o
    ));
  };

  const removeChoice = (optId: string, chId: string) => {
    setOptions(prev => prev.map(o =>
      o.id === optId ? { ...o, choices: o.choices.filter(c => c.id !== chId) } : o
    ));
  };

  const updateChoice = (optId: string, chId: string, field: string, value: any) => {
    setOptions(prev => prev.map(o =>
      o.id === optId ? {
        ...o,
        choices: o.choices.map(c => c.id === chId ? { ...c, [field]: value } : c),
      } : o
    ));
  };

  const addAddOn = () => setAddOns(prev => [...prev, emptyAddOn()]);
  const removeAddOn = (addOnId: string) => setAddOns(prev => prev.filter(a => a.id !== addOnId));

  const updateAddOn = (addOnId: string, field: string, value: any) => {
    setAddOns(prev => prev.map(a => a.id === addOnId ? { ...a, [field]: value } : a));
  };

  const handleSave = () => {
    onSave({
      ...item,
      name,
      description,
      price,
      category,
      available,
      popular,
      image,
      options: options.filter(o => o.name.trim()),
      addOns: addOns.filter(a => a.name.trim()),
    });
    onClose();
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className="product-editor-modal"
      style={{ '--max-width': '600px', '--height': '95vh', '--border-radius': '16px' } as any}
    >
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': 'var(--ion-card-background)' }}>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonLabel style={{ fontWeight: 700, fontSize: '18px' }}>{item.name || 'New Product'}</IonLabel>
          <IonButtons slot="end">
            <IonButton onClick={handleSave} style={{ '--color': '#8B5CF6', fontWeight: 700 }}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ '--background': 'var(--ion-background-color)' }}>
        <div className="editor-content">
          <div className="editor-section">
            <h3 className="editor-section-title">Basic Info</h3>
            <div className="editor-field">
              <label className="editor-label">Item Name</label>
              <IonItem className="editor-input-item">
                <IonInput value={name} onIonChange={e => setName(e.detail.value!)} />
              </IonItem>
            </div>
            <div className="editor-field">
              <label className="editor-label">Product Photo</label>
              <div className="editor-image-upload" onClick={() => fileInputRef.current?.click()}>
                {image ? (
                  <img src={image} alt="Product" className="editor-image-preview" />
                ) : (
                  <div className="editor-image-placeholder">
                    <IonIcon icon={cameraOutline} />
                    <span>Tap to add photo</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </div>
            </div>
            <div className="editor-field">
              <label className="editor-label">Description</label>
              <IonItem className="editor-input-item">
                <IonTextarea value={description} onIonChange={e => setDescription(e.detail.value!)} rows={2} />
              </IonItem>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="editor-field">
                <label className="editor-label">Price (₱)</label>
                <IonItem className="editor-input-item">
                  <IonInput type="number" value={price} onIonChange={e => setPrice(Number(e.detail.value) || 0)} />
                </IonItem>
              </div>
              <div className="editor-field">
                <label className="editor-label">Category</label>
                <IonItem className="editor-input-item">
                  <IonInput value={category} onIonChange={e => setCategory(e.detail.value!)} />
                </IonItem>
              </div>
            </div>
            <div className="editor-toggles">
              <div className="editor-toggle-row">
                <IonLabel>Available</IonLabel>
                <IonToggle checked={available} onIonChange={e => setAvailable(e.detail.checked)} style={{ '--background-checked': '#8B5CF6' }} />
              </div>
              <div className="editor-toggle-row">
                <IonLabel>Popular</IonLabel>
                <IonToggle checked={popular} onIonChange={e => setPopular(e.detail.checked)} style={{ '--background-checked': '#8B5CF6' }} />
              </div>
            </div>
          </div>

          <div className="editor-section">
            <div className="editor-section-header">
              <h3 className="editor-section-title">Options (Required / Choice Groups)</h3>
              <IonButton fill="clear" size="small" onClick={addOption} style={{ '--color': '#8B5CF6' }}>
                <IonIcon icon={addOutline} slot="start" />
                Add Option Group
              </IonButton>
            </div>

            {options.map((option, oi) => (
              <div key={option.id} className="option-editor-card">
                <div className="option-editor-header">
                  <span className="option-editor-number">#{oi + 1}</span>
                  <IonButton fill="clear" size="small" onClick={() => removeOption(option.id)} style={{ '--color': '#EF4444' }}>
                    <IonIcon icon={trashOutline} />
                  </IonButton>
                </div>
                <div className="editor-field">
                  <label className="editor-label">Option Name (e.g., "Choice of Drink")</label>
                  <IonItem className="editor-input-item">
                    <IonInput value={option.name} onIonChange={e => updateOption(option.id, 'name', e.detail.value!)} />
                  </IonItem>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="editor-toggle-row">
                    <IonLabel>Required</IonLabel>
                    <IonToggle checked={option.required} onIonChange={e => updateOption(option.id, 'required', e.detail.checked)} style={{ '--background-checked': '#8B5CF6' }} />
                  </div>
                  <div className="editor-field">
                    <label className="editor-label">Max Selections</label>
                    <IonItem className="editor-input-item">
                      <IonInput type="number" value={option.maxSelections} onIonChange={e => updateOption(option.id, 'maxSelections', Number(e.detail.value) || 1)} />
                    </IonItem>
                  </div>
                </div>

                <div className="choices-section">
                  <div className="choices-header">
                    <span className="editor-label">Choices</span>
                    <IonButton fill="clear" size="small" onClick={() => addChoice(option.id)} style={{ '--color': '#8B5CF6' }}>
                      <IonIcon icon={addOutline} slot="start" />
                      Add Choice
                    </IonButton>
                  </div>
                  {option.choices.map((choice, ci) => (
                    <div key={choice.id} className="choice-editor-row">
                      <span className="choice-number">{ci + 1}.</span>
                      <IonItem className="editor-input-item choice-name-input">
                        <IonInput value={choice.name} placeholder="Choice name" onIonChange={e => updateChoice(option.id, choice.id, 'name', e.detail.value!)} />
                      </IonItem>
                      <IonItem className="editor-input-item choice-price-input">
                        <IonInput type="number" value={choice.price} placeholder="+₱" onIonChange={e => updateChoice(option.id, choice.id, 'price', Number(e.detail.value) || 0)} />
                      </IonItem>
                      <IonButton fill="clear" size="small" onClick={() => removeChoice(option.id, choice.id)} style={{ '--color': '#EF4444' }}>
                        <IonIcon icon={trashOutline} />
                      </IonButton>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="editor-section">
            <div className="editor-section-header">
              <h3 className="editor-section-title">Add-ons (Optional Extras)</h3>
              <IonButton fill="clear" size="small" onClick={addAddOn} style={{ '--color': '#8B5CF6' }}>
                <IonIcon icon={addOutline} slot="start" />
                Add Add-on
              </IonButton>
            </div>
            {addOns.map((addOn, ai) => (
              <div key={addOn.id} className="choice-editor-row">
                <span className="choice-number">{ai + 1}.</span>
                <IonItem className="editor-input-item choice-name-input">
                  <IonInput value={addOn.name} placeholder="Add-on name" onIonChange={e => updateAddOn(addOn.id, 'name', e.detail.value!)} />
                </IonItem>
                <IonItem className="editor-input-item choice-price-input">
                  <IonInput type="number" value={addOn.price} placeholder="Price" onIonChange={e => updateAddOn(addOn.id, 'price', Number(e.detail.value) || 0)} />
                </IonItem>
                <IonButton fill="clear" size="small" onClick={() => removeAddOn(addOn.id)} style={{ '--color': '#EF4444' }}>
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default ProductEditorModal;
