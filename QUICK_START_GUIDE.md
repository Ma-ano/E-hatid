# Order Tracking & Connections - Quick Integration Guide

## Files Created

### 1. Services
- **[NotificationService.ts](src/services/NotificationService.ts)** - Manages all notifications and messages
- **[OrderTrackingService.ts](src/services/OrderTrackingService.ts)** - Manages order lifecycle

### 2. Context
- **[NotificationContext.tsx](src/context/NotificationContext.tsx)** - React context for notifications

### 3. Components
- **[Notifications.tsx](src/components/Notifications.tsx)** - Notification UI component
- **[Notifications.css](src/components/Notifications.css)** - Notification styling

### 4. Pages
- **[EnhancedMessages.tsx](src/pages/Messages/EnhancedMessages.tsx)** - User messaging (updated)
- **[VendorMessages.tsx](src/pages/Vendor/VendorMessages.tsx)** - Vendor messaging (new)

### 5. Types (Updated)
- **[index.tsx](src/types/index.tsx)** - Extended Order, Message, Notification types

## How to Integrate

### Step 1: Update App.tsx
Add NotificationProvider and add route for VendorMessages:

```typescript
import { NotificationProvider } from './context/NotificationContext';
import VendorMessages from './pages/Vendor/VendorMessages';

export const App: React.FC = () => (
  <NotificationProvider>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Existing routes */}
          <Route path="/vendor/messages" component={VendorMessages} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </NotificationProvider>
);
```

### Step 2: Add Notifications Component to Header
In your PageHeader or main navbar:

```typescript
import Notifications from './components/Notifications';

const PageHeader = () => {
  return (
    <IonHeader>
      <IonToolbar>
        {/* Other content */}
        <IonButtons slot="end">
          <Notifications />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};
```

### Step 3: Use in Order Pages

#### User Checkout Page
```typescript
import { orderTrackingService } from '../services/OrderTrackingService';
import { useNotification } from '../context/NotificationContext';

const Checkout = () => {
  const { user } = useAuth();
  const { notifications } = useNotification();

  const handleCheckout = () => {
    // Create order - triggers vendor notification
    const order = orderTrackingService.createOrder({
      userId: user.id,
      vendorId: vendorId,
      items: cartItems,
      total: cartTotal,
      stallName: selectedVendor.name,
      customerName: user.name,
      customerPhone: user.phone,
      deliveryAddress: deliveryAddress,
    });

    // Order created! Vendor will see it in their dashboard
    // User will receive notifications about status changes
    history.push(`/order/${order.id}`);
  };

  return (
    <div>
      {/* Checkout UI */}
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
};
```

#### Vendor Orders Page
```typescript
import { orderTrackingService } from '../services/OrderTrackingService';

const VendorOrders = () => {
  const { vendor } = useVendorAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Get all orders for this vendor
    const vendorOrders = orderTrackingService.getVendorOrders(vendor.id);
    setOrders(vendorOrders);
  }, [vendor.id]);

  const handleAcceptOrder = (orderId: string) => {
    const order = orderTrackingService.vendorAcceptOrder(orderId, vendor.id);
    if (order) {
      // Order accepted! User notification sent automatically
      // Update UI
      setOrders(orders.map(o => o.id === orderId ? order : o));
    }
  };

  const handleMarkReady = (orderId: string) => {
    const order = orderTrackingService.vendorMarkReady(orderId, vendor.id);
    if (order) {
      // Order marked ready! Rider assigned automatically
      // Notifications sent to user + rider
      setOrders(orders.map(o => o.id === orderId ? order : o));
    }
  };

  return (
    <div>
      {orders.map(order => (
        <div key={order.id}>
          <h3>{order.customerName}</h3>
          <p>Status: {order.status}</p>
          <button onClick={() => handleAcceptOrder(order.id)}>Accept</button>
          <button onClick={() => handleMarkReady(order.id)}>Mark Ready</button>
        </div>
      ))}
    </div>
  );
};
```

