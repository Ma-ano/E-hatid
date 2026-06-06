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
- Changed AppFooter from IonFooter to `<footer>` element for use inside scrollable content
- Moved AppFooter inside IonContent in StallDetail for natural scroll behavior
- Added IntersectionObserver on footer to dynamically move cart float button up via .footer-visible class when footer scrolls into view
- Reverted AppFooter from `<footer>` back to IonFooter for proper Ionic page-level positioning on all 37 pages
- Removed duplicate standalone IonFooter elements from Cart and Auth pages — moved Pay/Checkout buttons and legal text inside IonContent
- Rebuilt cart payment flow: UserCart now creates an Order object from cart items (with options, add-ons, instructions), clears cart, and passes order data to OrderTracking
- Updated OrderTracking to accept and display actual order items with customizations from history state; falls back to mock data if no order passed
- Updated StallDetail footer: moved AppFooter outside IonContent, added sentinel div with IntersectionObserver for dynamic cart button positioning
- Updated OrderItem type to include selectedOptions, selectedAddOns, specialInstructions to match CartItem
- Reverted AppFooter from IonFooter back to plain `<footer>` element
- Moved `<AppFooter />` inside `<IonContent>` on all 37 pages so footer scrolls naturally at the bottom of the page content (not sticky/fixed)
- Replaced IntersectionObserver sentinel with onIonScroll event in StallDetail for reliable cart button positioning above footer

---

## Build Commands

```
npm run build
npx tsc --noEmit
```
