Redesign the UI/UX for customer, vendor, and rider dashboards to be modern, clean, and non-technical-user friendly while preserving responsiveness and existing functionality.

DO NOT break routes, logic, role guards, or data structure.

DESIGN GOAL
Simple, intuitive, and minimal interface
Non-technical users should understand navigation instantly
Reduce cognitive load
Prioritize clarity over density
KEEP EXISTING STRUCTURE

Do NOT change:

Routes (/customer/*, /vendor/*, /rider/*)
Role logic
Backend/data handling

Only refactor UI components and layout.

COLOR PALETTE
STRICTLY use existing color palette
Do NOT introduce new primary colors
You may:
Adjust shades (lighter/darker)
Improve contrast
Use neutral backgrounds (gray/white tones if already present)

Ensure:

Accessible contrast
Consistent usage across all roles
TYPOGRAPHY
Use clear hierarchy:
Page title (large, bold)
Section title (medium)
Body text (regular)
Labels (small, muted)
Avoid technical wording:
Replace terms like “Execute”, “Submit Request”
Use: “Save”, “Continue”, “Confirm”, “View”
NAVIGATION (KEEP RESPONSIVE SYSTEM)

Maintain:

Desktop (≥768px):

Top Navbar
Clean horizontal layout
Add spacing between items
Highlight active route clearly

Mobile (<768px):

Bottom Navbar
Max 4–5 items
Use icons + short labels
NAVIGATION LABELS (SIMPLIFY)

Replace technical labels:

“Dashboard” → “Home”
“Manage Orders” → “Orders”
“User Settings” → “Profile”
“Transactions” → “Payments” (if applicable)

Use consistent naming across all roles.

COMPONENT REDESIGN

Apply to all roles:

Cards:

className="rounded-xl shadow-sm border p-4 bg-white"

Buttons:

Primary: solid (brand color)
Secondary: outline or subtle background
Large tap targets (mobile friendly)

Inputs:

Rounded
Clear labels above input
Add spacing between fields
SPACING SYSTEM

Use consistent spacing scale:

Section spacing: mb-6 or mb-8
Card padding: p-4 or p-5
Gap between items: gap-3 or gap-4

Avoid cramped layouts.

ICON USAGE
Add simple icons to:
Navigation
Buttons (optional)
Key actions
Keep icons consistent (same library)
Do NOT overuse
EMPTY STATES

Add friendly empty states:

Example:

“No orders yet” → “You don’t have any orders yet”
Add small helper text:
“New orders will appear here”
FEEDBACK STATES

Add:

Loading indicators (spinner/skeleton)
Success messages:
“Saved successfully”
Error messages:
Simple and human-readable
PROFILE PAGES

Ensure:

Desktop:

Clean centered layout
Group related info

Mobile:

Stacked layout
Easy to scroll

Logout:

Desktop → Navbar
Mobile → Profile page
CONSISTENCY ACROSS ROLES

Customer, Vendor, Rider should:

Share same layout system
Share same UI components
Differ only in content

Avoid duplicating styles per role.

INTERACTIONS
Add hover states (desktop)
Add active/pressed states (mobile)
Smooth transitions:
className="transition-all duration-200"
FINAL CHECK

Ensure:

No visual clutter
No duplicated navigation
Clear hierarchy
Fully responsive (320px → 1440px+)
No broken layouts

GOAL:
A modern, clean, and easy-to-use interface for all roles that feels simple, consistent, and professional while respecting the existing system and color palette.