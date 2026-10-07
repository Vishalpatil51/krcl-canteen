# KRCL Canteen Order Management System

## Project Overview
Konkan Railway (KRCL) canteen ke liye web-based order management system.
Employees 3rd-8th floor pe kaam karte hain, canteen 3rd floor ke side me hai.
Employees mobile se order karenge, canteen staff prepare karega, delivery staff floor-wise deliver karega.

- Total employees: ~5,233
- Peak hours: Breakfast 8-10 AM, Lunch 12:30-2:30 PM
- Canteen staff: 4-5 + chefs + 1 counter person
- Floors: 3rd to 8th (KRCL ka 3rd floor se upar)

## Tech Stack
- Frontend: Angular 22 (standalone components, signals, new control flow @if/@for)
- Backend: Java 11 + Spring Boot 2.7 (PLANNED — abhi mock hai)
- Database: PostgreSQL (PLANNED)
- Node: 24.21.0 (portable, F:\New_node_24\node-v24.21.0-win-x64)
- npm: 11.19.0
- Angular CLI: 22.2.1
- Java: 11.0.2 (E:\jdk-11.0.2)
- Maven: 3.9.16 (C:\Program Files\New_Maven\apache-maven-3.9.16)

## Project Location
F:\krcl-canteen\krcl-canteen-frontend

## GitHub Repository
https://github.com/Vishalpatil51/krcl-canteen

## Important: PATH Setup
Naya Node portable hai. Har nayi Command Prompt me pehle:
set PATH=F:\New_node_24\node-v24.21.0-win-x64;%PATH%

Purana Node 10 system me alag installed hai, purane projects ke liye safe hai.

## Roles
- SUPER_ADMIN: sab kuch (default: /admin)
- CANTEEN_ADMIN: menu, orders, reports (default: /canteen)
- COUNTER_STAFF: payment verify + daily report (default: /counter)
- KITCHEN_STAFF: order prepare (default: /kitchen)
- DELIVERY_STAFF: floor-wise delivery (default: /delivery)
- EMPLOYEE: order place kare (default: /employee)

## Demo Logins (OTP: 123456)
- 9999999999 → Super Admin
- 8888888888 → Canteen Admin
- 7777777777 → Counter Staff
- 6666666666 → Kitchen Staff
- 5555555555 → Delivery Staff A (Floors 5, 6)
- Any other 10-digit (5-9 se start) → Employee (Floor 6)

## Features DONE (All Frontend)
- [x] Login with mobile OTP (mock, OTP = 123456)
- [x] Role-based redirect after login
- [x] Auth guard (protected routes)
- [x] Employee Dashboard (menu tabs, cart, order place with real items/prices)
- [x] Employee Order History (/employee/orders with All/Active/Past filter)
- [x] Canteen Dashboard (order queue, status advance, mark paid, cancel)
- [x] Canteen Menu Management (/canteen/menu — edit price/qty/stock/add/remove)
- [x] Kitchen Dashboard (ACCEPTED → PREPARING → READY)
- [x] Delivery Dashboard (READY → OUT_FOR_DELIVERY → DELIVERED + cash collect)
- [x] Admin Dashboard (/admin — users, floors, staff-floor assignments)
- [x] Counter Dashboard (/counter — cash pending, paid, daily report)
- [x] Admin Reports (/admin/reports — today/week/month/all time analytics)
- [x] PWA setup (mobile install + offline caching + service worker)
- [x] Full workflow: PLACED → ACCEPTED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
- [x] GitHub repo setup + push

## Features TODO (Remaining)
- [ ] Backend Spring Boot API
- [ ] PostgreSQL database
- [ ] Real OTP integration (MSG91 / Firebase)
- [ ] JWT authentication
- [ ] Razorpay integration
- [ ] FCM push notifications
- [ ] Real-time sync (multi-user)
- [ ] Order cancel by employee (before ACCEPTED)
- [ ] Monthly ledger for PAY_LATER
- [ ] Reports export to PDF/Excel
- [ ] WhatsApp/SMS alerts
- [ ] Android app (Capacitor wrapper)
- [ ] Multi-canteen support (future)

