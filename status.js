const statusForm = document.getElementById("status-form");

const appointmentIdInput =
    document.getElementById("appointment-id");

const statusMessage =
    document.getElementById("status-message");

const statusResult =
    document.getElementById("status-result");


statusForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const appointmentId =
        appointmentIdInput.value.trim();

    if (!appointmentId) {
        statusMessage.textContent =
            "Please enter your Appointment ID.";

        statusMessage.className = "error-message";

        statusResult.innerHTML = "";

        return;
    }

    statusMessage.textContent =
        "Checking your appointment...";

    statusMessage.className = "loading-message";

    statusResult.innerHTML = "";


    try {

        const response = await fetch(
            `http://localhost:8080/api/appointments/status/${appointmentId}`
        );


        const result = await response.json();


        if (response.ok) {

            statusMessage.textContent =
                "Appointment details found.";

            statusMessage.className =
                "success-message";


            statusResult.innerHTML = `

                <div class="status-result-card">

                    <h3>Appointment Details</h3>

                    <div class="status-detail">
                        <span>Appointment ID</span>
                        <strong>${result.id}</strong>
                    </div>

                    <div class="status-detail">
                        <span>Customer Name</span>
                        <strong>${result.customerName}</strong>
                    </div>

                    <div class="status-detail">
                        <span>Service</span>
                        <strong>${result.service}</strong>
                    </div>

                    <div class="status-detail">
                        <span>Date</span>
                        <strong>${result.appointmentDate}</strong>
                    </div>

                    <div class="status-detail">
                        <span>Time</span>
                        <strong>${result.appointmentTime}</strong>
                    </div>

                    <div class="status-detail">
                        <span>Status</span>
                        <strong class="appointment-status ${result.status.toLowerCase()}">
                            ${result.status}
                        </strong>
                    </div>

                    <div class="status-message-box">
                        <strong>Message</strong>
                        <p>${result.message}</p>
                    </div>

                </div>

            `;

        } else {

            statusMessage.textContent =
                result.message ||
                "Appointment not found.";

            statusMessage.className =
                "error-message";

            statusResult.innerHTML = "";
        }


    } catch (error) {

        console.error(
            "Status check error:",
            error
        );

        statusMessage.textContent =
            "Unable to connect to the Aura Salon server.";

        statusMessage.className =
            "error-message";

        statusResult.innerHTML = "";
    }

});