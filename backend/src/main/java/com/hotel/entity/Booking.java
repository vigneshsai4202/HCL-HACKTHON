package com.hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status;           // CONFIRMED, CANCELLED
    private Double totalPrice;       // after discount
    private String promoCodeUsed;    // promo code applied
    private LocalDateTime createdAt = LocalDateTime.now();
}
