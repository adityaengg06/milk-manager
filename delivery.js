/* =========================================================
   MILK MANAGER
   DAILY DELIVERY SYSTEM
   ONE CUSTOMER AT A TIME
========================================================= */


/* =========================================================
   STATE
========================================================= */

let customers = [];

let currentIndex = 0;


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


/* =========================================================
   DATE
========================================================= */

function today() {

    const d = new Date();

    const year =
        d.getFullYear();

    const month =
        String(
            d.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            d.getDate()
        ).padStart(2, "0");

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/* =========================================================
   DISPLAY DATE
========================================================= */

function displayToday() {

    const d =
        new Date();

    document.getElementById(
        "deliveryDate"
    ).textContent =
        d.toLocaleDateString(
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
   GET TODAY'S SAVED RECORD
========================================================= */

function getTodayRecord(
    customerId
) {

    const db =
        getDB();

    return db.deliveries.find(
        delivery =>
            String(
                delivery.customerId
            ) ===
            String(customerId)
            &&
            delivery.date ===
            today()
    );

}


/* =========================================================
   CHECK WHETHER CUSTOMER IS COMPLETED
========================================================= */

function isCustomerCompleted(
    customerId
) {

    return Boolean(
        getTodayRecord(
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


    /*
       Keep original customer order.
    */

    if (
        customers.length === 0
    ) {

        customerArea.style.display =
            "none";

        completionArea.style.display =
            "block";

        document.getElementById(
            "completionStats"
        ).textContent =
            "No customers available.";

        return;

    }


    /*
       Find first customer
       who hasn't been processed.
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

    }
    else {

        /*
           Everyone already completed.
        */

        currentIndex =
            customers.length;

        showCompletion();

        return;

    }


    renderCustomer();

}


/* =========================================================
   RENDER CUSTOMER
========================================================= */

function renderCustomer() {

    if (
        currentIndex < 0
    ) {

        currentIndex = 0;

    }


    if (
        currentIndex >=
        customers.length
    ) {

        showCompletion();

        return;

    }


    customerArea.style.display =
        "block";

    completionArea.style.display =
        "none";


    const customer =
        customers[
            currentIndex
        ];


    /* CUSTOMER DETAILS */

    customerName.textContent =
        customer.name ||
        "Customer";


    customerPhone.textContent =
        "📞 " +
        (
            customer.phone ||
            "-"
        );


    customerAddress.textContent =
        customer.address ||
        "Address not available";


    /* AVATAR */

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


    /* DEFAULT MILK */

    const saved =
        getTodayRecord(
            customer.id
        );


    if (saved) {

        milkQuantity.value =
            saved.milk || 0;

        paneerQuantity.value =
            saved.paneer || 0;

        curdQuantity.value =
            saved.curd || 0;

        gheeQuantity.value =
            saved.ghee || 0;

    }
    else {

        milkQuantity.value =
            customer.milk || 0;

        paneerQuantity.value =
            0;

        curdQuantity.value =
            0;

        gheeQuantity.value =
            0;

    }


    updateProgress();

}


/* =========================================================
   PROGRESS
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


    /*
       Current position should represent
       the customer being handled.
    */

    const position =
        Math.min(
            currentIndex + 1,
            total
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


    deliveryProgressText.textContent =
        `${completed} / ${total} Completed`;


    deliveryPercent.textContent =
        `${percent}%`;


    deliveryProgressBar.style.width =
        percent + "%";

}


/* =========================================================
   SAVE CURRENT DELIVERY
========================================================= */

function saveCurrentDelivery(
    status
) {

    const customer =
        customers[
            currentIndex
        ];


    if (!customer) {

        return;

    }


    const existing =
        getTodayRecord(
            customer.id
        );


    /*
       Don't create another record.
       Update today's record if it exists.
    */

    const db =
        getDB();


    const delivery = {

        id:
            existing
                ? existing.id
                : generateID("D"),

        customerId:
            customer.id,

        date:
            today(),

        milk:
            status === "not-delivered"
                ? 0
                : Number(
                    milkQuantity.value
                ) || 0,

        paneer:
            status === "not-delivered"
                ? 0
                : Number(
                    paneerQuantity.value
                ) || 0,

        curd:
            status === "not-delivered"
                ? 0
                : Number(
                    curdQuantity.value
                ) || 0,

        ghee:
            status === "not-delivered"
                ? 0
                : Number(
                    gheeQuantity.value
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
   MOVE TO NEXT CUSTOMER
========================================================= */

function moveToNextCustomer() {

    /*
       Find the next pending customer.
    */

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


    /*
       No more pending customers.
    */

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


    /*
       Small delay makes the
       transition feel natural.
    */

    setTimeout(
        () => {

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


    const confirmSkip =
        confirm(
            `Mark ${customer.name} as NOT DELIVERED today?`
        );


    if (!confirmSkip) {

        return;

    }


    saveCurrentDelivery(
        "not-delivered"
    );


    updateProgress();


    setTimeout(
        () => {

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
   QUANTITY BUTTON
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


    minus.addEventListener(
        "click",
        () => {

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
        () => {

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
   COMPLETION
========================================================= */

function showCompletion() {

    customerArea.style.display =
        "none";

    completionArea.style.display =
        "block";


    let completed = 0;

    let delivered = 0;

    let notDelivered = 0;


    customers.forEach(
        customer => {

            const record =
                getTodayRecord(
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


    document.getElementById(
        "completionStats"
    ).innerHTML = `

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


    updateProgress();

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

document
    .getElementById(
        "deliveredBtn"
    )
    .addEventListener(
        "click",
        markDelivered
    );


document
    .getElementById(
        "notDeliveredBtn"
    )
    .addEventListener(
        "click",
        markNotDelivered
    );


document
    .getElementById(
        "previousBtn"
    )
    .addEventListener(
        "click",
        previousCustomer
    );


document
    .getElementById(
        "backToHomeBtn"
    )
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "index.html";

        }
    );


document
    .getElementById(
        "viewReportBtn"
    )
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "daily-report.html";

        }
    );


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

displayToday();

loadCustomers();
