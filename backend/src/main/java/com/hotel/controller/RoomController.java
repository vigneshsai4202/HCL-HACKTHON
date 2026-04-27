package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.entity.Room;
import com.hotel.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rooms")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    // GET /rooms/hotel/1?checkIn=2026-04-20&checkOut=2026-04-23
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<ApiResponse<List<Room>>> getAvailableRooms(
            @PathVariable Long hotelId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {

        List<Room> rooms = roomService.getAvailableRooms(hotelId, checkIn, checkOut);
        if (rooms.isEmpty()) {
            return ResponseEntity.ok(new ApiResponse<>(false, "No rooms available for selected dates", rooms));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Available rooms", rooms));
    }

    // GET /rooms/hotel/1/summary?checkIn=2026-04-20&checkOut=2026-04-23
    // Returns live availability count per room type
    @GetMapping("/hotel/{hotelId}/summary")
    public ResponseEntity<ApiResponse<Map<String, Map<String, Long>>>> getAvailabilitySummary(
            @PathVariable Long hotelId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {

        Map<String, Map<String, Long>> summary = roomService.getAvailabilitySummary(hotelId, checkIn, checkOut);
        return ResponseEntity.ok(new ApiResponse<>(true, "Availability summary", summary));
    }
}
