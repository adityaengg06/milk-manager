/* =========================================================
   MILK MANAGER
   DAILY DELIVERY SYSTEM
   DATE SELECTABLE
========================================================= */


/* =========================================================
   STATE
========================================================= */

let customers = [];

let currentIndex = 0;


/*
   Selected delivery date.

   Default = today's date.
*/

let selectedDate = getTodayDate();


/* =========================================================
   ELEMENTS
========================================================= */

const customerArea =
    document.getElementById(
        "customerArea"
    );

const completionArea =
    document.getElementById(
        "completionArea"
    );

const customerName =
    document.getElementById(
        "customerName"
    );

const customerPhone =
    document.getElementById(
        "customerPhone"
    );

const customerAddress =
    document.getElementById(
        "customerAddress"
    );

const customerAvatar =
    document.getElementById(
        "customerAvatar"
    );

const milkQuantity =
    document.getElementById(
        "milkQuantity"
    );

const paneerQuantity =
    document.getElementById(
        "paneerQuantity"
    );

const curdQuantity =
    document.getElementById(
        "curdQuantity"
    );

const gheeQuantity =
    document.getElementById(
        "gheeQuantity"
    );

const deliveryProgressText =
    document.getElementById(
        "deliveryProgressText"
    );

const deliveryPercent =
    document.getElementById(
        "deliveryPercent"
    );

const deliveryProgressBar =
    document.getElementById(
        "deliveryProgressBar"
    );

const deliveryDatePicker =
    document.getElementById(
        "deliveryDatePicker"
    );

const deliveryDateText =
    document.getElementById(
        "deliveryDateText"
    );

const todayBtn =
    document.getElementById(
        "todayBtn"
    );


/* =========================================================
   GET TODAY DATE
========================================================= */

function getTodayDate() {

    const d =
        new Date();

    return (
        d.getFullYear() +
        "-" +
        String(
            d.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            d.getDate()
        ).padStart(2, "0")
    );

}


/* =========================================================
   DISPLAY SELECTED DATE
========================================================= */

function displaySelectedDate() {

    if (!deliveryDateText) {
        return;
    }


    const parts =
        selectedDate.split("-");


    if (parts.length !== 3) {
        return;
    }


    const date =
        new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );


    deliveryDateText.textContent =
        date.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    const completionDateText =
        document.getElementById(
            "completionDateText"
        );


    if (completionDateText) {

        completionDateText.textContent =
            `All customers have been processed for ${date.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            )}.`;

    }

}


/* =========================================================
   GET SELECTED DATE RECORD
========================================================= */

function getSelectedDateRecord(
    customerId
) {

    const db =
        getDB();


    if (
        !db ||
        !Array.isArray(
            db.deliveries
        )
    ) {

        return null;

    }


    return db.deliveries.find(
        delivery =>

            String(
                delivery.customerId
            ) ===
            String(customerId)

            &&

            delivery.date ===
            selectedDate

    ) || null;

}


/* =========================================================
   CHECK CUSTOMER COMPLETED
========================================================= */

function isCustomerCompleted(
    customerId
) {

    return Boolean(
        getSelectedDateRecord(
            customerId
        )
    );

}


/* =========================================================
   LOAD CUSTOMERS
========================================================= */

function loadCustomers() {

    customers =
        getCustomers();


    if (
        !Array.isArray(customers)
    ) {

        customers = [];

    }


    if (
        customers.length === 0
    ) {

        if (customerArea) {

            customerArea.style.display =
                "none";

        }


        if (completionArea) {

            completionArea.style.display =
                "block";

        }


        const stats =
            document.getElementById(
                "completionStats"
            );


        if (stats) {

            stats.textContent =
                "No customers available.";

        }


        updateProgress();

        return;

    }


    /*
       Find first pending customer
       for SELECTED DATE.
    */

    const firstPending =
        customers.findIndex(
            customer =>
                !isCustomerCompleted(
                    customer.id
                )
        );


    if (
        firstPending !== -1
    ) {

        currentIndex =
            firstPending;

        renderCustomer();

    }

    else {

        currentIndex =
            customers.length;

        showCompletion();

    }

}


/* =========================================================
   RENDER CUSTOMER
========================================================= */

