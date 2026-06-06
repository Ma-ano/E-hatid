/src_refactored/data/mockData/
├── index.ts                 # Main export file - import from here
├── users.ts                 # MOCK_USERS data
├── riders.ts                # MOCK_RIDERS data
├── admins.ts                # MOCK_ADMINS data
├── vendors.ts               # MOCK_VENDORS, MOCK_VENDORS_REF, Vendor interface
└── credentials.ts           # MOCK_CREDENTIALS, ALL_CREDENTIALS

## How to Import

Instead of importing individual pieces from different locations, import from the centralized index:

```typescript
// ✅ RECOMMENDED - Import from main index
import { 
  MOCK_USERS, 
  MOCK_RIDERS, 
  MOCK_ADMINS, 
  MOCK_VENDORS, 
  MOCK_CREDENTIALS, 
  ALL_CREDENTIALS,
  type Vendor 
} from 'src_refactored/data/mockData';

// ✅ ALSO WORKS - Import from specific files
import { MOCK_USERS } from 'src_refactored/data/mockData/users';
import { MOCK_CREDENTIALS } from 'src_refactored/data/mockData/credentials';
import { MOCK_VENDORS, type Vendor } from 'src_refactored/data/mockData/vendors';
```

## Current Usage in Context Files

- **AdminAuthContext.tsx** - Imports MOCK_ADMINS ✓
- **RiderAuthContext.tsx** - Imports MOCK_RIDERS ✓
- **AuthContext.tsx** - Imports MOCK_CREDENTIALS ✓
- **VendorAuthContext.tsx** - Imports MOCK_VENDORS ✓

## Old File

The original `src/data/mockData.ts` is deprecated and can be removed. All imports have been updated to use the new centralized structure in `src_refactored/data/mockData/`.
