/* =========================================================
   MILK MANAGER
   MAIN APP.JS
========================================================= */


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function goTo(page) {

    console.log("Opening:", page);

    window.location.href = page;

}


/* =========================================================
   TEST BUTTON
========================================================= */

function testButton() {

    alert("JavaScript is working!");

}


/* =========================================================
   CREATE ACCOUNT
========================================================= */

const createAccountForm =
    document.getElementById(
        "createAccountForm"
    );


if (createAccountForm) {

    createAccountForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            /* -----------------------------------------
               GET VALUES
            ----------------------------------------- */

            const name =
                document
                .getElementById("ownerName")
                .value
                .trim();


            const businessName =
                document
                .getElementById("businessName")
                .value
                .trim();


            const mobile =
                document
                .getElementById("accountMobile")
                .value
                .trim();


            const password =
                document
                .getElementById("accountPassword")
                .value;


            const confirmPassword =
                document
                .getElementById("confirmPassword")
                .value;


            /* -----------------------------------------
               NAME VALIDATION
            ----------------------------------------- */

            if (name.length < 2) {

                alert(
                    "Please enter your name."
                );

                return;

            }


            /* -----------------------------------------
               BUSINESS VALIDATION
            ----------------------------------------- */

            if (businessName.length < 2) {

                alert(
                    "Please enter your business name."
                );

                return;

            }


            /* -----------------------------------------
               MOBILE VALIDATION
            ----------------------------------------- */

            if (
                !/^[0-9]{10}$/.test(
                    mobile
                )
            ) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                return;

            }


            /* -----------------------------------------
               PASSWORD VALIDATION
            ----------------------------------------- */

            if (
                password.length < 6
            ) {

                alert(
                    "Password must contain at least 6 characters."
                );

                return;

            }


            /* -----------------------------------------
               CONFIRM PASSWORD
            ----------------------------------------- */

            if (
                password !==
                confirmPassword
            ) {

                alert(
                    "Passwords do not match."
                );

                return;

            }


            /* -----------------------------------------
               CHECK EXISTING ACCOUNT
            ----------------------------------------- */

            const existingAccount =
                localStorage.getItem(
                    "milkManagerAccount"
                );


            if (existingAccount) {

                let oldAccount;


                try {

                    oldAccount =
                        JSON.parse(
                            existingAccount
                        );

                }

                catch (error) {

                    oldAccount = null;

                }


                if (
                    oldAccount &&
                    oldAccount.mobile === mobile
                ) {

                    alert(
                        "An account with this mobile number already exists."
                    );

                    return;

                }


                alert(
                    "An account already exists on this device. Please login."
                );

                return;

            }


            /* -----------------------------------------
               CREATE ACCOUNT OBJECT
            ----------------------------------------- */

            const newAccount = {

                name:
                    name,

                businessName:
                    businessName,

                mobile:
                    mobile,

                password:
                    password,

                createdAt:
                    new Date().toISOString()

            };


            /* -----------------------------------------
               SAVE ACCOUNT
            ----------------------------------------- */

            try {

                localStorage.setItem(
                    "milkManagerAccount",
                    JSON.stringify(
                        newAccount
                    )
                );

            }

            catch (error) {

                alert(
                    "Unable to save account on this browser."
                );

                console.error(
                    error
                );

                return;

            }


            /* -----------------------------------------
               SUCCESS
            ----------------------------------------- */

            alert(
                "Account created successfully!"
            );


            /* Make sure user is logged out */

            localStorage.removeItem(
                "milkManagerLoggedIn"
            );


            localStorage.removeItem(
                "milkManagerUser"
            );


            /* Go to login */

            window.location.href =
                "index.html";

        }
    );

}


/* =========================================================
   LOGIN
========================================================= */

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const mobile =
                document
                .getElementById("mobile")
                .value
                .trim();


            const password =
                document
                .getElementById("password")
                .value;


            /* -----------------------------------------
               MOBILE VALIDATION
            ----------------------------------------- */

            if (
                !/^[0-9]{10}$/.test(
                    mobile
                )
            ) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                return;

            }


            /* -----------------------------------------
               PASSWORD VALIDATION
            ----------------------------------------- */

            if (
                password.length === 0
            ) {

                alert(
                    "Please enter your password."
                );

                return;

            }


            /* -----------------------------------------
               GET ACCOUNT
            ----------------------------------------- */

            const savedAccount =
                localStorage.getItem(
                    "milkManagerAccount"
                );


            if (!savedAccount) {

                alert(
                    "No account found. Please create an account first."
                );

                return;

            }


            let account;


            try {

                account =
                    JSON.parse(
                        savedAccount
                    );

            }

            catch (error) {

                alert(
                    "Account data is invalid."
                );

                return;

            }


            /* -----------------------------------------
               CHECK DETAILS
            ----------------------------------------- */

            if (
                mobile !== account.mobile ||
                password !== account.password
            ) {

                alert(
                    "Invalid mobile number or password."
                );

                return;

            }


            /* -----------------------------------------
               LOGIN SUCCESS
            ----------------------------------------- */

            localStorage.setItem(
                "milkManagerLoggedIn",
                "true"
            );


            localStorage.setItem(
                "milkManagerUser",
                JSON.stringify({

                    name:
                        account.name,

                    businessName:
                        account.businessName,

                    mobile:
                        account.mobile,

                    loginTime:
                        new Date().toISOString()

                })
            );


            window.location.href =
                "home.html";

        }
    );

}


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

const togglePassword =
    document.getElementById(
        "togglePassword"
    );


if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function() {

            const password =
                document.getElementById(
                    "password"
                );


            if (!password) {

                return;

            }


            if (
                password.type ===
                "password"
            ) {

                password.type =
                    "text";

                togglePassword.textContent =
                    "🙈";

            }

            else {

                password.type =
                    "password";

                togglePassword.textContent =
                    "👁️";

            }

        }
    );

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

const forgotPassword =
    document.getElementById(
        "forgotPassword"
    );


if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            alert(
                "Password recovery will be added with the backend."
            );

        }
    );

}


/* =========================================================
   LOGOUT
========================================================= */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            localStorage.removeItem(
                "milkManagerLoggedIn"
            );


            localStorage.removeItem(
                "milkManagerUser"
            );


            window.location.href =
                "index.html";

        }
    );

}


/* =========================================================
   DATE
========================================================= */

function updateDate() {

    const dateElement =
        document.getElementById(
            "currentDate"
        );


    if (!dateElement) {

        return;

    }


    const now =
        new Date();


    dateElement.textContent =
        now.toLocaleDateString(
            "en-IN",
            {

                weekday:
                    "long",

                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"

            }
        );

}


updateDate();


/* =========================================================
   GREETING
========================================================= */

function updateGreeting() {

    const greetingElement =
        document.getElementById(
            "greeting"
        );


    if (!greetingElement) {

        return;

    }


    const hour =
        new Date().getHours();


    if (hour < 12) {

        greetingElement.textContent =
            "Good Morning 👋";

    }

    else if (hour < 17) {

        greetingElement.textContent =
            "Good Afternoon 👋";

    }

    else {

        greetingElement.textContent =
            "Good Evening 👋";

    }

}


updateGreeting();


/* =========================================================
   REPORT DATE
========================================================= */

const reportDate =
    document.getElementById(
        "reportDate"
    );


if (reportDate) {

    const now =
        new Date();


    reportDate.textContent =
        now.toLocaleDateString(
            "en-IN",
            {

                weekday:
                    "long",

                day:
                    "numeric",

                month:
                    "long",

                year:
                    "numeric"

            }
        );

}
