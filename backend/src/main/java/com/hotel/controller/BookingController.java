package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.BookingRequest;
import com.hotel.entity.Booking;
import com.hotel.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // POST /bookings  (JWT required)
    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal String userEmail) {
        try {
            Booking booking = bookingService.createBooking(request, userEmail);
            return ResponseEntity.ok(new ApiResponse<>(true, "Booking confirmed! 🎉", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // GET /bookings/history  (JWT required)
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<Booking>>> getHistory(
            @AuthenticationPrincipal String userEmail) {
        List<Booking> history = bookingService.getBookingHistory(userEmail);
        return ResponseEntity.ok(new ApiResponse<>(true, "Booking history", history));
    }

    // DELETE /bookings/{id}/cancel  (JWT required)
    @DeleteMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<Booking>> cancelBooking(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal String userEmail) {
        try {
            Booking booking = bookingService.cancelBooking(bookingId, userEmail);
            return ResponseEntity.ok(new ApiResponse<>(true, "Booking cancelled successfully", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    // POST /bookings/rebook/{id}  (JWT required)
    @PostMapping("/rebook/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> rebook(
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal String userEmail) {
        try {
            Booking booking = bookingService.rebook(bookingId, request, userEmail);
            return ResponseEntity.ok(new ApiResponse<>(true, "Rebooked successfully! 🎉", booking));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