#### Rider Orders Page
```typescript
import { orderTrackingService } from '../services/OrderTrackingService';

const RiderOrders = () => {
  const { user } = useAuth();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Get all active orders for this rider
    const orders = orderTrackingService.getRiderActiveOrders(user.id);
    setActiveOrders(orders);
  }, [user.id]);

  const handleAcceptOrder = (orderId: string) => {
    // This connects the user-order-vendor together
    const order = orderTrackingService.riderAcceptOrder(orderId, user.id);
    if (order) {
      // Notifications sent to user + vendor
      // User can now message rider directly
      setActiveOrders(activeOrders.filter(o => o.id !== orderId));
    }
  };

  const handlePickup = (orderId: string) => {
    const order = orderTrackingService.riderPickedUpOrder(orderId, user.id);
    if (order) {
      // Status: delivering
      // User gets "on the way" notification
    }
  };

  const handleDeliver = (orderId: string) => {
    const order = orderTrackingService.completeDelivery(orderId, user.id);
    if (order) {
      // Status: delivered
      // Notifications sent to user + vendor
    }
  };

  return (
    <div>
      {activeOrders.map(order => (
        <div key={order.id}>
          <h3>Order {order.id}</h3>
          <p>Customer: {order.customerName}</p>
          <p>From: {order.stallName}</p>
          <p>To: {order.deliveryAddress}</p>
          <button onClick={() => handleAcceptOrder(order.id)}>Accept Order</button>
          <button onClick={() => handlePickup(order.id)}>Picked Up</button>
          <button onClick={() => handleDeliver(order.id)}>Delivered</button>
        </div>
      ))}
    </div>
  );
};
```

## Order Status Flow

```
User places order
    ↓
Vendor receives notification
    ↓
Vendor accepts/rejects (notified user)
    ↓
If accepted: Vendor marks ready
    ↓
Rider gets notification
Rider accepts order
    ↓  (connects all 3 parties)
Rider picks up from vendor
    ↓
Rider on the way
    ↓
Order delivered
    ↓
User & Vendor notified
```

## Example: Listen to Specific Order Updates

```typescript
import { orderTrackingService } from '../services/OrderTrackingService';

const OrderTracking = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Get initial order
    const currentOrder = orderTrackingService.getOrder(orderId);
    setOrder(currentOrder);

    // Subscribe to order updates
    const unsubscribe = orderTrackingService.subscribeToOrder(orderId, (updatedOrder: Order) => {
      setOrder(updatedOrder);
      // UI updates automatically
    });

    return unsubscribe;
  }, [orderId]);

  return (
    <div>
      <h2>Order {orderId}</h2>
      <p>Status: {order?.status}</p>
      <p>From: {order?.stallName}</p>
      <p>Rider: {order?.riderId}</p>
    </div>
  );
};
```

## Real-time Updates (For Production)

Replace the `emit()` method in services with WebSocket/Firebase:

```typescript
// In NotificationService
private emit(eventKey: string, data: any): void {
  // Option 1: WebSocket
  socket.emit(eventKey, data);

  // Option 2: Firebase
  firebase.database().ref(`events/${eventKey}`).set(data);

  // Option 3: Keep existing for offline support
  const callbacks = this.listeners.get(eventKey);
  if (callbacks) {
    callbacks.forEach(callback => callback(data));
  }
}
```

## Testing the System

1. **Create Mock Order**: 
   ```typescript
   const order = orderTrackingService.createOrder({...});
   ```

2. **Trigger Vendor Action**:
   ```typescript
   orderTrackingService.vendorAcceptOrder(order.id, vendorId);
   ```

3. **Check Notifications**:
   - User should see notification in Notifications component
   - Notification bell badge updates

4. **Send Message**:
   ```typescript
   sendMessage({
     senderId: userId,
     senderRole: 'user',
     receiverId: vendorId,
     content: 'Hello',
     ...
   });
   ```

## Key Features Implemented

✅ User → Vendor: Order placement with notifications  
✅ Vendor → User: Order status updates  
✅ Vendor → Rider: Pickup notifications  
✅ Rider → User: Pickup/delivery updates  
✅ Rider → Vendor: Confirmation messages  
✅ User ↔ Vendor: Real-time messaging  
✅ User ↔ Rider: Real-time messaging  
✅ Vendor ↔ Rider: Real-time messaging  
✅ Notification system with badges  
✅ Order tracking with lifecycle  
✅ Message history  

## Next Steps

1. Connect to real backend API
2. Add WebSocket for real-time updates
3. Add database persistence
4. Add ride matching algorithm
5. Add map/location tracking
6. Add payment integration
7. Add ratings/reviews system
