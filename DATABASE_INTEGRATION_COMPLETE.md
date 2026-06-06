# RidingApp Database Integration - Setup Complete ✅

Your application is now fully configured for database integration with Python backend!

## What Has Been Set Up

### ✅ Backend (Python FastAPI)

**Location:** `/backend`

**Key Files:**
- `app/main.py` - FastAPI application server
- `app/database.py` - Database connection & session management
- `app/config.py` - Configuration management
- `app/models/` - SQLAlchemy database models:
  - `user.py` - User and VendorProfile models
  - `stall.py` - Stall and MenuItem models
  - `order.py` - Order, OrderItem, Cart models
- `app/schemas/` - Pydantic validation schemas
- `app/api/` - API endpoints:
  - `health.py` - Health check endpoints
  - `stalls.py` - Stall and menu endpoints
  - `cart.py` - Cart management endpoints
- `requirements.txt` - Python dependencies
- `.env.example` - Environment template

**Technologies:**
- FastAPI - Modern web framework
- SQLAlchemy - ORM (Object-Relational Mapping)
- Pydantic - Data validation
- Uvicorn - ASGI server
- PostgreSQL/MongoDB ready

### ✅ Frontend API Services

**Location:** `/myApp/src/services`

**Key Files:**
- `api.ts` - Core API request handler with error handling
- `stallService.ts` - Stall and menu API calls
- `cartService.ts` - Cart management API calls
- `healthService.ts` - Health check monitoring
- `index.ts` - Centralized exports
- `README.md` - Service documentation

**Environment Files:**
- `/myApp/.env` - Local configuration
- `/myApp/.env.example` - Configuration template

**Features:**
- Automatic error handling
- Request timeout (30s)
- Bearer token support
- Type-safe responses

### ✅ Database Models

**User System:**
```
- User (authentication, profile)
  ├── email (unique)
  ├── password_hash
  ├── role (customer, vendor, admin)
  └── relationships
      ├── orders
      └── vendor_profile

- VendorProfile
  ├── stall_name
  ├── description
  ├── phone, address
  └── relationships
      ├── user
      └── stalls
```

**Food Delivery:**
```
- Stall (restaurant/vendor)
  ├── name
  ├── cuisine_type
  ├── rating, delivery_time
  └── relationship
      └── menu_items

- MenuItem (food items)
  ├── name
  ├── description
  ├── category
  ├── price
  └── relationship
      └── order_items
```

**Orders System:**
```
- Order
  ├── order_number
  ├── status (pending, confirmed, etc.)
  ├── total_amount
  ├── delivery_address
  └── relationship
      └── items (OrderItem)

- OrderItem
  ├── quantity
  ├── unit_price
  └── special_instructions

- Cart / CartItem (temporary storage)
  ├── user_id
  ├── stall_id
  └── items
```

## How to Use

### 1. Start Backend

```bash
cd backend

# Activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Create tables
python -c "from app.database import create_tables; create_tables()"

# Start server
python -m uvicorn app.main:app --reload --port 8000
```

**Backend URL:** http://localhost:8000
**Swagger UI:** http://localhost:8000/api/docs

### 2. Start Frontend

```bash
cd myApp

# Install dependencies
npm install

# Start development server
npx vite
```

**Frontend URL:** http://localhost:5173

### 3. Use API Services in Frontend

```typescript
// Import services
import { fetchStalls, addToCart } from '@/services';

// Fetch stalls
const response = await fetchStalls({ limit: 10 });
if (response.status === 200) {
  console.log(response.data); // Stalls array
}

// Add to cart
const cartResponse = await addToCart(stallId, userId, {
  menu_item_id: 1,
  quantity: 2
});
```

## API Endpoints

### Health & Status
```
GET /api/health          - API health check
GET /api/status          - API status with features
```

### Stalls
```
GET /api/stalls?skip=0&limit=10&cuisine_type=pizza
  - Get list of stalls (paginated)

GET /api/stalls/{stall_id}
  - Get stall details

GET /api/stalls/{stall_id}/menu?category=burgers
  - Get menu items for stall
```

