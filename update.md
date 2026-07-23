# Project Updates

## 1. OTP Email Verification System (New)

### Backend — `backend/`
Flask microservice for sending/verifying OTP codes via Gmail SMTP.

| File | Purpose |
|------|---------|
| `main.py` | Flask server: `POST /send-otp` (generate + email 6-digit code), `POST /verify-otp` (validate code), `GET /health`. OTPs stored in-memory, expire after 5 min. |
| `requirements.txt` | `flask==3.1.0`, `python-dotenv==1.0.1` |
| `.env` | SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`), OTP expiry config |

**Run:** `python backend/main.py` (serves on port 8000)

### Frontend Integration
| File | Change |
|------|--------|
| `src/services/authService.ts` | Added `sendOtp()` / `verifyOtp()` — call Flask backend via `fetch()` to `VITE_OTP_API_URL` (default `http://localhost:8000`) |
| `src/pages/Auth/OtpVerification.tsx` | New 6-digit OTP input UI with auto-submit, resend cooldown (60s), success state. Writes `emailVerified: true` to Firestore directly after backend confirms OTP. |
| `src/pages/Auth/Register.tsx` | `role='user'` → redirects to `/verify-otp` instead of `/verify-email` |
| `src/context/AuthContext.tsx` | `register()`: customers stay logged in, call `sendOtp()`. `login()`: checks Firestore `emailVerified` (not Firebase Auth `user.emailVerified`). |

### Env Variables Added
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_OTP_API_URL` | `http://localhost:8000` | URL of the Flask OTP backend |

## 2. Role-Based Access Control (RBAC)

### User Model (`src/types/index.ts`)
| New Field | Type | Description |
|-----------|------|-------------|
| `roles` | `string[]` | All roles assigned to the user |
| `activeRole` | `string` | Currently active role (nullable) |
| `accountStatus` | `'active' \| 'pending' \| 'rejected'` | Controls login access |
| `emailVerified` | `boolean` | Email verification status (Firestore, not Firebase Auth) |
| `otpCode` | `string` (optional) | Stored OTP code |
| `otpExpiresAt` | `string` (optional) | OTP expiration timestamp |

### Role Helpers (`src/utils/roleHelpers.ts`)
- `hasRole(activeRole, allowedRoles)` — checks if active role is in allowed list
- `isAdmin(activeRole)` / `isVendor` / `isRider` / `isUser` / `isCustomer`
- All accept `string | null` (the `activeRole`)

### Access Control
| Role | Account Status | Can Login | Notes |
|------|---------------|-----------|-------|
| Customer (`user`) | `active` (auto) | Yes | Must verify email via OTP first |
| Vendor / Rider | `pending` | No | Requires admin approval |
| Admin (master) | `active` (forced) | Yes | Bypasses all checks |
| Guest | N/A | N/A | Not logged in |

### Master Admin (`src/utils/masterAdmin.ts` + `src/components/MasterAdminSync.tsx`)
- Credentials in `.env`: `VITE_ADMIN_EMAIL=admin@ehatid.com`, `VITE_ADMIN_PASSWORD=Admin@123`
- Auto-provisions `admin` role + `accountStatus: 'active'` on login if missing
- Syncs on page refresh via `MasterAdminSync` component

### Protected Routes (`src/components/ProtectedRoute.tsx`)
- `requiredRole` accepts `string | string[]`
- Vendor routes allow both `['vendor', 'admin']`
- Guest routes only accessible when logged out

## 3. Auth System Overhaul

### Unified Pages
- Removed role-specific auth pages: `AdminLogin.tsx`, `RiderLogin.tsx`, `VendorLogin.tsx`, `Auth.tsx`
- Replaced with single `Login.tsx` + `Register.tsx` handling all roles

### Login Flow
1. Firebase Auth sign-in
2. Fetch user doc from Firestore
3. Master admin check → auto-provision admin role
4. `accountStatus` check → reject if `pending`
5. Customer email verification check → redirect to `/verify-otp` if not verified
6. Role validation → reject if no roles assigned

