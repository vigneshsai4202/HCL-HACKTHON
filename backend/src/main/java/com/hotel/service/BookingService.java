package com.hotel.service;

import com.hotel.dto.BookingRequest;
import com.hotel.entity.Booking;
import com.hotel.entity.Room;
import com.hotel.entity.User;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final PromotionService promotionService;
    private final EmailService emailService;

    @Transactional
    public Booking createBooking(BookingRequest request, String userEmail) {
        if (request.getCheckOut() == null || !request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new IllegalArgumentException("Check-out must be after check-in");
        }

        Room room = roomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new RuntimeException("Room not found"));

        // ✅ Check date-based availability — NOT the static flag
        boolean alreadyBooked = bookingRepository.isRoomBookedForDates(
            room.getId(), request.getCheckIn(), request.getCheckOut());

        if (alreadyBooked) {
            throw new RuntimeException("Room is already booked for the selected dates. Please choose different dates.");
        }

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        long nights = request.getCheckIn().until(request.getCheckOut()).getDays();
        double basePrice = room.getPrice() * nights;
        double finalPrice = basePrice;
        String promoUsed = null;

        if (request.getPromoCode() != null && !request.getPromoCode().isBlank()) {
            String normalizedCode = request.getPromoCode().trim().toUpperCase();
            finalPrice = promotionService.applyPromoCode(normalizedCode, basePrice, user.getLoyaltyPoints());
            promoUsed = normalizedCode;
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setStatus("CONFIRMED");
        booking.setTotalPrice(finalPrice);
        booking.setPromoCodeUsed(promoUsed);

        // ✅ No longer touching room.availability — it's date-based now
        user.setLoyaltyPoints(user.getLoyaltyPoints() + 10);
        userRepository.save(user);

        Booking saved = bookingRepository.save(booking);
        emailService.sendBookingConfirmation(saved);
        return saved;
    }

    public List<Booking> getBookingHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public Booking cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        // 1. Only the owner can cancel
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You are not authorized to cancel this booking");
        }

        // 2. Already cancelled
        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking is already cancelled");
        }

        // 3. Cannot cancel a past booking (check-in already passed)
        if (!booking.getCheckIn().isAfter(LocalDate.now())) {
            throw new RuntimeException("Cannot cancel a booking whose check-in date has already passed");
        }

        // 4. Soft-cancel — room is automatically freed because
        //    isRoomBookedForDates() only counts status = 'CONFIRMED'
        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking rebook(Long bookingId, BookingRequest request, String userEmail) {
        Booking past = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        request.setRoomId(past.getRoom().getId());
        return createBooking(request, userEmail);
    }
}
