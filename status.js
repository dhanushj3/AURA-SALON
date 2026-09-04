/* ================================
   STATUS API URL
   LOCAL  → localhost:8080
   ONLINE → Railway
================================ */

const STATUS_API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:8080/api/appointments"
        : "https://aura-salon-production.up.railway.app/api/appointments";


/* ================================
   HTML ELEMENTS
================================ */

const statusForm =
    document.getElementById("status-form");

const appointmentIdInput =
    document.getElementById("appointment-id");

const statusMessage =
    document.getElementById("status-message");

const statusResult =
    document.getElementById("status-result");


/* ================================
   CHECK STATUS FORM
================================ */

if (statusForm) {

    statusForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();
            event.stopPropagation();


            /* ================================
               GET APPOINTMENT ID
            ================================= */

            const appointmentId =
                appointmentIdInput.value.trim();


            /* ================================
               VALIDATE ID
            ================================= */

            if (!appointmentId) {

                statusMessage.textContent =
                    "Please enter your Appointment ID.";

                statusMessage.className =
                    "error-message";

                statusResult.innerHTML = "";

                return;
            }


            /* ================================
               LOADING
            ================================= */

            statusMessage.textContent =
                "Checking your appointment...";

            statusMessage.className =
                "loading-message";

            statusResult.innerHTML = "";


            /* ================================
               CALL SPRING BOOT
            ================================= */

            try {

                const response =
                    await fetch(
                        `${STATUS_API_URL}/status/${appointmentId}`,
                        {
                            method: "GET",
                            headers: {
                                "Accept": "application/json"
                            }
                        }
                    );


                /* ================================
                   READ RESPONSE
                ================================= */

                const result =
                    await response.json();


                /* ================================
                   SUCCESS
                ================================= */

                if (response.ok) {

                    statusMessage.textContent =
                        "Appointment details found.";

                    statusMessage.className =
                        "success-message";


                    const appointmentStatus =
                        result.status
                            ? result.status.toLowerCase()
                            : "";


                    statusResult.innerHTML = `

                        <div class="status-result-card">

                            <h3>
                                Appointment Details
                            </h3>


                            <div class="status-detail">

                                <span>
                                    Appointment ID
                                </span>

                                <strong>
                                    ${result.id || ""}
                                </strong>

                            </div>


                            <div class="status-detail">

                                <span>
                                    Customer Name
                                </span>

                                <strong>
                                    ${result.customerName || ""}
                                </strong>

                            </div>


                            <div class="status-detail">

                                <span>
                                    Service
                                </span>

                                <strong>
                                    ${result.service || ""}
                                </strong>

                            </div>


                            <div class="status-detail">

                                <span>
                                    Date
                                </span>

                                <strong>
                                    ${result.appointmentDate || ""}
                                </strong>

                            </div>


                            <div class="status-detail">

                                <span>
                                    Time
                                </span>

                                <strong>
                                    ${result.appointmentTime || ""}
                                </strong>

                            </div>


                            <div class="status-detail">

                                <span>
                                    Status
                                </span>

                                <strong
                                    class="appointment-status ${appointmentStatus}"
                                >
                                    ${result.status || ""}
                                </strong>

                            </div>


                            <div class="status-message-box">

                                <strong>
                                    Message
                                </strong>

                                <p>
                                    ${result.message || ""}
                                </p>

                            </div>

                        </div>

                    `;

                }


                /* ================================
                   APPOINTMENT NOT FOUND
                ================================= */

                else {

                    statusMessage.textContent =
                        result.message ||
                        "Appointment not found.";

                    statusMessage.className =
                        "error-message";

                    statusResult.innerHTML = "";
                }


            }


            /* ================================
               CONNECTION ERROR
            ================================= */

            catch (error) {

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

        }
    );
}