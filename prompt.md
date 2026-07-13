Act as senior product designer + senior frontend engineer (Ionic React, TypeScript, Tailwind CSS, Framer Motion).

Goal:
Transform my app into modern, production-grade, mobile-first, multi-role system (like Grab/UberEats). Premium UI/UX, perfect responsiveness, clean architecture, smooth animations, zero role-mixing bugs.

----------------------------------------

SYSTEM CONTEXT

Roles:
- Guest
- Customer
- Vendor
- Rider
- Admin

Rule:
Each role = separate UX, layout, navigation. NEVER mix.

----------------------------------------

1. GLOBAL DESIGN SYSTEM

- Mobile-first
- 8px spacing
- Clean, minimal

Spacing:
- p-4 / p-6
- gap-4 / gap-6

Radius:
- rounded-lg / xl / 2xl

Shadows:
- shadow-sm
- shadow-md hover

----------------------------------------

2. COLOR + THEME

- primary: #FF5A1F
- primaryHover: #FF7A3D
- dark: #0F172A
- bg: #F8FAFC
- success: #22C55E
- error: #EF4444

Light/Dark:
- bg-white / dark:bg-dark
- text-gray-700 / dark:text-gray-200
- border-gray-200 / dark:border-gray-700

----------------------------------------

3. LAYOUT + SIZING

Navbar:
- h-14 mobile
- h-16 desktop

Buttons:
- min-h-[44px] px-4 rounded-xl

Cards:
- rounded-2xl p-4 md:p-6

Inputs:
- h-11 px-3 rounded-lg

Use:
- container mx-auto px-4
- max-w-* (no fixed)

----------------------------------------

4. ROLE UX

Guest → landing  
Customer → ordering  
Vendor → management  
Rider → delivery  
Admin → control  

----------------------------------------

5. AUTH + ROLE ISOLATION

```ts
type Role = "guest" | "customer" | "vendor" | "rider" | "admin";

Routes:

/
/auth/*
/customer/*
/vendor/*
/rider/*
/admin/*

Guard:

const RoleGuard = ({ role, children }) => {
  const { role: currentRole } = useAuth();
  if (currentRole !== role) return <Navigate to="/" replace />;
  return children;
};

Layouts:
GuestLayout / CustomerLayout / VendorLayout / RiderLayout / AdminLayout

Rule:
NO shared navbar/footer

CATEGORY PILL (Framer Motion)
<motion.div layoutId="active-pill" />

(sliding highlight required)

INTERACTION
hover:scale-[1.02]
active:scale-[0.98]
duration-200
RESPONSIVE
mobile-first
no overflow
grid responsive
COMPONENT SYSTEM

buttons / cards / badges / tables consistent

STATES

loading / empty / error / success

PERFORMANCE

lazy load / optimize images

CUSTOMER CORE UX (IMPORTANT)

CART:

item list (image, name, price)
qty +/- large buttons
remove item
sticky bottom total + checkout
<div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-dark border-t">
  <button className="w-full h-12 bg-primary rounded-xl text-white">
    Checkout
  </button>
</div>
auto update total
disable if empty

ORDERS:

active tracker (stepper)
states:
Pending → Preparing → On the way → Delivered
history list (cards + badges)

PROFILE:

user card
sections:
address / payment / orders / logout
clean list UI

EMPTY STATES:

cart empty
no orders
UX POLISH
large tap targets
smooth animations
clean spacing
no clutter
CRITICAL CSS FIX (VITE ERROR)

Problem:

[vite:css] @import must precede all other statements

Fix:
Move ALL @import to TOP of css file BEFORE any rules

CORRECT:

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

Rule:

@import ALWAYS first
no CSS before it

OUTPUT

Refactor:

home
cart
orders
profile
all roles

Provide:

clean TSX
Tailwind classes

Improve:

spacing
hierarchy
animation

FOCUS

Premium UI
No role mixing
Smooth UX
Fast interactions
Production-ready

