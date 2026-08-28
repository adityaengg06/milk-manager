/* =========================================================
   MILK MANAGER
   AUTHENTICATION GUARD
========================================================= */

(function () {

    const loggedIn =
        localStorage.getItem(
            "milkManagerLoggedIn"
        );


    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    /*
       Login page does not need protection.
    */

    if (
        currentPage === "" ||
        currentPage === "index.html"
    ) {

        /*
           If already logged in,
           go directly to dashboard.
        */

        if (
            loggedIn === "true"
        ) {

            window.location.replace(
                "home.html"
            );

        }

        return;

    }


    /*
       Every other page requires login.
    */

    if (
        loggedIn !== "true"
    ) {

        window.location.replace(
            "index.html"
        );

    }

})();