function renderCustomer() {

    if (
        currentIndex < 0 ||
        currentIndex >=
        customers.length
    ) {

        showCompletion();

        return;

    }


    if (customerArea) {

        customerArea.style.display =
            "block";

    }


    if (completionArea) {

        completionArea.style.display =
            "none";

    }


    const customer =
        customers[
            currentIndex
        ];


    /* NAME */

    if (customerName) {

        customerName.textContent =
            customer.name ||
            "Customer";

    }


    /* PHONE */

    if (customerPhone) {

        customerPhone.textContent =
            "📞 " +
            (
                customer.phone ||
                customer.mobile ||
                "-"
            );

    }


    /* ADDRESS */

    if (customerAddress) {

        customerAddress.textContent =
            customer.address ||
            "Address not available";

    }


    /* AVATAR */

    if (customerAvatar) {

        const name =
            customer.name ||
            "Customer";


        const initials =
            name
                .split(" ")
                .filter(Boolean)
                .map(
                    word =>
                        word[0]
                )
                .join("")
                .substring(0, 2)
                .toUpperCase();


        customerAvatar.textContent =
            initials ||
            "C";

    }


    /*
       GET RECORD FOR SELECTED DATE
    */

    const saved =
        getSelectedDateRecord(
            customer.id
        );


    if (saved) {

        if (milkQuantity) {

            milkQuantity.value =
                saved.milk || 0;

        }


        if (paneerQuantity) {

            paneerQuantity.value =
                saved.paneer || 0;

        }


        if (curdQuantity) {

            curdQuantity.value =
                saved.curd || 0;

        }


        if (gheeQuantity) {

            gheeQuantity.value =
                saved.ghee || 0;

        }

    }

    else {

        /*
           New date = use customer's
           normal milk quantity.
        */

        if (milkQuantity) {

            milkQuantity.value =
                customer.milk ||
                customer.quantity ||
                0;

        }


        if (paneerQuantity) {

            paneerQuantity.value =
                0;

        }


        if (curdQuantity) {

            curdQuantity.value =
                0;

        }


        if (gheeQuantity) {

            gheeQuantity.value =
                0;

        }

    }


    updateProgress();

}


/* =========================================================
   UPDATE PROGRESS
========================================================= */

function updateProgress() {

    const total =
        customers.length;


    let completed = 0;


    customers.forEach(
        customer => {

            if (
                isCustomerCompleted(
                    customer.id
                )
            ) {

                completed++;

            }

        }
    );


    const percent =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    if (deliveryProgressText) {

        deliveryProgressText.textContent =
            `${completed} / ${total} Completed`;

    }


    if (deliveryPercent) {

        deliveryPercent.textContent =
            `${percent}%`;

    }


    if (deliveryProgressBar) {

        deliveryProgressBar.style.width =
            percent + "%";

    }

}


/* =========================================================
   SAVE DELIVERY
========================================================= */

function saveCurrentDelivery(
    status
) {

    const customer =
        customers[
            currentIndex
        ];


    if (!customer) {

        return null;

    }


    const db =
        getDB();


    if (
        !db ||
        !Array.isArray(
            db.deliveries
        )
    ) {

        console.error(
            "Database unavailable."
        );

        return null;

    }


    const existing =
        getSelectedDateRecord(
            customer.id
        );


    const delivery = {

        id:
            existing
                ? existing.id
                : generateID("D"),


        customerId:
            customer.id,


        /*
           IMPORTANT:
           Save SELECTED date,
           not today's date.
        */

        date:
            selectedDate,


        milk:
            status === "not-delivered"
                ? 0
                : Number(
                    milkQuantity
                        ? milkQuantity.value
                        : 0
                ) || 0,


        paneer:
            status === "not-delivered"
                ? 0
                : Number(
                    paneerQuantity
                        ? paneerQuantity.value
                        : 0
                ) || 0,


        curd:
            status === "not-delivered"
                ? 0
                : Number(
                    curdQuantity
                        ? curdQuantity.value
                        : 0
                ) || 0,


        ghee:
            status === "not-delivered"
                ? 0
                : Number(
                    gheeQuantity
                        ? gheeQuantity.value
                        : 0
                ) || 0,


        status:
            status,


        createdAt:
            existing
                ? existing.createdAt
                : new Date().toISOString(),


        updatedAt:
            new Date().toISOString()

    };


    if (existing) {

        const index =
            db.deliveries.findIndex(
                item =>
                    item.id ===
                    existing.id
            );


        if (index !== -1) {

            db.deliveries[index] =
                delivery;

        }

    }

    else {

        db.deliveries.push(
            delivery
        );

    }


    saveDB(db);


    return delivery;

}


/* =========================================================
   NEXT CUSTOMER
========================================================= */

function moveToNextCustomer() {

    let nextIndex =
        currentIndex + 1;


    while (
        nextIndex <
        customers.length
    ) {

        if (
            !isCustomerCompleted(
                customers[nextIndex].id
            )
        ) {

            currentIndex =
                nextIndex;

            renderCustomer();

            return;

        }


        nextIndex++;

    }


    showCompletion();

}


/* =========================================================
   MARK DELIVERED
========================================================= */

function markDelivered() {

    const customer =
        customers[
            currentIndex
        ];


    if (!customer) {

        return;

    }


    saveCurrentDelivery(
        "delivered"
    );


    updateProgress();


    setTimeout(
        function() {

            moveToNextCustomer();

        },
        200
    );

}


/* =========================================================
   MARK NOT DELIVERED
========================================================= */

function markNotDelivered() {

    const customer =
        customers[
            currentIndex
        ];


    if (!customer) {

        return;

    }


    const confirmed =
        confirm(
            `Mark ${customer.name || "customer"} as NOT DELIVERED for ${selectedDate}?`
        );


    if (!confirmed) {

        return;

    }


    saveCurrentDelivery(
        "not-delivered"
    );


    updateProgress();


    setTimeout(
        function() {

            moveToNextCustomer();

        },
        200
    );

}


