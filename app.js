/* =========================================================
   MILK MANAGER
   MAIN APPLICATION JAVASCRIPT
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
   LOGIN
========================================================= */

const loginForm =
    document.getElementById("loginForm");


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
                .value
                .trim();


            /* -----------------------------------------
               VALIDATE MOBILE
            ----------------------------------------- */

            if (!/^[0-9]{10}$/.test(mobile)) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                return;

            }


            /* -----------------------------------------
               VALIDATE PASSWORD
            ----------------------------------------- */

            if (password.length === 0) {

                alert(
                    "Please enter your password."
                );

                return;

            }


            /* -----------------------------------------
               GET CREATED ACCOUNT
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
                    JSON.parse(savedAccount);

            }

            catch (error) {

                alert(
                    "Account data is corrupted. Please create the account again."
                );

                return;

            }


            /* -----------------------------------------
               CHECK LOGIN DETAILS
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
                password.type === "password"
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
        function() {

            alert(
                "Password recovery will be connected to the backend."
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


    const options = {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric"

    };


    dateElement.textContent =
        now.toLocaleDateString(
            "en-IN",
            options
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

                weekday: "long",

                day: "numeric",

                month: "long",

                year: "numeric"

            }
        );

}


/* =========================================================
   CUSTOMER SEARCH
========================================================= */

const customerSearch =
    document.getElementById(
        "customerSearch"
    );


if (customerSearch) {

    customerSearch.addEventListener(
        "input",
        function() {

            const search =
                customerSearch
                .value
                .toLowerCase()
                .trim();


            const cards =
                document.querySelectorAll(
                    ".customer-card"
                );


            cards.forEach(
                function(card) {

                    const nameElement =
                        card.querySelector(
                            ".customer-info strong"
                        );


                    const addressElement =
                        card.querySelector(
                            ".customer-info small"
                        );


                    const name =
                        nameElement
                        ? nameElement.textContent.toLowerCase()
                        : "";


                    const address =
                        addressElement
                        ? addressElement.textContent.toLowerCase()
                        : "";


                    if (
                        name.includes(search) ||
                        address.includes(search)
                    ) {

                        card.style.display =
                            "flex";

                    }

                    else {

                        card.style.display =
                            "none";

                    }

                }
            );

        }
    );

}


/* =========================================================
   MILK QUANTITY
========================================================= */

let milkQuantity = 2;


function changeMilk(amount) {

    milkQuantity += amount;


    if (milkQuantity < 0) {

        milkQuantity = 0;

    }


    if (milkQuantity > 20) {

        milkQuantity = 20;

    }


    const qty =
        document.getElementById(
            "milkQty"
        );


    const amountElement =
        document.getElementById(
            "milkAmount"
        );


    if (qty) {

        qty.textContent =
            milkQuantity;

    }


    if (amountElement) {

        amountElement.textContent =
            milkQuantity + " L";

    }

}


/* =========================================================
   MARK DELIVERED
========================================================= */

const deliverButton =
    document.getElementById(
        "deliverButton"
    );


if (deliverButton) {

    deliverButton.addEventListener(
        "click",
        function() {

            deliverButton.textContent =
                "✓ DELIVERED";


            deliverButton.classList.add(
                "delivered-done"
            );


            alert(
                "Milk delivery marked as completed."
            );

        }
    );

}


/* =========================================================
   NOT DELIVERED
========================================================= */

const skipButton =
    document.getElementById(
        "skipButton"
    );


if (skipButton) {

    skipButton.addEventListener(
        "click",
        function() {

            const reason =
                prompt(
                    "Reason for not delivering:"
                );


            if (reason === null) {

                return;

            }


            alert(
                "Delivery skipped.\nReason: " +
                (
                    reason ||
                    "Not specified"
                )
            );

        }
    );

}


/* =========================================================
   NOTIFICATION
========================================================= */

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );


if (notificationBtn) {

    notificationBtn.addEventListener(
        "click",
        function() {

            alert(
                "You have 6 pending deliveries today."
            );

        }
    );

}


/* =========================================================
   ADD CUSTOMER
========================================================= */

const addButton =
    document.querySelector(
        ".add-btn"
    );


if (addButton) {

    addButton.addEventListener(
        "click",
        function() {

            alert(
                "Add Customer form will be connected in the next version."
            );

        }
    );

}