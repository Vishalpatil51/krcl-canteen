# KRCL Canteen Order Management System

## Project Overview
Konkan Railway (KRCL) canteen ke liye web-based order management system.
Employees 3rd-8th floor pe kaam karte hain, canteen 3rd floor ke side me hai.
Employees mobile se order karenge, canteen staff prepare karega, delivery staff floor-wise deliver karega.

## Tech Stack
- Frontend: Angular 22 (standalone components, signals)
- Backend: Java 11 + Spring Boot 2.7 (planned, abhi mock hai)
- Database: PostgreSQL (planned)
- Node: 24.21.0 (portable, F:\New_node_24\node-v24.21.0-win-x64)
- npm: 11.19.0
- Angular CLI: 22.2.1
- Java: 11.0.2 (E:\jdk-11.0.2)
- Maven: 3.9.16 (C:\Program Files\New_Maven\apache-maven-3.9.16)

## Project Location
F:\krcl-canteen\krcl-canteen-frontend

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
- [x] Employee Dashboard (menu, cart, order place)
- [x] Canteen Dashboard (order queue, status advance, payment mark)
- [x] Delivery Dashboard (pickup, collect cash, mark delivered)

## TODO (Remaining)
- [ ] Kitchen Dashboard (preparing → ready)
- [ ] Admin Dashboard (users, floors, assignments)
- [ ] Order History page for employee
- [ ] Monthly ledger
- [ ] Backend Spring Boot API
- [ ] PostgreSQL database
- [ ] Razorpay integration
- [ ] FCM push notifications
- [ ] PWA setup
- [ ] Android app (Capacitor)

## Folder Structure
src/app/
├── core/
│   ├── models/         user, floor, menu-item, order
│   ├── services/       auth, menu, order, cart
│   └── guards/         auth.guard.ts
├── shared/
│   └── components/     (empty)
└── features/
    ├── auth/login/
    ├── employee/dashboard/
    ├── canteen/dashboard/
    ├── delivery/dashboard/
    ├── kitchen/        (pending)
    └── admin/          (pending)

## Order Status Flow
PLACED → ACCEPTED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
Any → CANCELLED

## Payment Modes
- ONLINE: order place karte waqt pay
- CASH: delivery pe cash collect
- PAY_LATER: ledger (future)

## Menu Structure
Breakfast (8:00 AM - 10:00 AM):
- Poha, Upma, Idli, Tea, Coffee

Lunch (12:30 PM - 2:30 PM):
- Roti, Rice, Dal, Sabji (multiple), Combo, Curd

## Floor Assignments (Demo)
Delivery Staff A → Floors 5, 6

## Mock Data Location
- src/app/core/services/auth.service.ts → getMockUser()
- src/app/core/services/menu.service.ts → loadMockMenus()
- src/app/core/services/order.service.ts → loadMockOrders()

## How to Run
cd /d F:\krcl-canteen\krcl-canteen-frontend
set PATH=F:\New_node_24\node-v24.21.0-win-x64;%PATH%
ng serve
Browser: http://localhost:4200

## Next Steps for Development
1. Kitchen Dashboard banana
2. Employee Order History page
3. Admin dashboard (user/floor/staff assignment)
4. Spring Boot backend setup
5. REST API integration (replace mock services)
6. Razorpay + FCM
7. PWA setup

## Backend Plan (Java 11 + Spring Boot 2.7)
Location: F:\krcl-canteen\krcl-canteen-backend
Database: PostgreSQL
Entities: User, Floor, MenuItem, DailyMenu, DailyMenuItem, Order, OrderItem, Payment, Ledger
Auth: JWT + mobile OTP (MSG91/Firebase)
API endpoints:
- POST /api/auth/send-otp
- POST /api/auth/verify-otp
- GET  /api/menu/today
- POST /api/orders
- GET  /api/orders/my
- GET  /api/orders/floor/{floorNumber}
- GET  /api/orders/status/{status}
- PATCH /api/orders/{id}/status
- PATCH /api/orders/{id}/payment

## Notes
- Sabhi services abhi mock data use kar rahi hain
- API integration baad me hogi (services me methods already API-ready hain)
- Har service me `mock` word search kar lo, wahan replace karna hai