/* =========================================================
   PREVIOUS CUSTOMER
========================================================= */

function previousCustomer() {

    if (
        currentIndex <= 0
    ) {

        return;

    }


    currentIndex--;

    renderCustomer();

}


/* =========================================================
   QUANTITY BUTTONS
========================================================= */

function setupQuantityButtons(
    minusId,
    inputId,
    plusId,
    step
) {

    const minus =
        document.getElementById(
            minusId
        );

    const input =
        document.getElementById(
            inputId
        );

    const plus =
        document.getElementById(
            plusId
        );


    if (
        !minus ||
        !input ||
        !plus
    ) {

        return;

    }


    minus.addEventListener(
        "click",
        function() {

            let value =
                Number(
                    input.value
                ) || 0;


            value =
                Math.max(
                    0,
                    value - step
                );


            input.value =
                value;

        }
    );


    plus.addEventListener(
        "click",
        function() {

            let value =
                Number(
                    input.value
                ) || 0;


            value += step;


            input.value =
                value;

        }
    );

}


/* =========================================================
   SHOW COMPLETION
========================================================= */

function showCompletion() {

    if (customerArea) {

        customerArea.style.display =
            "none";

    }


    if (completionArea) {

        completionArea.style.display =
            "block";

    }


    let completed = 0;

    let delivered = 0;

    let notDelivered = 0;


    customers.forEach(
        customer => {

            const record =
                getSelectedDateRecord(
                    customer.id
                );


            if (record) {

                completed++;


                if (
                    record.status ===
                    "delivered"
                ) {

                    delivered++;

                }

                else {

                    notDelivered++;

                }

            }

        }
    );


    const stats =
        document.getElementById(
            "completionStats"
        );


    if (stats) {

        stats.innerHTML = `

            <strong>
                ${completed} / ${customers.length}
            </strong>

            <div class="completion-breakdown">

                <span>
                    ✓ Delivered: ${delivered}
                </span>

                <span>
                    ✕ Not Delivered: ${notDelivered}
                </span>

            </div>

        `;

    }


    updateProgress();

}


/* =========================================================
   CHANGE DATE
========================================================= */

function changeDeliveryDate(
    newDate
) {

    if (!newDate) {

        return;

    }


    selectedDate =
        newDate;


    currentIndex = 0;


    displaySelectedDate();

    loadCustomers();

}


/* =========================================================
   DATE PICKER
========================================================= */

if (deliveryDatePicker) {

    deliveryDatePicker.value =
        selectedDate;


    deliveryDatePicker.addEventListener(
        "change",
        function() {

            changeDeliveryDate(
                this.value
            );

        }
    );

}


/* =========================================================
   TODAY BUTTON
========================================================= */

if (todayBtn) {

    todayBtn.addEventListener(
        "click",
        function() {

            const today =
                getTodayDate();


            if (deliveryDatePicker) {

                deliveryDatePicker.value =
                    today;

            }


            changeDeliveryDate(
                today
            );

        }
    );

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

const deliveredBtn =
    document.getElementById(
        "deliveredBtn"
    );


if (deliveredBtn) {

    deliveredBtn.addEventListener(
        "click",
        markDelivered
    );

}


const notDeliveredBtn =
    document.getElementById(
        "notDeliveredBtn"
    );


if (notDeliveredBtn) {

    notDeliveredBtn.addEventListener(
        "click",
        markNotDelivered
    );

}


const previousBtn =
    document.getElementById(
        "previousBtn"
    );


if (previousBtn) {

    previousBtn.addEventListener(
        "click",
        previousCustomer
    );

}


/* =========================================================
   BACK TO HOME
========================================================= */

const backToHomeBtn =
    document.getElementById(
        "backToHomeBtn"
    );


if (backToHomeBtn) {

    backToHomeBtn.addEventListener(
        "click",
        function() {

            /*
               DO NOT LOG OUT.
            */

            window.location.href =
                "home.html";

        }
    );

}


/* =========================================================
   VIEW REPORT
========================================================= */

const viewReportBtn =
    document.getElementById(
        "viewReportBtn"
    );


if (viewReportBtn) {

    viewReportBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "daily-report.html";

        }
    );

}


/* =========================================================
   QUANTITY CONTROLS
========================================================= */

setupQuantityButtons(
    "milkMinus",
    "milkQuantity",
    "milkPlus",
    0.5
);


setupQuantityButtons(
    "paneerMinus",
    "paneerQuantity",
    "paneerPlus",
    0.5
);


setupQuantityButtons(
    "curdMinus",
    "curdQuantity",
    "curdPlus",
    0.5
);


setupQuantityButtons(
    "gheeMinus",
    "gheeQuantity",
    "gheePlus",
    0.5
);


/* =========================================================
   START
========================================================= */

displaySelectedDate();

loadCustomers();
