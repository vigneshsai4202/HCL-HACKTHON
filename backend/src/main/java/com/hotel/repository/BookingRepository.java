package com.hotel.repository;

import com.hotel.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Count confirmed bookings for a user (used for WELCOME15 eligibility)
    long countByUserIdAndStatus(Long userId, String status);

    // Check if a room is already booked for overlapping dates
    // Overlap condition: existing.checkIn < requested.checkOut AND existing.checkOut > requested.checkIn
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.room.id = :roomId " +
           "AND b.status = 'CONFIRMED' " +
           "AND b.checkIn < :checkOut " +
           "AND b.checkOut > :checkIn")
    boolean isRoomBookedForDates(
        @Param("roomId") Long roomId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );

    // Get all booked date ranges for a room (to show on calendar)
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.status = 'CONFIRMED' AND b.checkOut >= :today")
    List<Booking> findActiveBookingsForRoom(
        @Param("roomId") Long roomId,
        @Param("today") LocalDate today
    );
}
