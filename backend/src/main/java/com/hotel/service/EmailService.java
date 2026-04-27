package com.hotel.service;

import com.hotel.entity.Booking;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendBookingConfirmation(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(booking.getUser().getEmail());
            helper.setSubject("✅ Booking Confirmed! Reservation #" + booking.getId() + " - StayEase");
            helper.setFrom("StayEase Bookings <" + System.getProperty("spring.mail.username", "noreply@stayease.com") + ">");
            helper.setText(buildEmailHtml(booking), true); // true = isHtml

            mailSender.send(message);
            System.out.println("✅ Confirmation email sent to: " + booking.getUser().getEmail());

        } catch (Exception e) {
            System.err.println("⚠️ Email send failed (booking still confirmed): " + e.getMessage());
        }
    }

    private String buildEmailHtml(Booking booking) {
        String name        = booking.getUser().getName();
        String hotelName   = booking.getRoom().getHotel().getName();
        String hotelAddr   = booking.getRoom().getHotel().getAddress();
        String roomType    = booking.getRoom().getType();
        String checkIn     = booking.getCheckIn().toString();
        String checkOut    = booking.getCheckOut().toString();
        long   nights      = booking.getCheckIn().until(booking.getCheckOut()).getDays();
        String totalPrice  = "₹" + booking.getTotalPrice();
        String promoUsed   = booking.getPromoCodeUsed() != null ? booking.getPromoCodeUsed() : "None";
        String reservationNo = "STE-" + String.format("%06d", booking.getId());

        return "<!DOCTYPE html>" +
        "<html><head><meta charset='UTF-8'>" +
        "<style>" +
        "  body { margin:0; padding:0; background:#f1f5f9; font-family:'Segoe UI',Arial,sans-serif; }" +
        "  .wrapper { max-width:600px; margin:32px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.10); }" +
        "  .header { background:linear-gradient(135deg,#1e3a8a,#2563eb); padding:36px 32px; text-align:center; }" +
        "  .header h1 { color:#fff; margin:0 0 6px; font-size:26px; letter-spacing:-0.5px; }" +
        "  .header p  { color:#bfdbfe; margin:0; font-size:14px; }" +
        "  .badge { display:inline-block; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); color:#fff; border-radius:20px; padding:6px 18px; font-size:13px; margin-top:14px; }" +
        "  .body { padding:32px; }" +
        "  .greeting { font-size:18px; color:#1e293b; font-weight:700; margin-bottom:6px; }" +
        "  .subtext  { color:#64748b; font-size:14px; margin-bottom:28px; }" +
        "  .res-box  { background:linear-gradient(135deg,#eff6ff,#dbeafe); border:2px solid #bfdbfe; border-radius:12px; padding:20px; text-align:center; margin-bottom:28px; }" +
        "  .res-label{ color:#2563eb; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; }" +
        "  .res-num  { color:#1e3a8a; font-size:28px; font-weight:800; letter-spacing:2px; margin:6px 0 0; }" +
        "  .section  { background:#f8fafc; border-radius:12px; padding:20px; margin-bottom:20px; }" +
        "  .section-title { color:#1e293b; font-size:14px; font-weight:700; margin:0 0 14px; padding-bottom:10px; border-bottom:1px solid #e2e8f0; }" +
        "  .row      { display:flex; justify-content:space-between; margin-bottom:10px; }" +
        "  .row:last-child { margin-bottom:0; }" +
        "  .label    { color:#64748b; font-size:13px; }" +
        "  .value    { color:#1e293b; font-size:13px; font-weight:600; text-align:right; }" +
        "  .divider  { border:none; border-top:1px solid #e2e8f0; margin:0 0 10px; }" +
        "  .total-row{ display:flex; justify-content:space-between; }" +
        "  .total-label{ color:#1e293b; font-size:15px; font-weight:700; }" +
        "  .total-value{ color:#1e3a8a; font-size:18px; font-weight:800; }" +
        "  .promo    { color:#16a34a; font-size:12px; font-weight:600; background:#f0fdf4; border:1px solid #86efac; border-radius:6px; padding:2px 8px; }" +
        "  .cta      { text-align:center; margin:28px 0 8px; }" +
        "  .cta a    { background:linear-gradient(135deg,#2563eb,#7c3aed); color:#fff; text-decoration:none; padding:14px 32px; border-radius:10px; font-weight:700; font-size:15px; display:inline-block; }" +
        "  .footer   { background:#f8fafc; padding:24px 32px; text-align:center; border-top:1px solid #e2e8f0; }" +
        "  .footer p { color:#94a3b8; font-size:12px; margin:4px 0; }" +
        "  .emoji    { font-size:18px; }" +
        "</style></head><body>" +

        "<div class='wrapper'>" +

        // Header
        "<div class='header'>" +
        "  <div style='font-size:36px;margin-bottom:8px;'>🏨</div>" +
        "  <h1>Booking Confirmed!</h1>" +
        "  <p>Your reservation is all set. Have a great stay!</p>" +
        "  <div class='badge'>✅ CONFIRMED</div>" +
        "</div>" +

        // Body
        "<div class='body'>" +
        "  <div class='greeting'>Hi " + name + "! 👋</div>" +
        "  <div class='subtext'>Thank you for choosing StayEase. Here are your booking details:</div>" +

        // Reservation Number
        "  <div class='res-box'>" +
        "    <div class='res-label'>Reservation Number</div>" +
        "    <div class='res-num'>" + reservationNo + "</div>" +
        "  </div>" +

        // Hotel Details
        "  <div class='section'>" +
        "    <div class='section-title'>🏨 Hotel Details</div>" +
        "    <div class='row'><span class='label'>Hotel</span><span class='value'>" + hotelName + "</span></div>" +
        "    <div class='row'><span class='label'>Address</span><span class='value'>" + hotelAddr + "</span></div>" +
        "    <div class='row'><span class='label'>Room Type</span><span class='value'>" + roomType + " Room</span></div>" +
        "  </div>" +

        // Stay Details
        "  <div class='section'>" +
        "    <div class='section-title'>📅 Stay Details</div>" +
        "    <div class='row'><span class='label'>Check-in</span><span class='value'>" + checkIn + "</span></div>" +
        "    <div class='row'><span class='label'>Check-out</span><span class='value'>" + checkOut + "</span></div>" +
        "    <div class='row'><span class='label'>Duration</span><span class='value'>" + nights + " night" + (nights > 1 ? "s" : "") + "</span></div>" +
        "  </div>" +

        // Payment Details
        "  <div class='section'>" +
        "    <div class='section-title'>💰 Payment Summary</div>" +
        "    <div class='row'><span class='label'>Room Price</span><span class='value'>₹" + booking.getRoom().getPrice() + " × " + nights + " nights</span></div>" +
        (!promoUsed.equals("None") ?
        "    <div class='row'><span class='label'>Promo Applied</span><span class='value'><span class='promo'>🏷️ " + promoUsed + "</span></span></div>" : "") +
        "    <hr class='divider'>" +
        "    <div class='total-row'><span class='total-label'>Total Paid</span><span class='total-value'>" + totalPrice + "</span></div>" +
        "  </div>" +

        // CTA
        "  <div class='cta'>" +
        "    <a href='http://localhost:3000'>View My Bookings</a>" +
        "  </div>" +

        // Info note
        "  <p style='color:#94a3b8;font-size:12px;text-align:center;margin-top:16px;'>" +
        "    Need help? Reply to this email or contact our support team." +
        "  </p>" +
        "</div>" +

        // Footer
        "<div class='footer'>" +
        "  <p><strong style='color:#1e293b;'>🏨 StayEase Hotel Booking</strong></p>" +
        "  <p>This is an automated confirmation email. Please save your reservation number.</p>" +
        "  <p style='margin-top:8px;'>© 2026 StayEase. All rights reserved.</p>" +
        "</div>" +

        "</div></body></html>";
    }
}
