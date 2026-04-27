package com.hotel.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "hotels")
@Data
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private String address;
    private Double price;
    private Double rating;

    // Comma-separated: "WiFi,Pool,Gym,Parking,Restaurant,AC,Spa"
    private String amenities;
    private String imageUrl;
}
