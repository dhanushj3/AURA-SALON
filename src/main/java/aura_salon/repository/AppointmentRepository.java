package aura_salon.repository;

import aura_salon.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    boolean existsByAppointmentDateAndAppointmentTimeAndStatusAndIdNot(
            String appointmentDate,
            String appointmentTime,
            String status,
            Long id
    );
}