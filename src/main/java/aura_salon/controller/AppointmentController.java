package aura_salon.controller;

import aura_salon.entity.Appointment;
import aura_salon.repository.AppointmentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {
        "http://localhost:5500",
        "http://127.0.0.1:5500"
})
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;

    public AppointmentController(
            AppointmentRepository appointmentRepository) {

        this.appointmentRepository = appointmentRepository;
    }


    // =====================================================
    // CUSTOMER - CREATE APPOINTMENT
    // =====================================================

    @PostMapping
    public Appointment createAppointment(
            @RequestBody Appointment appointment) {

        appointment.setStatus("PENDING");

        appointment.setMessage(
                "Your appointment request is waiting for confirmation."
        );

        return appointmentRepository.save(appointment);
    }


    // =====================================================
    // ADMIN - GET ALL APPOINTMENTS
    // =====================================================

    @GetMapping
    public List<Appointment> getAllAppointments() {

        return appointmentRepository.findAll();
    }


    // =====================================================
    // CUSTOMER - CHECK APPOINTMENT STATUS
    // =====================================================

    @GetMapping("/status/{id}")
    public ResponseEntity<?> getAppointmentStatus(
            @PathVariable Long id) {

        Optional<Appointment> appointment =
                appointmentRepository.findById(id);

        // Appointment ID does not exist
        if (appointment.isEmpty()) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    "Appointment not found. Please check your Appointment ID."
            );

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);
        }

        Appointment existingAppointment =
                appointment.get();

        // Create customer response
        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "id",
                existingAppointment.getId()
        );

        response.put(
                "customerName",
                existingAppointment.getCustomerName()
        );

        response.put(
                "service",
                existingAppointment.getService()
        );

        response.put(
                "appointmentDate",
                existingAppointment.getAppointmentDate()
        );

        response.put(
                "appointmentTime",
                existingAppointment.getAppointmentTime()
        );

        response.put(
                "status",
                existingAppointment.getStatus()
        );

        response.put(
                "message",
                existingAppointment.getMessage()
        );

        return ResponseEntity.ok(response);
    }


    // =====================================================
    // ADMIN - APPROVE APPOINTMENT
    // =====================================================

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveAppointment(
            @PathVariable Long id) {

        Optional<Appointment> appointment =
                appointmentRepository.findById(id);

        // Appointment ID does not exist
        if (appointment.isEmpty()) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    "Appointment not found."
            );

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);
        }

        Appointment existingAppointment =
                appointment.get();

        // Check whether the requested slot
        // is already approved for another appointment
        boolean slotAlreadyBooked =
                appointmentRepository
                        .existsByAppointmentDateAndAppointmentTimeAndStatusAndIdNot(
                                existingAppointment.getAppointmentDate(),
                                existingAppointment.getAppointmentTime(),
                                "APPROVED",
                                existingAppointment.getId()
                        );

        // -------------------------------------------------
        // SLOT ALREADY BOOKED
        // -------------------------------------------------

        if (slotAlreadyBooked) {

            existingAppointment.setStatus("REJECTED");

            existingAppointment.setMessage(
                    "We're sorry, but this time slot is no longer available. "
                            + "Your appointment request has been rejected. "
                            + "Please choose another date or time."
            );

            appointmentRepository.save(
                    existingAppointment
            );

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "message",
                    existingAppointment.getMessage()
            );

            response.put(
                    "status",
                    "REJECTED"
            );

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);
        }

        // -------------------------------------------------
        // APPOINTMENT APPROVED
        // -------------------------------------------------

        existingAppointment.setStatus("APPROVED");

        existingAppointment.setMessage(
                "Your appointment has been approved successfully."
        );

        Appointment savedAppointment =
                appointmentRepository.save(
                        existingAppointment
                );

        return ResponseEntity.ok(
                savedAppointment
        );
    }


    // =====================================================
    // ADMIN - REJECT APPOINTMENT
    // =====================================================

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectAppointment(
            @PathVariable Long id) {

        Optional<Appointment> appointment =
                appointmentRepository.findById(id);

        // Appointment ID does not exist
        if (appointment.isEmpty()) {

            Map<String, String> error =
                    new HashMap<>();

            error.put(
                    "message",
                    "Appointment not found."
            );

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);
        }

        Appointment existingAppointment =
                appointment.get();

        existingAppointment.setStatus("REJECTED");

        existingAppointment.setMessage(
                "We're sorry, but your appointment request "
                        + "has been rejected. Please choose another "
                        + "date or time."
        );

        Appointment savedAppointment =
                appointmentRepository.save(
                        existingAppointment
                );

        return ResponseEntity.ok(
                savedAppointment
        );
    }
}