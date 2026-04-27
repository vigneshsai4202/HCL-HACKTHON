# Hotel Booking System — Design Document

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.2.0 |
| ORM | Spring Data JPA (Hibernate) |
| Database | MySQL 8 |
| Security | Spring Security + JWT (jjwt 0.11.5) |
| Validation | Spring Boot Starter Validation |
| Email | Spring Boot Starter Mail |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| Build Tool | Maven |
| Utilities | Lombok |

### Frontend
| Layer | Technology |
|---|---|
| Language | JavaScript (ES6+) |
| Framework | React 18 |
| HTTP Client | Axios 1.6 |
| State Management | React Context API |
| Bootstrapper | Create React App (react-scripts 5) |

### Communication
- REST API over HTTP
- JWT Bearer token in `Authorization` header
- CORS allowed from `http://localhost:3000`
- Frontend proxy → `http://localhost:8080`

---

## High-Level Design

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                    │
│  Pages: AuthPage, BookingHistoryPage                │
│  Components: HotelCard, RoomList,                   │
│              BookingModal, PromotionsBanner         │
│  Context: AuthContext (JWT + user state)            │
│  Services: api.js (Axios calls)                     │
└──────────────────────┬──────────────────────────────┘
                       │ REST (HTTP/JSON)
                       ▼
┌─────────────────────────────────────────────────────┐
│              Spring Boot Backend (:8080)            │
│                                                     │
│  Controllers                                        │
│  ├── AuthController       /auth/**                  │
│  ├── HotelController      /hotels/**                │
│  ├── RoomController       /rooms/**                 │
│  ├── BookingController    /bookings/**              │
│  ├── PromotionController  /promotions/**            │
│  └── GlobalExceptionHandler                        │
│                                                     │
│  Services                                           │
│  ├── AuthService    (register, login, JWT issue)    │
│  ├── HotelService   (search, filter)                │
│  ├── RoomService    (availability check)            │
│  ├── BookingService (create, cancel, rebook)        │
│  ├── PromotionService (validate promo codes)        │
│  └── EmailService   (booking confirmation mail)     │
│                                                     │
│  Security                                           │
│  ├── JwtUtil        (generate / validate tokens)    │
│  ├── JwtFilter      (per-request token check)       │
│  └── SecurityConfig (route protection rules)        │
└──────────────────────┬──────────────────────────────┘
                       │ JPA / JDBC
                       ▼
┌─────────────────────────────────────────────────────┐
│              MySQL Database (:3306)                 │
│              Database: hotel_booking                │
└─────────────────────────────────────────────────────┘
```

### Key Flows

1. Auth — User registers/logs in → backend issues JWT → frontend stores in localStorage → attached to every subsequent request via Axios interceptor.
2. Hotel Search — Frontend calls `/hotels/search` with filters (location, price range, rating, amenity, dates) → backend queries DB and returns matching hotels.
3. Room Availability — `/rooms/hotel/{id}?checkIn=&checkOut=` returns rooms not already booked in that date range.
4. Booking — User selects room + dates + optional promo code → POST `/bookings` → service validates promo, calculates price, saves booking, awards loyalty points, sends confirmation email.
5. Promotions — Active promos displayed via `/promotions/active`; validated server-side on booking (type: PERCENTAGE or FLAT, loyalty point gate, validity dates).
6. Booking History — GET `/bookings/history` returns all bookings for the logged-in user; supports cancel and rebook.

---

## Database Schema

### users
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT |
| name | VARCHAR | NOT NULL |
| email | VARCHAR | UNIQUE, NOT NULL |
| password | VARCHAR | NOT NULL (BCrypt) |
| loyalty_points | INT | DEFAULT 0 |
| role | VARCHAR | DEFAULT 'USER' |

### hotels
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT |
| name | VARCHAR | NOT NULL |
| location | VARCHAR | |
| address | VARCHAR | |
| price | DOUBLE | base price |
| rating | DOUBLE | |
| amenities | VARCHAR | comma-separated (WiFi, Pool, Gym…) |

### rooms
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT |
| hotel_id | BIGINT | FK → hotels.id |
| type | VARCHAR | SINGLE / DOUBLE / SUITE |
| price | DOUBLE | per night |
| availability | BOOLEAN | |

### bookings
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT |
| user_id | BIGINT | FK → users.id |
| room_id | BIGINT | FK → rooms.id |
| check_in | DATE | |
| check_out | DATE | |
| status | VARCHAR | CONFIRMED / CANCELLED |
| total_price | DOUBLE | after discount |
| promo_code_used | VARCHAR | nullable |
| created_at | DATETIME | DEFAULT NOW() |

### promotions
| Column | Type | Constraints |
|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT |
| code | VARCHAR | UNIQUE |
| description | VARCHAR | |
| type | VARCHAR | PERCENTAGE / FLAT |
| discount_value | DOUBLE | |
| min_loyalty_points | INT | 0 = open to all |
| valid_from | DATE | |
| valid_to | DATE | |
| active | BOOLEAN | DEFAULT true |

### Entity Relationships

```
users ──< bookings >── rooms >── hotels
                  └── promotions (via promo_code_used)
```

- One user → many bookings
- One room → many bookings
- One hotel → many rooms
- Promotions are referenced by code string on a booking (no hard FK)
