<div align="center">

# 🏨 StayEase — Hotel Booking System

### Built for HCL Hackathon 2026

[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)](https://www.java.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-green?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)](https://www.mysql.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-black?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> A full-stack hotel booking platform with real-time room availability, JWT authentication, promo codes, loyalty rewards, and email confirmations.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Setup](#-setup) • [API Docs](#-api-endpoints) • [Team](#-team)

</div>

---

## 📸 Screenshots

| Landing Page | Hotel Search | Room Availability |
|---|---|---|
| Beautiful hero with login/register | Filter by location, dates, price, rating, amenity | Live room status with progress bars |

| Booking Modal | My Bookings | Email Confirmation |
|---|---|---|
| Promo codes + price preview | History with cancel & rebook | HTML email with reservation number |

---

## ✨ Features

### 🔐 Authentication
- JWT-based stateless authentication
- BCrypt password hashing
- Register / Login with token stored in localStorage
- Protected routes — unauthenticated users redirected to landing page

### 🔍 Smart Hotel Search
- Search by **location** (partial match, case-insensitive)
- Filter by **price range** (min/max per night)
- Filter by **star rating** (3+, 3.5+, 4+, 4.5+)
- Filter by **amenity** (WiFi, Pool, Gym, Spa, AC, Parking, Restaurant, Beach Access)
- Filter by **dates** — only shows hotels with at least one available room

### 🛏️ Real-Time Room Availability
- Date-based availability (not a static flag)
- Overlap detection — same room can be booked for non-overlapping dates
- Live availability counter per room type (FREE / BOOKED / TOTAL)
- Progress bar showing occupancy level
- Auto-refreshes every 30 seconds

### 📅 Booking System
- Select room → pick dates → apply promo → confirm
- Dates pre-filled from search filters
- Booking immediately reflected in availability
- Reservation number generated: `STE-000001`

### 🏷️ Promotions & Loyalty
| Code | Type | Discount | Eligibility |
|------|------|----------|-------------|
| SUMMER20 | Percentage | 20% OFF | All users (Apr–Sep) |
| FLAT500 | Flat | ₹500 OFF | All users |
| WELCOME15 | Percentage | 15% OFF | New users only (0 bookings) |
| LOYAL10 | Percentage | 10% OFF | Users with 30+ loyalty points |

- Users earn **10 loyalty points** per confirmed booking
- Eligible coupons shown as **clickable chips** in booking modal
- Ineligible coupons (e.g. LOYAL10 without enough points) are hidden

### 📋 Booking History
- View all past and upcoming bookings
- Stats: Total / Confirmed / Cancelled
- **Cancel booking** — only future bookings, with confirmation dialog
- **Quick Rebook** — clone a past booking with new dates
- Cancelled rooms instantly freed for others

### 📧 Email Confirmation
- HTML email sent on every confirmed booking
- Contains: Reservation number, hotel details, stay dates, total price, promo used
- Sent asynchronously (booking never waits for email)

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17 | Core language |
| Spring Boot | 3.2.0 | Backend framework |
| Spring Security | 6.x | Authentication & route protection |
| Spring Data JPA | 3.x | ORM / database layer |
| Hibernate | 6.3.1 | JPA implementation |
| JWT (jjwt) | 0.11.5 | Stateless token auth |
| BCrypt | built-in | Password hashing |
| JavaMailSender | built-in | HTML email confirmation |
| SpringDoc OpenAPI | 2.3.0 | Swagger UI documentation |
| Lombok | latest | Boilerplate reduction |
| Maven | 3.x | Build & dependency management |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2.0 | UI framework |
| Axios | 1.6.0 | HTTP API calls with interceptors |
| React Context API | built-in | Global auth state |
| CSS-in-JS | inline | Component-level styling |

### Database & Infrastructure
| Technology | Version | Purpose |
|-----------|---------|---------|
| MySQL | 8.0.45 | Primary relational database |
| HikariCP | built-in | Connection pooling |
| Apache Tomcat | 10.1.16 | Embedded web server |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (:3000)                   │
│  AuthPage │ App.js │ HotelDetailPage │ BookingHistoryPage   │
│  Components: HotelCard, RoomList, BookingModal, Promos      │
│  Services: api.js (Axios + JWT interceptor)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST / JSON
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               Spring Boot Backend (:8080)                   │
│                                                             │
│  JwtFilter → SecurityConfig → Controllers → Services       │
│                                                             │
│  AuthController    /auth/register  /auth/login             │
│  HotelController   /hotels/search  (with all filters)      │
│  RoomController    /rooms/hotel/{id}  /rooms/hotel/{id}/summary │
│  BookingController /bookings  /bookings/history  /cancel   │
│  PromotionController /promotions/active  /promotions/eligible │
└──────────────────────────┬──────────────────────────────────┘
                           │ JPA / JDBC
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  MySQL Database (:3306)                     │
│  Tables: users, hotels, rooms, bookings, promotions         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

```sql
users        → id, name, email, password, loyalty_points, role
hotels       → id, name, location, address, price, rating, amenities, image_url
rooms        → id, hotel_id, type, price, availability
bookings     → id, user_id, room_id, check_in, check_out, status, total_price, promo_code_used
promotions   → id, code, description, type, discount_value, min_loyalty_points, valid_from, valid_to, active, new_user_only
```

---

## 🚀 Setup & Installation

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.x

### 1. Clone the Repository
```bash
git clone https://github.com/vigneshsai4202/HCL-HACKTHON.git
cd HCL-HACKTHON
```

### 2. Database Setup
```bash
mysql -u root -p < backend/src/main/resources/schema.sql
```

### 3. Backend Configuration
```bash
cp backend/src/main/resources/application.properties.template \
   backend/src/main/resources/application.properties
```
Edit `application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.mail.username=YOUR_GMAIL@gmail.com
spring.mail.password=YOUR_16_CHAR_APP_PASSWORD
```

### 4. Run Backend
```bash
cd backend
mvn spring-boot:run
```
Backend starts at → `http://localhost:8080`
Swagger UI → `http://localhost:8080/swagger-ui.html`

### 5. Run Frontend
```bash
cd frontend
npm install
npm start
```
Frontend starts at → `http://localhost:3000`

---

## 📡 API Endpoints

### Public (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login → returns JWT token |
| GET | `/hotels/search?location=Chennai&minPrice=1000&maxPrice=8000&minRating=4&amenity=Pool&checkIn=2026-04-20&checkOut=2026-04-23` | Search hotels with filters |
| GET | `/rooms/hotel/{id}?checkIn=&checkOut=` | Available rooms for dates |
| GET | `/rooms/hotel/{id}/summary?checkIn=&checkOut=` | Live availability count per type |
| GET | `/promotions/active` | All active promotions |

### Protected (JWT Bearer Token Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bookings` | Create booking |
| GET | `/bookings/history` | My booking history |
| DELETE | `/bookings/{id}/cancel` | Cancel a booking |
| POST | `/bookings/rebook/{id}` | Quick rebook with new dates |
| GET | `/promotions/eligible` | Promos eligible for current user |

### Sample Request — Create Booking
```json
POST /bookings
Authorization: Bearer <jwt_token>

{
  "roomId": 1,
  "checkIn": "2026-05-01",
  "checkOut": "2026-05-03",
  "promoCode": "SUMMER20"
}
```

### Sample Response
```json
{
  "success": true,
  "message": "Booking confirmed! 🎉",
  "data": {
    "id": 7,
    "status": "CONFIRMED",
    "totalPrice": 5600.0,
    "promoCodeUsed": "SUMMER20",
    "checkIn": "2026-05-01",
    "checkOut": "2026-05-03"
  }
}
```

---

## 📁 Project Structure

```
HCL-HACKTHON/
├── backend/
│   └── src/main/java/com/hotel/
│       ├── controller/     → REST endpoints
│       ├── service/        → Business logic
│       ├── repository/     → JPA queries
│       ├── entity/         → DB models
│       ├── dto/            → Request/Response objects
│       ├── security/       → JWT + Spring Security
│       └── HotelBookingApplication.java
│
├── frontend/
│   └── src/
│       ├── components/     → HotelCard, RoomList, BookingModal, PromotionsBanner, HotelDetailPage
│       ├── pages/          → AuthPage, BookingHistoryPage
│       ├── services/       → api.js (all Axios calls)
│       ├── context/        → AuthContext (global JWT state)
│       └── App.js          → Main router + home/hotels pages
│
├── design.md               → Architecture & DB schema docs
├── EMAIL_SETUP.md          → Gmail SMTP setup guide
└── README.md
```

---

## 🔑 Key Design Decisions

| Decision | Reason |
|----------|--------|
| **Date-based room availability** | Rooms aren't permanently blocked — same room can be booked for different non-overlapping dates |
| **Soft cancel** | Bookings are never deleted — status set to CANCELLED, preserving audit trail |
| **JWT stateless auth** | No server-side sessions — scales horizontally |
| **@Async email** | Email sending never blocks the booking response |
| **Backend eligibility check for promos** | WELCOME15 hidden after first booking, LOYAL10 hidden without enough points — enforced server-side |
| **CORS wildcard** | Allows access from any network IP (useful during hackathon demos) |

---



## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**🏨 StayEase — Find & Book Your Perfect Hotel Stay**

*Built for HCL Hackathon 2026*

⭐ Star this repo if you found it useful!

</div>
