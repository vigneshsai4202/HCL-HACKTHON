package com.hotel.service;

import com.hotel.entity.Room;
import com.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<Room> getAvailableRooms(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        if (checkIn != null && checkOut != null && checkOut.isAfter(checkIn)) {
            return roomRepository.findAvailableRooms(hotelId, checkIn, checkOut);
        }
        return roomRepository.findByHotelId(hotelId);
    }

    // Returns live availability summary: { SINGLE: {total:4, available:3}, DOUBLE: {...}, SUITE: {...} }
    public Map<String, Map<String, Long>> getAvailabilitySummary(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        // Total rooms per type
        List<Object[]> totals = roomRepository.countTotalByType(hotelId);
        Map<String, Long> totalMap = new LinkedHashMap<>();
        for (Object[] row : totals) {
            totalMap.put((String) row[0], (Long) row[1]);
        }

        // Available rooms per type for given dates
        Map<String, Long> availableMap = new LinkedHashMap<>();
        if (checkIn != null && checkOut != null && checkOut.isAfter(checkIn)) {
            List<Object[]> available = roomRepository.countAvailableByType(hotelId, checkIn, checkOut);
            for (Object[] row : available) {
                availableMap.put((String) row[0], (Long) row[1]);
            }
        } else {
            // No dates — all rooms are "available"
            availableMap.putAll(totalMap);
        }

        // Build result map
        Map<String, Map<String, Long>> result = new LinkedHashMap<>();
        for (String type : totalMap.keySet()) {
            Map<String, Long> info = new LinkedHashMap<>();
            info.put("total", totalMap.get(type));
            info.put("available", availableMap.getOrDefault(type, 0L));
            result.put(type, info);
        }
        return result;
    }
}
