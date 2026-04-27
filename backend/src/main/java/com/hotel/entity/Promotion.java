package com.hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "promotions")
@Data
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;             // e.g. SUMMER20, LOYALTY10

    private String description;      // "20% off on all rooms"
    private String type;             // PERCENTAGE, FLAT
    private Double discountValue;    // 20 = 20% or ₹200 flat
    private Integer minLoyaltyPoints; // 0 = available to all
    private LocalDate validFrom;
    private LocalDate validTo;
    private Boolean active = true;
    private Boolean newUserOnly = false; // only for users with 0 confirmed bookings
}