Act as senior software architect + senior frontend engineer (Ionic React, TypeScript, Tailwind, Framer Motion).

I already built a multi-role app (Guest, Customer, Vendor, Rider, Admin).

Your job:
AUDIT + FIX + ENFORCE best practices.

----------------------------------------

CRITICAL GOAL

- ZERO role mixing
- CLEAN folder structure
- PRODUCTION-ready architecture
- CLEAR separation of concerns

----------------------------------------

1. CHECK FOLDER STRUCTURE

Ensure this structure exists and is enforced:

src/
 ├── pages/
 │    ├── guest/
 │    ├── customer/
 │    ├── vendor/
 │    ├── rider/
 │    ├── admin/
 │
 ├── layouts/
 │    ├── GuestLayout.tsx
 │    ├── CustomerLayout.tsx
 │    ├── VendorLayout.tsx
 │    ├── RiderLayout.tsx
 │    ├── AdminLayout.tsx
 │
 ├── components/
 │    ├── shared/
 │    ├── customer/
 │    ├── vendor/
 │    ├── rider/
 │    ├── admin/

RULES:
- NO shared pages between roles
- shared components must be UI-only (buttons, cards)
- NO business logic inside shared

----------------------------------------

2. ROUTING VALIDATION

Ensure routes are STRICT:

/
/auth/*

/customer/*
/vendor/*
/rider/*
/admin/*

Check:
- no mixed routes
- no conditional rendering like:
  ❌ {user ? <CustomerUI /> : <GuestUI />}

----------------------------------------

3. ROLE GUARD VALIDATION

Ensure guard exists and used everywhere:

- blocks wrong role access
- redirects properly

Check for bugs like:
- flicker before redirect
- unauthorized access

----------------------------------------

4. LAYOUT ENFORCEMENT

Ensure each role has:

Guest → marketing navbar + footer  
Customer → app navbar + bottom nav  
Vendor/Admin → sidebar + topbar  
Rider → minimal UI  

Check:
- NO shared navbar/footer
- NO leaking UI across roles

----------------------------------------

5. STATE & AUTH

Ensure:

- single source of truth (AuthContext)
- role stored properly
- loading state handled

Check:
- no double renders
- no undefined role
- no race conditions

----------------------------------------

6. CUSTOMER UX CHECK

Validate:

Cart:
- add/remove/update qty
- sticky checkout bar
- empty state

Orders:
- status tracking
- history list

Profile:
- clean sections
- logout works

----------------------------------------

7. UI/UX QUALITY

Check:

- spacing (8px system)
- consistent radius
- proper hierarchy
- responsive grid

Fix:
- cramped UI
- inconsistent padding
- bad alignment

----------------------------------------

8. ANIMATION CHECK

Ensure:

- category pill uses Framer Motion
- smooth transitions
- no jank

----------------------------------------

9. PERFORMANCE

Check:

- lazy loading routes
- no unnecessary re-renders
- optimized images

----------------------------------------

10. OUTPUT FORMAT

You must:

1. List ALL problems found
2. Explain WHY each is bad
3. Provide FIXED code (TSX)
4. Improve UI where needed
5. Suggest better architecture if needed

----------------------------------------

STRICT RULE

Do NOT say "looks good"

You MUST find issues and improve.