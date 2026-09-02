const loginForm =
    document.getElementById("login-form");

const loginMessage =
    document.getElementById("login-message");


loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;


        /*
         * Test the credentials against
         * the protected admin API.
         */

        const authHeader =
            "Basic " +
            btoa(username + ":" + password);


        loginMessage.textContent =
            "Signing in...";

        loginMessage.className = "";


        try {

            const response =
                await fetch(
                    "https://aura-salon-production.up.railway.app/api/appointments",
                    {
                        method: "GET",

                        headers: {
                            "Authorization": authHeader
                        }
                    }
                );


            if (response.ok) {

                /*
                 * Save credentials temporarily
                 * for the admin dashboard.
                 */

                sessionStorage.setItem(
                    "adminAuth",
                    authHeader
                );


                window.location.href =
                    "admin.html";

            } else {

                loginMessage.textContent =
                    "Invalid username or password.";

                loginMessage.className =
                    "error-message";
            }


        } catch (error) {

            console.error(error);

            loginMessage.textContent =
                "Unable to connect to the Aura Salon server.";

            loginMessage.className =
                "error-message";
        }

    }
);