# E-hatid — Project State

## Brand
- **Name:** E-hatid
- **Icon:** `carOutline`
- **Footer:** Dynamic copyright year

## Pages

| Role | Page | Status |
|------|------|--------|
| Guest | Home, About, Privacy, Terms, Contact | Basic |
| Guest | Login, Register | Functional |
| Guest | LocationPicker | Leaflet + Photon geocoding |
| User | Home, Cart, OrderTracking, Profile | Connected |
| User | LocationPicker | Leaflet + Photon, saves to profile |
| User | OrderTracking | **Live Firestore `onSnapshot`**, Cancel button (pending only), cancelled reason display, **item price breakdown** (base/options/add-ons), **responsive status stepper** (vertical on mobile, horizontal on desktop/tablet with equal gaps) |
| Vendor | Dashboard | **Live Firestore `onSnapshot`** (no polling), Accept/Decline on recent orders, decline reason modal, **delivery address shown**, **item price breakdown** |
| Vendor | Products | **Add Product button fixed** (now opens editor), new items append to menu |
| Vendor | Orders | **Live Firestore `onSnapshot`** (no polling), Accept/Decline with reason modal, 30-min auto-cleanup, filter tabs (all/pending/in_progress/completed/cancelled), customer name/phone, **delivery address shown**, **item price breakdown** |
| Vendor | Earnings | Firestore-backed |
| Vendor | Reviews | Firestore-backed |
| Vendor | Settings | Dual save (user + stall), compressed base64 image upload, min dimensions enforced |
| Rider | (placeholder) | |
| Admin | Dashboard, Reports, Users, Activities | Partially built |

## Architecture

### Services
| Service | Collection | Methods |
|---------|-----------|---------|
| `stallService` | `stalls` | CRUD + menu update |
| `orderService` | `orders` | `fetchOrdersByVendor`, `subscribeVendorOrders`, `fetchOrdersToday`, `getEarningsStats`, `updateOrderStatus` |
| `reviewService` | `reviews` | `fetchReviewsByStall`, `getReviewStats` |

### Context
- **AuthContext** — Firebase Auth + Firestore `users/{uid}`, `isLoggingInRef` race prevention, `ProtectedRoute` with `requiredRole`
- **CartContext** — localStorage key `foodie_cart_{role}_{userId}`
- **OrderContext** — localStorage key `foodie_orders_{role}_{userId}`

### Vendors
- Stall document ID = vendor UID (1-to-1)
- Menu stored as embedded `menu: MenuItem[]` in stall doc
- Images: compressed base64 in Firestore (no Firebase Storage)
- Min dimensions enforced: cover 800×400, logo 200×200

## Order System
- **Statuses:** `pending → accepted → preparing → ready → delivered | cancelled`
- **Customer cancel:** Only when `status === 'pending'`, uses IonAlert confirmation
- **Vendor accept/decline:** On `/vendor/orders` and `/vendor/dashboard` recent orders
- **Decline reason:** Modal with textarea, reason stored as `cancelledReason` on order doc, shown to user on OrderTracking
- **Auto-cleanup:** Orders pending >30 mins auto-cancelled with reason `'Auto-cancelled (30 min timeout)'`, applied on snapshot updates
- **Real-time:** OrderTracking and VendorDashboard use Firestore `onSnapshot` live listeners
- **Timestamp conversion:** `convertTimestamps` helper converts Firestore Timestamps to Date objects on all fetched orders
- **Price breakdown:** Item cards show base price, option choice prices, and add-on prices separately with per-item subtotal

## Types
- `Order` includes: `customerName`, `customerPhone`, `cancelledReason`, `vendorId`, `stallName`, `deliveryAddress`
- `OrderItem` includes: `selectedOptions` (with `choicePrice`), `selectedAddOns` (with `price`), `specialInstructions`
- `MenuItem` includes: `options`, `addOns`, `popular`, `available`
- No `InventoryItem` type (removed)

## Firestore Collections
```
users/{uid}         — all roles, single collection
stalls/{vendorId}   — menu array, images as base64
orders/{docId}      — vendorId, stallId, userId, customerName, customerPhone, deliveryAddress, items (with selectedOptions, selectedAddOns), total, status, cancelledReason
reviews/{docId}     — stallId, userId, rating, comment, likes
notifications/{docId}
messages/{msgId}
activities/{activityId}
reports/{reportId}
```

## Firebase Rules
Copy the rules block below into **Firebase Console → Firestore → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }

    match /stalls/{stallId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.vendorId;
      allow update: if request.auth != null && request.auth.uid == resource.data.vendorId;
      allow delete: if false;
    }

    match /orders/{orderId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        request.auth.uid == resource.data.vendorId
      );
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        request.auth.uid == resource.data.vendorId
      );
      allow delete: if false;
    }

    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    match /notifications/{notifId} {
      allow read, update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow delete: if false;
    }

    match /messages/{msgId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.senderId ||
        request.auth.uid == resource.data.recipientId
      );
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.senderId ||
        request.auth.uid == resource.data.recipientId
      );
      allow delete: if false;
    }

    match /activities/{activityId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow delete: if false;
    }

    match /reports/{reportId} {
      allow read, update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow delete: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Known Issues (pre-existing)
- `ActivityLog.tsx` — Date/severity type mismatches
- `Reports.tsx` — Type mismatch with `Report` interface
- `NotificationService.ts` — `Notification`/`Message` type mismatches
- `OrderTrackingService.ts` — Status type mismatches, missing fields

## Build Commands
```
npm run build
npx tsc --noEmit
```
