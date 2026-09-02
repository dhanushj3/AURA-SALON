const form = document.getElementById("appointment-form");

form.addEventListener("submit", async function (event) {

    // Prevent normal form submission
    event.preventDefault();


    // Get values from the form
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;


    // Create appointment object
    const appointmentData = {

        customerName: name,

        phone: phone,

        email: email,

        service: service,

        appointmentDate: date,

        appointmentTime: time

    };


    try {

        // Send data to Spring Boot backend
        const response = await fetch(
            "http://localhost:8080/api/appointments",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(appointmentData)
            }
        );


        // Check whether request was successful
        if (response.ok) {

            const appointment = await response.json();


            // Show success message
            alert(
                "Appointment request submitted successfully!\n\n" +

                "Appointment ID: " +
                appointment.id +

                "\n\nStatus: " +
                appointment.status
            );


            // Clear the form
            form.reset();

        } else {

            // Server returned an error
            alert(
                "Unable to submit your appointment.\n\n" +
                "Please try again."
            );

        }

    } catch (error) {

        // Connection error
        console.error("Appointment submission error:", error);

        alert(
            "Unable to connect to the Aura Salon server.\n\n" +

            "Please make sure the Spring Boot application " +
            "is running."
        );

    }

});