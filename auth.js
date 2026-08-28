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


    /* =========================================================
       PUBLIC PAGES
    ========================================================= */

    const publicPages = [

        "",
        "index.html",
        "create-account.html"

    ];


    /* =========================================================
       LOGIN / CREATE ACCOUNT PAGE
    ========================================================= */

    if (
        publicPages.includes(
            currentPage
        )
    ) {


        /*
           If already logged in,
           don't show login/create account.
        */

        if (
            loggedIn === "true" &&
            (
                currentPage === "" ||
                currentPage === "index.html" ||
                currentPage === "create-account.html"
            )
        ) {

            window.location.replace(
                "home.html"
            );

        }


        return;

    }


    /* =========================================================
       PROTECTED PAGES
    ========================================================= */

    if (
        loggedIn !== "true"
    ) {

        window.location.replace(
            "index.html"
        );

    }


})();