### Registration Flow
1. Firebase Auth create user
2. Create Firestore user doc with `roles`, `activeRole`, `accountStatus`
3. `role='user'` → send OTP email, stay logged in, redirect to `/verify-otp`
4. `role='vendor' | 'rider'` → logout immediately (pending approval)

### AuthContext (`src/context/AuthContext.tsx`)
- `normalizeUser()` — ensures `roles` array, `activeRole` defaults
- `login()` — master admin sync, account status checks, email verification check
- `register()` — OTP flow for customers, auto-logout for vendors/riders
- `setActiveRole(role)` — switch active role, persist to Firestore
- `isRoleAuthenticated(role)` — check if user has a specific role

## 4. Layout & Navbar Consolidation

### Removed (12 files)
| Removed | Replaced By |
|---------|-------------|
| `AdminNavBar.tsx`, `RiderNavBar.tsx`, `UserNavBar.tsx`, `VendorNavBar.tsx`, `Navbar/index.ts` | `src/components/Navbar.tsx` (unified) |
| `AdminLayout.tsx`, `CustomerLayout.tsx`, `GuestLayout.tsx`, `RiderLayout.tsx`, `VendorLayout.tsx` | `src/layouts/AppLayout.tsx` + `src/layouts/RoleLayout.tsx` |

### RoleLayout Features
- Sidebar: fixed position, `h-screen`, logout button pinned at bottom
- Navbar hidden when sidebar present
- Main content has `lg:ml-64` offset
- Custom header with title and back button

## 5. Admin Panel Refactoring

### New Components (`src/components/admin/`)
| Component | Purpose |
|-----------|---------|
| `AdminPageShell` | Page wrapper with consistent padding, header, loading state |
| `AdminStatCard` | Statistics card for dashboard metrics |
| `AdminSkeleton` | Loading skeleton placeholder |

### Pages Refactored (5 pages, ~300–650 lines → ~89–213 lines)
| Page | Key Changes |
|------|-------------|
| `Dashboard.tsx` | Uses `AdminPageShell`, `AdminStatCard`; in-page nav bars removed |
| `Users.tsx` | Role management with `<select>` dropdown per user, wired to `updateUserRole()` |
| `Riders.tsx` | Uses `AdminPageShell`, pending/active rider management |
| `Orders.tsx` | Order listing with status management |
| `Reports.tsx` | Report listing with resolution workflow |

### User Role Management
- Admin can change any user's role via dropdown in Users page
- Calls `updateUserRole(uid, newRole)` from `src/services/userService.ts`

## 6. Firestore Security Rules (`firestore.rules`)
- Replaced `request.auth.token.admin` with document-based role checks using `get()`
- Functions: `isAdmin`, `isVendor`, `isRider`, `hasRole`
- Applied to: `users`, `stalls`, `orders`, `reviews` collections
- Granular per-collection read/write rules based on roles

## 7. Config & Infrastructure

| File | Change |
|------|--------|
| `.env` | Added `VITE_OTP_API_URL`, reorganized SMTP vars |
| `firebase.json` | New — Firebase project config (Firestore rules + indexes) |
| `firestore.indexes.json` | New — composite index definitions |
| `scripts/` | Mobile build scripts added |

## 8. Page Migrations (Tailwind + Consistency)
All pages under `src/pages/` updated:
- Removed `IonPage` / `IonHeader` / `IonContent` Ionic wrappers
- Removed `AppFooter` imports
- Replaced `IonBackButton` with custom button
- Unified styling with Tailwind classes

**Affected (40+ files):** Customer pages (Cart, Home, LocationPicker, OrderTracking, Orders, Profile), Vendor pages (Dashboard, Earnings, Orders, Products, Reviews, Settings), Rider pages (Earnings, Home, Orders, Profile), Guest pages (Cart, Home, Landing, LocationPicker), Other (ActivityLog, Messages, ReportIncident).

## 9. Deleted Firebase Functions
`functions/` directory removed. Firebase Functions (Cloud Functions) no longer used for OTP — replaced by Python Flask backend.
