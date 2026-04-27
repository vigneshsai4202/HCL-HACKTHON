package com.hotel.repository;

import com.hotel.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    // Available rooms for given dates
    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId " +
           "AND NOT EXISTS (" +
           "  SELECT b FROM Booking b WHERE b.room.id = r.id " +
           "  AND b.status = 'CONFIRMED' " +
           "  AND b.checkIn < :checkOut " +
           "  AND b.checkOut > :checkIn" +
           ")")
    List<Room> findAvailableRooms(
        @Param("hotelId") Long hotelId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );

    // All rooms for a hotel
    List<Room> findByHotelId(Long hotelId);

    // Count total rooms per type for a hotel
    @Query("SELECT r.type, COUNT(r) FROM Room r WHERE r.hotel.id = :hotelId GROUP BY r.type")
    List<Object[]> countTotalByType(@Param("hotelId") Long hotelId);

    // Count available rooms per type for given dates
    @Query("SELECT r.type, COUNT(r) FROM Room r WHERE r.hotel.id = :hotelId " +
           "AND NOT EXISTS (" +
           "  SELECT b FROM Booking b WHERE b.room.id = r.id " +
           "  AND b.status = 'CONFIRMED' " +
           "  AND b.checkIn < :checkOut " +
           "  AND b.checkOut > :checkIn" +
           ") GROUP BY r.type")
    List<Object[]> countAvailableByType(
        @Param("hotelId") Long hotelId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );
}
