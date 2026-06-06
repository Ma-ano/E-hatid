# E-hatid

> **GitHub:** https://github.com/renrenpedrajeta/ridingapp.git

---

## Latest Updates

### Added — 2026-06-06

#### Firebase Integration (User Authentication)
- Installed `firebase` SDK
- Created `src/firebaseConfig.ts` — Firebase app init, exports `auth` + `db`
- Created `src/services/authService.ts` — `loginUser`, `registerUser`, `logoutUser`, `onAuthChanged`, `getAuthErrorMessage` (Firebase error code mapping)
- Created `src/services/userService.ts` — `createUserDocument`, `getUserDocument`, `updateUserDocument` (Firestore CRUD with `created_at: serverTimestamp()`)
- Rewrote `src/context/AuthContext.tsx` — uses service layer, `onAuthStateChanged` listener, Firestore doc fetch on login
- Registration: `createUserWithEmailAndPassword` → auto `setDoc` to `users/{uid}` with fields: id, name, email, phone, age, address, role, created_at
- Login: `signInWithEmailAndPassword` → fetches Firestore user document
- Profile: syncs Firestore data to form fields via `useEffect` on `user` change
- Error messages: all auth pages now show user-friendly Firebase error messages via `getAuthErrorMessage`
- Removed `MOCK_USERS` and user credentials from `src/data/mockData.ts`
- Renamed `src/firebase.tsx` → `src/firebaseConfig.ts`

#### Forms
- Added Age and Delivery Address fields to Register page
- Added country code dropdown + formatted phone input to Register (same as Profile)
- Added Age field to Profile edit page
- Route root `/` now directly points to `GuestHome` via `ProtectedRoute` (no auth → welcome page, authed → redirect to `/user/home`)
- Fixed force logout: `onAuthStateChanged` with null user now clears state + localStorage instead of restoring from stale cache

### Update Log — 2026-06-02

- Fixed navbar alignment on User Profile page
- Fixed navbar alignment on User Home page
- Fixed navbar alignment on Login page
- Fixed navbar alignment on Register page
- Added MenuItemOption, OptionChoice, MenuItemAddOn types for product customization
- Added Jollibee-style combo items with drink/side choices and add-ons to mock data
- Updated CartContext to handle options, add-ons, and special instructions
- Created MenuItemModal component — required/optional choices, add-ons, special instructions, quantity +/- selector, live price calc (modal on desktop, fullscreen on mobile)
- Rewrote StallDetail with "🔥 Popular Orders" section, items grouped by category, unavailable items greyed out, click-to-customize flow
- Updated CartItem to display selected options, add-ons, and instructions
- Rewrote VendorProducts with Available/Popular toggle switches per item
- Created ProductEditorModal for managing option groups, choices, add-ons, and item status on vendor side
- Added back button navigation to all vendor sub-pages
- Fixed vendor dashboard responsive alignment conflicts
- Added sticky category nav bar to StallDetail with scroll-spy IntersectionObserver tracking section headers
- Fixed scroll-spy precision — sections activate only when header reaches detection zone below sticky nav
- Created reusable AppFooter component with RIDERAPP branding, social icon buttons, and copyright
- Added AppFooter to all 37 pages across Guest, User, Vendor, Rider, Admin, Auth, Activities, Messages, and Reports
- Added image upload to ProductEditorModal for product photos
- Updated VendorProducts and VendorOrders to show product image thumbnails with gradient initial fallback
- Added Stall Appearance card to VendorSettings — cover photo, logo uploads, accent color picker
- Updated OrderTracking to display ordered items with thumbnails, quantities, and prices
- Updated StallDetail to apply stall.accentColor and stall.logo throughout hero, nav, and UI elements
- Added image, logo, accentColor fields to types (MenuItem, OrderItem, Stall)
- Added quick links row (Home, About, Privacy, Terms, Contact) to AppFooter with routing
- Changed AppFooter from IonFooter to <footer> element for use inside scrollable content
- Moved AppFooter inside IonContent in StallDetail for natural scroll behavior
- Added IntersectionObserver on footer to dynamically move cart float button up via .footer-visible class when footer scrolls into view
- Reverted AppFooter from <footer> back to IonFooter for proper Ionic page-level positioning on all 37 pages
- Removed duplicate standalone IonFooter elements from Cart and Auth pages — moved Pay/Checkout buttons and legal text inside IonContent
- Rebuilt cart payment flow: UserCart now creates an Order object from cart items (with options, add-ons, instructions), clears cart, and passes order data to OrderTracking
- Updated OrderTracking to accept and display actual order items with customizations from history state; falls back to mock data if no order passed
- Updated StallDetail footer: moved AppFooter outside IonContent, added sentinel div with IntersectionObserver for dynamic cart button positioning
- Updated OrderItem type to include selectedOptions, selectedAddOns, specialInstructions to match CartItem
- Reverted AppFooter from IonFooter back to plain <footer> element
- Moved <AppFooter /> inside <IonContent> on all 37 pages so footer scrolls naturally at the bottom of the page content (not sticky/fixed)
- Replaced IntersectionObserver sentinel with onIonScroll event in StallDetail for reliable cart button positioning above footer

---

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