## Folder Structure
src/app/
├── core/
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── floor.model.ts
│   │   ├── menu-item.model.ts
│   │   ├── order.model.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts    (login/OTP, mock user by mobile)
│   │   ├── menu.service.ts    (daily menus + edit/add/remove)
│   │   ├── order.service.ts   (orders CRUD + status update, mock data)
│   │   ├── cart.service.ts    (cart state with signals)
│   │   └── admin.service.ts   (users, floors, assignments — mock)
│   └── guards/
│       ├── auth.guard.ts
│       └── role.guard.ts
├── shared/
│   └── components/            (empty, future)
└── features/
    ├── auth/login/            ✅
    ├── employee/
    │   ├── dashboard/         ✅
    │   └── order-history/     ✅
    ├── canteen/
    │   ├── dashboard/         ✅
    │   └── menu-management/   ✅
    ├── kitchen/dashboard/     ✅
    ├── delivery/dashboard/    ✅
    ├── counter/dashboard/     ✅
    ├── admin/
    │   ├── dashboard/         ✅
    │   └── reports/           ✅
    └── (PWA assets in public/)

## Routes
- /login              → Login (OTP)
- /employee           → Employee Dashboard (menu + cart)
- /employee/orders    → Employee Order History
- /canteen            → Canteen Dashboard
- /canteen/menu       → Menu Management
- /kitchen            → Kitchen Dashboard
- /delivery           → Delivery Dashboard
- /counter            → Counter Staff Dashboard
- /admin              → Admin Dashboard (users/floors/assignments)
- /admin/reports      → Reports & Analytics
- /**                 → Redirect to /login

## Order Status Flow
PLACED → ACCEPTED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
Any → CANCELLED

## Payment Modes
- ONLINE: order place karte waqt pay (mock me instantly PAID)
- CASH: delivery pe cash collect (COD_PENDING → PAID via Counter/Delivery)
- PAY_LATER: ledger (future)

## Payment Status
- PENDING: cash order, abhi pay nahi hua
- PAID: online ya cash receive ho gaya
- COD_PENDING: cash on delivery, waiting
- FAILED: online payment fail

## Menu Structure (Demo)
Breakfast (8:00 AM - 10:00 AM):
- Poha ₹30, Upma ₹30, Idli ₹40, Tea ₹10, Coffee ₹15

Lunch (12:30 PM - 2:30 PM):
- Roti ₹5, Rice ₹30, Dal ₹40, Aloo Gobi ₹50, Bhindi Masala ₹50,
  Combo ₹90, Curd ₹20

## Floor Assignments (Demo)
Delivery Staff A → Floors 5, 6
(Baaki staff backend aane ke baad configure honge)

## Mock Data Location
- src/app/core/services/auth.service.ts → getMockUser()
- src/app/core/services/menu.service.ts → loadMockMenus()
- src/app/core/services/order.service.ts → loadMockOrders()
- src/app/core/services/admin.service.ts → loadMockData()

## How to Run (Development)
cd /d F:\krcl-canteen\krcl-canteen-frontend
set PATH=F:\New_node_24\node-v24.21.0-win-x64;%PATH%
ng serve
Browser: http://localhost:4200

## How to Run (Production / PWA Test)
ng build
npx http-server dist/krcl-canteen-frontend/browser -p 5500 -c-1
Browser: http://localhost:5500
Mobile: http://<laptop-ip>:5500 → Chrome menu → "Install app"

## PWA Info
- Service Worker: ngsw-worker.js (auto-registered)
- Manifest: public/manifest.webmanifest
- Icons: public/icons/ (auto-generated by Angular)
- Display: standalone (full screen app)
- Offline: works via cache
- Install: Add to Home Screen

## Testing Flow (End-to-End)
1. Login employee (1234567890) → place order (Poha 2, Tea 1 = ₹70)
2. Login canteen (8888888888) → Mark ACCEPTED
3. Login kitchen (6666666666) → Start Cooking → Mark Ready
4. Login delivery (5555555555) → Pick Up → Mark Delivered
5. Login counter (7777777777) → verify cash, check daily report
6. Login employee → My Orders → check status DELIVERED
7. Login admin (9999999999) → Reports → check analytics

## Next Steps (Priority Order)
1. **Backend Spring Boot setup** ← NEXT SESSION START HERE
2. JWT auth + real OTP (MSG91)
3. REST APIs for orders, menu, users
4. Angular services ko mock se real API pe switch karna
5. Razorpay integration
6. FCM push notifications
7. Real-time order updates (WebSocket)
8. Reports export (PDF/Excel)
9. Android app (Capacitor) → Play Store

## Backend Plan (Java 11 + Spring Boot 2.7)
Location: F:\krcl-canteen\krcl-canteen-backend

### Dependencies
- Spring Boot 2.7.x
- Spring Web
- Spring Data JPA
- Spring Security + JWT (jjwt)
- PostgreSQL Driver
- Lombok
- Validation
- Razorpay Java SDK (later)
- Firebase Admin SDK (later)

### Database
PostgreSQL — database name: krcl_canteen

### Entities
- User (id, name, employeeId, mobile, role, floorId, isActive, fcmToken, createdAt)
- Floor (id, floorNumber, name, isActive)
- MenuItem (id, name, category, unit, defaultPrice, isActive)
- DailyMenu (id, date, mealType, startTime, endTime, cutoffTime, isActive)
- DailyMenuItem (id, dailyMenuId, menuItemId, price, availableQty, soldQty, isOutOfStock)
- Order (id, orderNumber, userId, floorId, assignedStaffId, mealType, orderDate, status, paymentMode, paymentStatus, totalAmount, createdAt, deliveredAt, notes)
- OrderItem (id, orderId, dailyMenuItemId, itemName, quantity, price, total)
- Payment (id, orderId, amount, mode, status, razorpayTxnId, paidAt)
- StaffFloorAssignment (id, staffId, floorId)
- Ledger (id, userId, amount, type, orderId, settled) — future

### REST API Endpoints (Plan)
Auth:
- POST   /api/auth/send-otp          { mobile }
- POST   /api/auth/verify-otp        { mobile, otp } → { token, user }
- GET    /api/auth/me                → current user

Menu:
- GET    /api/menu/today             → both meals
- GET    /api/menu/today/{mealType}  → breakfast/lunch
- POST   /api/menu/items             (CANTEEN_ADMIN)
- PATCH  /api/menu/items/{id}
- DELETE /api/menu/items/{id}

Orders:
- POST   /api/orders                 (EMPLOYEE) → place
- GET    /api/orders/my              → my orders
- GET    /api/orders/floor/{n}       (DELIVERY_STAFF)
- GET    /api/orders/status/{s}      (CANTEEN/KITCHEN/DELIVERY)
- GET    /api/orders/all             (ADMIN)
- PATCH  /api/orders/{id}/status     { status }
- PATCH  /api/orders/{id}/payment    { paymentStatus }

Admin:
- GET    /api/users
- POST   /api/users
- PATCH  /api/users/{id}
- DELETE /api/users/{id}
- GET    /api/floors
- POST   /api/floors
- GET    /api/staff-floor-assignments
- POST   /api/staff-floor-assignments
- DELETE /api/staff-floor-assignments/{id}

Reports:
- GET    /api/reports/summary?period=TODAY|WEEK|MONTH|ALL
- GET    /api/reports/top-items
- GET    /api/reports/orders-by-floor

### Security
- JWT token in Authorization header (Bearer)
- Role-based access control (@PreAuthorize)
- OTP valid 5 min, 3 attempts max, 15 min block
- CORS configured for Angular origin

## Git Commands (Common)
cd /d F:\krcl-canteen\krcl-canteen-frontend
git status
git add .
git commit -m "message"
git push

## Known Issues / Notes
- Sabhi services abhi mock data use kar rahi hain
- API integration ke waqt services ke andar `mock` word search karo
- Cart service signals use karti hai (Angular 22 modern state)
- Har feature ke baad git commit karo
- SCSS bundle size warnings aati hain build me (harmless)
- PWA sirf production build (`ng build`) me activate hoti hai, `ng serve` me nahi

## Session Progress Log
- Session 1: Setup (Node 24 portable, Angular CLI 22) + Login + Employee dashboard + Cart + Canteen dashboard + Delivery dashboard + PROJECT.md
- Session 2: Kitchen dashboard + Order History + Menu Management + Admin dashboard + Counter dashboard + Reports + PWA + GitHub push

## Next Session Start Here
Naya session start karte waqt ye paste karo:

"Mera KRCL Canteen project F:\krcl-canteen\krcl-canteen-frontend hai.
PROJECT.md padho, GitHub pe push ho chuka hai (github.com/Vishalpatil51/krcl-canteen).
Frontend complete hai - saare roles ke dashboards ban chuke hain.
Ab Backend (Java 11 + Spring Boot 2.7 + PostgreSQL) banana hai.
Backend ke liye naya folder: F:\krcl-canteen\krcl-canteen-backend
Spring Initializr se start karo, details PROJECT.md me hain."