/* ================================
   API URL
   LOCAL  → localhost:8080
   ONLINE → Railway
================================ */

const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:8080/api/appointments"
        : "https://aura-salon-production.up.railway.app/api/appointments";


/* ================================
   APPOINTMENT FORM
================================ */

const form =
    document.getElementById("appointment-form");


form.addEventListener(
    "submit",
    async function (event) {

        // Prevent normal form submission
        event.preventDefault();


        /* ================================
           GET FORM VALUES
        ================================= */

        const name =
            document.getElementById("name").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const service =
            document.getElementById("service").value;

        const date =
            document.getElementById("date").value;

        const time =
            document.getElementById("time").value;


        /* ================================
           CREATE APPOINTMENT OBJECT
        ================================= */

        const appointmentData = {

            customerName: name,

            phone: phone,

            email: email,

            service: service,

            appointmentDate: date,

            appointmentTime: time

        };


        /* ================================
           SEND TO SPRING BOOT
        ================================= */

        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                appointmentData
                            )
                    }
                );


            /* ================================
               SUCCESS
            ================================= */

            if (response.ok) {

                const appointment =
                    await response.json();


                alert(
                    "Appointment request submitted successfully!\n\n" +

                    "Appointment ID: " +
                    appointment.id +

                    "\n\nStatus: " +
                    appointment.status
                );


                // Clear form
                form.reset();

            }


            /* ================================
               SERVER ERROR
            ================================= */

            else {

                alert(
                    "Unable to submit your appointment.\n\n" +
                    "Please try again."
                );

            }

        }


        /* ================================
           CONNECTION ERROR
        ================================= */

        catch (error) {

            console.error(
                "Appointment submission error:",
                error
            );


            alert(
                "Unable to connect to the Aura Salon server.\n\n" +

                "Please make sure the Spring Boot application " +
                "is running."
            );

        }

    }
);