### Cart
```
GET /api/cart/{stall_id}?user_id={user_id}
  - Get user's cart

POST /api/cart/{stall_id}/add?user_id={user_id}
  - Add item to cart

PUT /api/cart/{stall_id}/item/{item_id}?user_id={user_id}&quantity={qty}
  - Update cart item quantity

DELETE /api/cart/{stall_id}/item/{item_id}?user_id={user_id}
  - Remove item from cart

DELETE /api/cart/{stall_id}/clear?user_id={user_id}
  - Clear entire cart
```

## Configuration Files

### Backend Environment (backend/.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ridingapp
BACKEND_PORT=8000
DEBUG=True
SECRET_KEY=your-secret-key
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment (myApp/.env)
```env
VITE_API_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000/api
```

## Important Notes

⚠️ **Environment Files:**
- NEVER commit `.env` files to Git
- Contains sensitive credentials
- Add to `.gitignore` (already done)
- Copy `.env.example` and update locally

⚠️ **CORS Configuration:**
- Backend accepts requests from frontend
- Configured for localhost in development
- Update `frontend_url` in backend/.env for production

⚠️ **Database:**
- PostgreSQL is recommended for production
- SQLite is suitable for development
- Update `DATABASE_URL` in .env
- Run table creation script before starting backend

## Directory Structure

```
ridingapp-main/
├── backend/
│   ├── app/
│   │   ├── api/              # REST endpoints
│   │   ├── models/           # Database models
│   │   ├── schemas/          # Pydantic validators
│   │   ├── main.py           # FastAPI app
│   │   ├── database.py       # DB setup
│   │   ├── config.py         # Configuration
│   │   └── __init__.py
│   ├── main.py               # Entry point
│   ├── requirements.txt      # Dependencies
│   ├── .env.example          # Config template
│   └── README.md             # Backend docs
│
├── myApp/
│   ├── src/
│   │   ├── services/         # API client
│   │   │   ├── api.ts        # Core HTTP client
│   │   │   ├── stallService.ts
│   │   │   ├── cartService.ts
│   │   │   ├── healthService.ts
│   │   │   └── index.ts
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── types/
│   │   └── ...
│   ├── .env                  # Frontend config
│   ├── .env.example          # Config template
│   └── package.json
│
├── DATABASE_SETUP.md         # Detailed guide
├── QUICK_START.md            # 5-minute setup
└── .gitignore                # Updated
```

## Common Commands

### Backend
```bash
# Start development server
python -m uvicorn app.main:app --reload

# Create database tables
python -c "from app.database import create_tables; create_tables()"

# Access Swagger UI
open http://localhost:8000/api/docs

# Test health endpoint
curl http://localhost:8000/api/health
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npx vite

# Build for production
npm run build

# Type check
npm run build  # Runs tsc first
```

## Testing API

### Using Browser
- Visit http://localhost:8000/api/docs
- Use built-in Swagger UI to test endpoints
- See request/response examples

### Using cURL
```bash
# Test health
curl http://localhost:8000/api/health

# Get stalls
curl http://localhost:8000/api/stalls

# Add to cart
curl -X POST http://localhost:8000/api/cart/1/add?user_id=1 \
  -H "Content-Type: application/json" \
  -d '{"menu_item_id": 1, "quantity": 2}'
```

## Next Steps

1. ✅ **Review** - Read `DATABASE_SETUP.md` for detailed information
2. ✅ **Configure** - Update `.env` files with your credentials
3. ✅ **Database** - Set up PostgreSQL database
4. ✅ **Test** - Start backend and frontend, test API
5. ⏭️ **Enhance** - Add user authentication (JWT tokens)
6. ⏭️ **Features** - Implement order management
7. ⏭️ **Advanced** - Add real-time updates (WebSocket)

## Support

For more information:
- Backend: See `backend/README.md`
- Frontend Services: See `myApp/src/services/README.md`
- Setup: See `DATABASE_SETUP.md`
- Quick Start: See `QUICK_START.md`

## Status

✅ Backend structure - Complete
✅ Database models - Complete
✅ API endpoints - Complete
✅ Frontend services - Complete
✅ Environment files - Complete
✅ Documentation - Complete

🚀 **Ready for database integration!**

For questions or issues, check the documentation files or the API Swagger documentation at `http://localhost:8000/api/docs`.
