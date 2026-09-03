/* ================================
   API URL
================================ */

const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:8080/api/appointments"
        : "https://aura-salon-production.up.railway.app/api/appointments";


/* ================================
   HTML ELEMENTS
================================ */

const loginForm =
    document.getElementById("login-form");

const loginMessage =
    document.getElementById("login-message");


/* ================================
   ADMIN LOGIN
================================ */

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const username =
            document.getElementById("username")
                .value
                .trim();


        const password =
            document.getElementById("password")
                .value;


        /* ================================
           CREATE BASIC AUTH HEADER
        ================================= */

        const authHeader =
            "Basic " +
            btoa(
                username + ":" + password
            );


        loginMessage.textContent =
            "Signing in...";

        loginMessage.className = "";


        /* ================================
           TEST ADMIN CREDENTIALS
        ================================= */

        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                authHeader
                        }
                    }
                );


            /* ================================
               LOGIN SUCCESS
            ================================= */

            if (response.ok) {

                /*
                 * Save the Basic Authentication
                 * header temporarily for the
                 * admin dashboard.
                 */

                sessionStorage.setItem(
                    "adminAuth",
                    authHeader
                );


                /*
                 * Redirect to admin dashboard
                 */

                window.location.href =
                    "admin.html";

            }


            /* ================================
               INVALID CREDENTIALS
            ================================= */

            else if (
                response.status === 401
            ) {

                loginMessage.textContent =
                    "Invalid username or password.";

                loginMessage.className =
                    "error-message";
            }


            /* ================================
               OTHER SERVER ERROR
            ================================= */

            else {

                loginMessage.textContent =
                    "Unable to sign in. Please try again.";

                loginMessage.className =
                    "error-message";
            }


        } catch (error) {

            console.error(
                "Admin login error:",
                error
            );


            loginMessage.textContent =
                "Unable to connect to the Aura Salon server.";

            loginMessage.className =
                "error-message";
        }

    }
);