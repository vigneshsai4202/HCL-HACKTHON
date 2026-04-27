package com.hotel.repository;

import com.hotel.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("SELECT DISTINCT h FROM Hotel h WHERE " +
           "LOWER(h.location) LIKE LOWER(CONCAT('%', :location, '%')) " +
           "AND (:minPrice IS NULL OR h.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR h.price <= :maxPrice) " +
           "AND (:minRating IS NULL OR h.rating >= :minRating) " +
           "AND (:amenity IS NULL OR LOWER(h.amenities) LIKE LOWER(CONCAT('%', :amenity, '%'))) " +
           // If dates provided, only show hotels that have at least one room free for those dates
           "AND (:checkIn IS NULL OR :checkOut IS NULL OR EXISTS (" +
           "  SELECT r FROM Room r WHERE r.hotel.id = h.id " +
           "  AND NOT EXISTS (" +
           "    SELECT b FROM Booking b WHERE b.room.id = r.id " +
           "    AND b.status = 'CONFIRMED' " +
           "    AND b.checkIn < :checkOut AND b.checkOut > :checkIn" +
           "  )" +
           "))")
    List<Hotel> searchHotels(
        @Param("location")  String location,
        @Param("minPrice")  Double minPrice,
        @Param("maxPrice")  Double maxPrice,
        @Param("minRating") Double minRating,
        @Param("amenity")   String amenity,
        @Param("checkIn")   LocalDate checkIn,
        @Param("checkOut")  LocalDate checkOut
    );
}
