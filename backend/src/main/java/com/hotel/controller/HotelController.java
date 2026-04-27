package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.entity.Hotel;
import com.hotel.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/hotels")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    // GET /hotels/search?location=Chennai&minPrice=1000&maxPrice=8000&minRating=4.0&amenity=Pool&checkIn=2026-04-20&checkOut=2026-04-23
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Hotel>>> searchHotels(
            @RequestParam String location,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String amenity,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {

        List<Hotel> hotels = hotelService.searchHotels(location, minPrice, maxPrice, minRating, amenity, checkIn, checkOut);

        if (hotels.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse<>(false, "No hotels found matching your filters", hotels));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Hotels found", hotels));
    }
}
