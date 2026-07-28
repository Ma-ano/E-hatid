# Plan: Logo Fixes & Rider Profile Redesign

## Step 1: Fix Broken Logo References

### 1a. `src/components/LogoHeader.tsx`
- **Line 18**: Change `'/Logo/E-hatid-dark-mode.png'` → `'/Logo/Logo-dark-mode.png'` and `'/Logo/E-hatid-light-mode.png'` → `'/Logo/Logo-light-mode.png'`
- **Line 20**: Bump logo size from `h-10 sm:h-12` → `h-10 sm:h-14`

### 1b. `src/components/DeliveryLoader.tsx`
- **Line 28**: Same logo path fix
- **Line 30**: Bump size from `h-8 sm:h-10` → `h-10 sm:h-12`

### 1c. `src/pages/Guest/Landing.tsx`
- **Line 23**: Same logo path fix
- **Line 25**: Bump size from `h-16 sm:h-20` → `h-16 sm:h-24`

---

## Step 2: Redesign Rider Profile (`src/pages/Rider/Profile.tsx`)

Rewrite the entire component with these improvements:

### Structure Changes:
1. **Header** — Keep `RiderPageHeader` but adjust spacing
2. **Hero Section** — Cleaner design with:
   - Larger avatar circle with user initial letter (instead of generic icon)
   - Name, rating with star icon, delivery count
   - Verification status badge with proper color coding
3. **Quick Access Grid** — Refined to 3 buttons (Activity, Messages, Report) with softer colors and icons
4. **Personal Information** — Card with edit/view toggle; in edit mode use native inputs (not Ionic items) for consistency
5. **Vehicle Information** — NOW EDITABLE in edit mode (vehicle type, license plate, license number)
6. **Banking Information** — NOW EDITABLE in edit mode (bank name, account number)
7. **Delivery Status** — Keep as-is, shows active order with progress bar or "no active delivery" state
8. **Preferences** — Keep notification toggle
9. **Save Button** — Shows during edit mode, at bottom of sections
10. **Logout** — Normal button at bottom (remove `fixed` positioning to avoid tab bar conflict)
11. **Switch Role** — Keep same logic, reposition toward bottom

### Styling Improvements:
- Use consistent Tailwind classes instead of mixed inline `style={}`
- Proper dark mode support via `text-[var(--ion-text-color)]` / `bg-[var(--ion-card-background)]`
- Cleaner card borders using `border-[var(--ion-border-color)]`
- Smoother transitions on edit toggle
- Remove `fixed bottom-20` logout (conflicts with mobile tab bar) — place as inline button

### File to modify:
- `src/pages/Rider/Profile.tsx` (full rewrite, ~450 lines)
