# KRCL Canteen Order Management System

## Project Overview
Konkan Railway (KRCL) canteen ke liye web-based order management system.
Employees 3rd-8th floor pe kaam karte hain, canteen 3rd floor ke side me hai.
Employees mobile se order karenge, canteen staff prepare karega, delivery staff floor-wise deliver karega.

Total employees: ~5,233
Peak hours: Breakfast 8-10 AM, Lunch 12:30-2:30 PM
Canteen staff: 4-5 + chefs + 1 counter person
Floors: 3rd to 8th (KRCL ka 3rd floor se upar)

## Tech Stack
- Frontend: Angular 22 (standalone components, signals, new control flow @if/@for)
- Backend: Java 11 + Spring Boot 2.7 (planned, abhi mock hai)
- Database: PostgreSQL (planned)
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
- SUPER_ADMIN: sab kuch
- CANTEEN_ADMIN: menu, orders, reports
- COUNTER_STAFF: payment verify
- KITCHEN_STAFF: order prepare
- DELIVERY_STAFF: floor-wise delivery
- EMPLOYEE: order place kare

## Demo Logins (OTP: 123456)
- 9999999999 → Super Admin
- 8888888888 → Canteen Admin
- 7777777777 → Counter Staff
- 6666666666 → Kitchen Staff
- 5555555555 → Delivery Staff A (Floors 5, 6)
- Any other 10-digit (5-9 se start) → Employee (Floor 6)

## Current Status (DONE)
- [x] Login with mobile OTP (mock)
- [x] Employee Dashboard (menu, cart, order place with real item names/prices)
- [x] Employee Order History (/employee/orders with All/Active/Past filters)
- [x] Canteen Dashboard (order queue, status advance, mark paid)
- [x] Kitchen Dashboard (start cooking, mark ready)
- [x] Delivery Dashboard (pickup, collect cash, mark delivered)
- [x] Full workflow: PLACED → ACCEPTED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
- [x] GitHub repo setup + initial push

## TODO (Remaining)
- [ ] Admin Dashboard (users add, floors manage, delivery staff assignment)
- [ ] Counter Staff Dashboard (cash verify, daily report)
- [ ] Menu Management (canteen admin ke liye - items add/remove/price/quantity)
- [ ] Reports (daily/monthly sales)
- [ ] Monthly ledger for PAY_LATER
- [ ] Backend Spring Boot API
- [ ] PostgreSQL database
- [ ] Real OTP integration (MSG91 / Firebase)
- [ ] Razorpay integration
- [ ] FCM push notifications
- [ ] PWA setup (Add to Home Screen)
- [ ] Android app (Capacitor wrapper)
- [ ] Order cancellation by employee
- [ ] Rating/feedback

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
│   │   ├── auth.service.ts    (login/OTP, mock user)
│   │   ├── menu.service.ts    (daily menus, mock data)
│   │   ├── order.service.ts   (orders CRUD, mock data)
│   │   └── cart.service.ts    (cart state with signals)
│   └── guards/
│       ├── auth.guard.ts
│       └── role.guard.ts
├── shared/
│   └── components/            (empty)
└── features/
    ├── auth/login/            ✅
    ├── employee/
    │   ├── dashboard/         ✅
    │   └── order-history/     ✅
    ├── canteen/dashboard/     ✅
    ├── kitchen/dashboard/     ✅
    ├── delivery/dashboard/    ✅
    └── admin/                 (pending)

## Order Status Flow
PLACED → ACCEPTED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
Any → CANCELLED

## Payment Modes
- ONLINE: order place karte waqt pay (mock me instantly PAID)
- CASH: delivery pe cash collect (COD_PENDING → PAID)
- PAY_LATER: ledger (future)

## Payment Status
- PENDING: cash order, abhi pay nahi hua
- PAID: online ya cash receive ho gaya
- COD_PENDING: cash on delivery, waiting
- FAILED: online payment fail

## Menu Structure
Breakfast (8:00 AM - 10:00 AM):
- Poha ₹30, Upma ₹30, Idli ₹40, Tea ₹10, Coffee ₹15

Lunch (12:30 PM - 2:30 PM):
- Roti ₹5, Rice ₹30, Dal ₹40, Aloo Gobi ₹50, Bhindi Masala ₹50,
  Combo ₹90, Curd ₹20

## Floor Assignments (Demo)
Delivery Staff A → Floors 5, 6
(Baaki staff backend aane ke baad configure honge)

## Mock Data Location
- src/app/core/services/auth.service.ts → getMockUser() (mobile se role decide)
- src/app/core/services/menu.service.ts → loadMockMenus()
- src/app/core/services/order.service.ts → loadMockOrders()

## How to Run
cd /d F:\krcl-canteen\krcl-canteen-frontend
set PATH=F:\New_node_24\node-v24.21.0-win-x64;%PATH%
ng serve
Browser: http://localhost:4200

## Routes
- /login              → Login page
- /employee           → Employee dashboard (menu + cart)
- /employee/orders    → Employee order history
- /canteen            → Canteen admin dashboard
- /kitchen            → Kitchen dashboard
- /delivery           → Delivery staff dashboard
- /**                 → Redirect to /login

## Testing Flow (End-to-End)
1. Login as employee (1234567890) → place order (Poha 2, Tea 1 = ₹70)
2. Logout → Login as canteen (8888888888) → Mark ACCEPTED
3. Logout → Login as kitchen (6666666666) → Start Cooking → Mark Ready
4. Logout → Login as delivery (5555555555) → Pick Up → Mark Delivered
5. Employee login → My Orders → check status DELIVERED

## Next Steps for Development
1. Admin Dashboard (users/floors/staff assignment)
2. Counter Staff Dashboard
3. Menu Management page
4. Spring Boot backend setup
5. REST API integration (replace mock services)
6. Real OTP + Razorpay + FCM
7. PWA setup + Android app

## Backend Plan (Java 11 + Spring Boot 2.7)
Location: F:\krcl-canteen\krcl-canteen-backend
Database: PostgreSQL
Entities: User, Floor, MenuItem, DailyMenu, DailyMenuItem, Order, OrderItem, Payment, Ledger

API endpoints planned:
- POST   /api/auth/send-otp
- POST   /api/auth/verify-otp
- GET    /api/menu/today
- GET    /api/menu/today/{mealType}
- POST   /api/orders
- GET    /api/orders/my
- GET    /api/orders/floor/{floorNumber}
- GET    /api/orders/status/{status}
- PATCH  /api/orders/{id}/status
- PATCH  /api/orders/{id}/payment
- GET    /api/users
- POST   /api/users
- GET    /api/floors
- POST   /api/staff-floor-assignments

## Notes
- Sabhi services abhi mock data use kar rahi hain
- API integration ke waqt services me methods already API-ready hain
- Har service me `mock` word search karo, wahan replace karna hai
- Cart service signals use karti hai (Angular 22 ka modern state management)
- Har feature ke baad `git add . && git commit -m "..."` zaroor karo

## Git Commands (Common)
cd /d F:\krcl-canteen\krcl-canteen-frontend
git status
git add .
git commit -m "message"
git push

## Known Issues / Notes
- Demo me items mein "Item" naam aata tha — fix kar diya (real names aa rahe hain)
- Login validation 5-9 se start hone wale numbers accept karta hai (demo purpose)
- Order ID time-based generate hota hai, mock me dummy data bhi hai