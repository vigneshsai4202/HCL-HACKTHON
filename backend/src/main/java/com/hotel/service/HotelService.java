package com.hotel.service;

import com.hotel.entity.Hotel;
import com.hotel.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    public List<Hotel> searchHotels(String location, Double minPrice, Double maxPrice,
                                     Double minRating, String amenity,
                                     LocalDate checkIn, LocalDate checkOut) {
        return hotelRepository.searchHotels(location, minPrice, maxPrice, minRating, amenity, checkIn, checkOut);
    }
}
