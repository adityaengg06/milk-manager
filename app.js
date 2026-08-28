/* =========================================================
   LOGIN
========================================================= */
/* =========================================================
   MILK MANAGER - NAVIGATION
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
const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const mobile =
                document.getElementById("mobile")
                .value
                .trim();


            const password =
                document.getElementById("password")
                .value
                .trim();


            if (!/^[0-9]{10}$/.test(mobile)) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                return;

            }


            if (password.length === 0) {

                alert(
                    "Please enter your password."
                );

                return;

            }


            /*
             V1 DEMO ACCOUNT

             We will move this to a real
             backend authentication system
             later.
            */

            const DEMO_MOBILE =
                "9999999999";

            const DEMO_PASSWORD =
                "123456";


            if (
                mobile !== DEMO_MOBILE ||
                password !== DEMO_PASSWORD
            ) {

                alert(
                    "Invalid mobile number or password."
                );

                return;

            }


            /*
             SAVE LOGIN SESSION
            */

            localStorage.setItem(
                "milkManagerLoggedIn",
                "true"
            );


            localStorage.setItem(
                "milkManagerUser",
                JSON.stringify({

                    mobile:
                        mobile,

                    loginTime:
                        new Date().toISOString()

                })
            );


            window.location.href =
                "home.html";

        }
    );

}