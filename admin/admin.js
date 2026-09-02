const API_URL =
    "http://localhost:8080/api/appointments";


/* ================================
   CHECK ADMIN LOGIN
================================ */

const AUTH_HEADER =
    sessionStorage.getItem("adminAuth");


if (!AUTH_HEADER) {

    window.location.href =
        "login.html";
}


/* ================================
   HTML ELEMENTS
================================ */

const tableBody =
    document.getElementById(
        "appointment-table-body"
    );

const totalCount =
    document.getElementById(
        "total-count"
    );

const pendingCount =
    document.getElementById(
        "pending-count"
    );

const approvedCount =
    document.getElementById(
        "approved-count"
    );

const rejectedCount =
    document.getElementById(
        "rejected-count"
    );

const refreshButton =
    document.getElementById(
        "refresh-btn"
    );

const logoutButton =
    document.getElementById(
        "logout-btn"
    );


/* ================================
   LOAD APPOINTMENTS
================================ */

async function loadAppointments() {

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            AUTH_HEADER
                    }
                }
            );


        if (response.status === 401) {

            logout();

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Unable to fetch appointments."
            );
        }


        const appointments =
            await response.json();


        displayAppointments(
            appointments
        );

        updateStatistics(
            appointments
        );


    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    class="table-error">

                    Unable to load appointments.

                </td>
            </tr>
        `;
    }
}


/* ================================
   DISPLAY APPOINTMENTS
================================ */

function displayAppointments(
    appointments
) {

    tableBody.innerHTML = "";


    if (appointments.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    class="empty-table">

                    No appointment requests found.

                </td>
            </tr>
        `;

        return;
    }


    appointments.forEach(
        appointment => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${appointment.id}
                </td>

                <td>
                    ${appointment.customerName}
                </td>

                <td>
                    ${appointment.phone}
                </td>

                <td>
                    ${appointment.service}
                </td>

                <td>
                    ${appointment.appointmentDate}
                </td>

                <td>
                    ${appointment.appointmentTime}
                </td>

                <td>

                    <span class="
                        status
                        ${appointment.status.toLowerCase()}
                    ">

                        ${appointment.status}

                    </span>

                </td>

                <td>

                    ${
                        appointment.status === "PENDING"

                        ?

                        `
                            <button
                                class="action-button approve-button"
                                onclick="
                                    approveAppointment(
                                        ${appointment.id}
                                    )
                                "
                            >
                                Approve
                            </button>

                            <button
                                class="action-button reject-button"
                                onclick="
                                    rejectAppointment(
                                        ${appointment.id}
                                    )
                                "
                            >
                                Reject
                            </button>
                        `

                        :

                        `<span class="completed">
                            Completed
                        </span>`
                    }

                </td>
            `;


            tableBody.appendChild(row);
        }
    );
}


/* ================================
   STATISTICS
================================ */

function updateStatistics(
    appointments
) {

    totalCount.textContent =
        appointments.length;


    pendingCount.textContent =
        appointments.filter(
            appointment =>
                appointment.status === "PENDING"
        ).length;


    approvedCount.textContent =
        appointments.filter(
            appointment =>
                appointment.status === "APPROVED"
        ).length;


    rejectedCount.textContent =
        appointments.filter(
            appointment =>
                appointment.status === "REJECTED"
        ).length;
}


/* ================================
   APPROVE
================================ */

async function approveAppointment(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}/approve`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            AUTH_HEADER
                    }
                }
            );


        const result =
            await response.json();


        if (response.ok) {

            alert(
                "Appointment approved successfully."
            );

            loadAppointments();

        } else if (
            response.status === 409
        ) {

            alert(result.message);

            loadAppointments();

        } else {

            alert(
                result.message ||
                "Unable to approve appointment."
            );
        }


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }
}


/* ================================
   REJECT
================================ */

async function rejectAppointment(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/${id}/reject`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            AUTH_HEADER
                    }
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Unable to reject appointment."
            );

            return;
        }


        alert(
            "Appointment rejected successfully."
        );


        loadAppointments();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );
    }
}


/* ================================
   LOGOUT
================================ */

function logout() {

    sessionStorage.removeItem(
        "adminAuth"
    );

    window.location.href =
        "login.html";
}


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );
}


refreshButton.addEventListener(
    "click",
    loadAppointments
);


/* ================================
   INITIAL LOAD
================================ */

loadAppointments();