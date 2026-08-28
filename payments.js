/* =====================================================
   MILK MANAGER
   PAYMENTS MODULE
   ===================================================== */


/* =====================================================
   STORAGE
===================================================== */

const CUSTOMER_STORAGE_KEY =
    "milkManagerCustomers";

const PAYMENT_STORAGE_KEY =
    "milkManagerPayments";

const OUTSTANDING_STORAGE_KEY =
    "milkManagerOutstanding";


/* =====================================================
   GET CUSTOMERS
===================================================== */

function getCustomers() {

    const data =
        localStorage.getItem(
            CUSTOMER_STORAGE_KEY
        );

    if (!data) {
        return [];
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Customer data error:",
            error
        );

        return [];

    }
}


/* =====================================================
   GET PAYMENTS
===================================================== */

function getPayments() {

    const data =
        localStorage.getItem(
            PAYMENT_STORAGE_KEY
        );

    if (!data) {
        return [];
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Payment data error:",
            error
        );

        return [];

    }
}


/* =====================================================
   SAVE PAYMENTS
===================================================== */

function savePayments(payments) {

    localStorage.setItem(
        PAYMENT_STORAGE_KEY,
        JSON.stringify(payments)
    );

}


/* =====================================================
   GET OUTSTANDING DATA
===================================================== */

function getOutstandingData() {

    const data =
        localStorage.getItem(
            OUTSTANDING_STORAGE_KEY
        );

    if (!data) {
        return {};
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        return {};

    }
}


/* =====================================================
   SAVE OUTSTANDING DATA
===================================================== */

function saveOutstandingData(data) {

    localStorage.setItem(
        OUTSTANDING_STORAGE_KEY,
        JSON.stringify(data)
    );

}


/* =====================================================
   PAGE ELEMENTS
===================================================== */

const collectPaymentBtn =
    document.getElementById(
        "collectPaymentBtn"
    );

const paymentModal =
    document.getElementById(
        "paymentModal"
    );

const closePaymentModal =
    document.getElementById(
        "closePaymentModal"
    );

const cancelPaymentBtn =
    document.getElementById(
        "cancelPaymentBtn"
    );

const paymentForm =
    document.getElementById(
        "paymentForm"
    );

const paymentCustomer =
    document.getElementById(
        "paymentCustomer"
    );

const paymentAmount =
    document.getElementById(
        "paymentAmount"
    );

const paymentMode =
    document.getElementById(
        "paymentMode"
    );

const paymentNote =
    document.getElementById(
        "paymentNote"
    );

const customerOutstanding =
    document.getElementById(
        "customerOutstanding"
    );

const totalOutstanding =
    document.getElementById(
        "totalOutstanding"
    );

const todayCollected =
    document.getElementById(
        "todayCollected"
    );

const paymentCustomerList =
    document.getElementById(
        "paymentCustomerList"
    );

const paymentCustomerCount =
    document.getElementById(
        "paymentCustomerCount"
    );

const paymentSearch =
    document.getElementById(
        "paymentSearch"
    );


/* =====================================================
   OPEN PAYMENT MODAL
===================================================== */

function openPaymentModal() {

    loadCustomerDropdown();

    paymentModal.classList.add("show");

}


/* =====================================================
   CLOSE PAYMENT MODAL
===================================================== */

function closePaymentModalFunction() {

    paymentModal.classList.remove("show");

    paymentForm.reset();

    customerOutstanding.textContent =
        "₹0";

}


/* =====================================================
   BUTTON EVENTS
===================================================== */

if (collectPaymentBtn) {

    collectPaymentBtn.addEventListener(
        "click",
        openPaymentModal
    );

}


if (closePaymentModal) {

    closePaymentModal.addEventListener(
        "click",
        closePaymentModalFunction
    );

}


if (cancelPaymentBtn) {

    cancelPaymentBtn.addEventListener(
        "click",
        closePaymentModalFunction
    );

}


/* =====================================================
   CLOSE MODAL OUTSIDE
===================================================== */

if (paymentModal) {

    paymentModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === paymentModal
            ) {

                closePaymentModalFunction();

            }

        }
    );

}


/* =====================================================
   LOAD CUSTOMER DROPDOWN
===================================================== */

function loadCustomerDropdown() {

    const customers =
        getCustomers();

    paymentCustomer.innerHTML = `

        <option value="">
            Select customer
        </option>

    `;


    customers
        .filter(
            customer =>
                customer.status !== "inactive"
        )
        .forEach(customer => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                customer.id;

            option.textContent =
                customer.name;

            paymentCustomer.appendChild(
                option
            );

        });

}


/* =====================================================
   CUSTOMER SELECTED
===================================================== */

if (paymentCustomer) {

    paymentCustomer.addEventListener(
        "change",
        function() {

            const customerId =
                paymentCustomer.value;

            if (!customerId) {

                customerOutstanding.textContent =
                    "₹0";

                return;

            }


            const outstanding =
                getCustomerOutstanding(
                    customerId
                );


            customerOutstanding.textContent =
                formatCurrency(
                    outstanding
                );

        }
    );

}


/* =====================================================
   GET CUSTOMER OUTSTANDING
===================================================== */

function getCustomerOutstanding(
    customerId
) {

    const outstandingData =
        getOutstandingData();

    const value =
        Number(
            outstandingData[customerId] || 0
        );

    return Math.max(
        0,
        value
    );

}


/* =====================================================
   SET CUSTOMER OUTSTANDING
===================================================== */

function setCustomerOutstanding(
    customerId,
    amount
) {

    const outstandingData =
        getOutstandingData();

    outstandingData[customerId] =
        Math.max(
            0,
            Number(amount)
        );

    saveOutstandingData(
        outstandingData
    );

}


/* =====================================================
   FORMAT CURRENCY
===================================================== */

function formatCurrency(amount) {

    return "₹" +
        Number(amount || 0)
            .toLocaleString(
                "en-IN"
            );

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =====================================================
   IS TODAY
===================================================== */

function isToday(dateString) {

    const paymentDate =
        new Date(dateString);

    const today =
        new Date();


    return (

        paymentDate.getDate() ===
            today.getDate()

        &&

        paymentDate.getMonth() ===
            today.getMonth()

        &&

        paymentDate.getFullYear() ===
            today.getFullYear()

    );

}


/* =====================================================
   PAYMENT FORM SUBMIT
===================================================== */

if (paymentForm) {

    paymentForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const customerId =
                paymentCustomer.value;


            const amount =
                Number(
                    paymentAmount.value
                );


            const mode =
                paymentMode.value;


            const note =
                paymentNote.value.trim();


            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */

            if (!customerId) {

                alert(
                    "Please select a customer."
                );

                return;

            }


            if (
                !amount ||
                amount <= 0
            ) {

                alert(
                    "Please enter a valid payment amount."
                );

                return;

            }


            if (!mode) {

                alert(
                    "Please select payment mode."
                );

                return;

            }


            /* -----------------------------------------
               FIND CUSTOMER
            ----------------------------------------- */

            const customers =
                getCustomers();

            const customer =
                customers.find(
                    item =>
                        item.id === customerId
                );


            if (!customer) {

                alert(
                    "Customer not found."
                );

                return;

            }


            /* -----------------------------------------
               CURRENT OUTSTANDING
            ----------------------------------------- */

            const currentOutstanding =
                getCustomerOutstanding(
                    customerId
                );


            /*
             * If an outstanding amount exists,
             * don't allow payment above it.
             */

            if (
                currentOutstanding > 0 &&
                amount > currentOutstanding
            ) {

                alert(
                    `Outstanding is only ${formatCurrency(
                        currentOutstanding
                    )}.`
                );

                return;

            }


            /* -----------------------------------------
               CREATE PAYMENT
            ----------------------------------------- */

            const payment = {

                id:
                    "PAY-" +
                    Date.now(),

                customerId:
                    customer.id,

                customerName:
                    customer.name,

                amount:
                    amount,

                mode:
                    mode,

                note:
                    note,

                date:
                    new Date().toISOString()

            };


            /* -----------------------------------------
               SAVE PAYMENT
            ----------------------------------------- */

            const payments =
                getPayments();

            payments.unshift(
                payment
            );

            savePayments(
                payments
            );


            /* -----------------------------------------
               UPDATE OUTSTANDING
            ----------------------------------------- */

            if (currentOutstanding > 0) {

                const newOutstanding =
                    currentOutstanding -
                    amount;

                setCustomerOutstanding(
                    customerId,
                    newOutstanding
                );

            }


            /* -----------------------------------------
               CLOSE MODAL
            ----------------------------------------- */

            closePaymentModalFunction();


            /* -----------------------------------------
               REFRESH PAGE
            ----------------------------------------- */

            renderPayments();


            /* -----------------------------------------
               SUCCESS
            ----------------------------------------- */

            alert(
                `${formatCurrency(amount)} payment received from ${customer.name}.`
            );

        }
    );

}


/* =====================================================
   RENDER PAYMENT CUSTOMERS
===================================================== */

function renderPayments(
    searchText = ""
) {

    const customers =
        getCustomers();

    const payments =
        getPayments();


    paymentCustomerList.innerHTML =
        "";


    const search =
        searchText
            .toLowerCase()
            .trim();


    const filteredCustomers =
        customers.filter(
            customer => {

                if (!search) {
                    return true;
                }


                return (

                    customer.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    customer.mobile
                        .includes(search)

                    ||

                    customer.address
                        .toLowerCase()
                        .includes(search)

                );

            }
        );


    paymentCustomerCount.textContent =
        `${filteredCustomers.length} Customer${
            filteredCustomers.length !== 1
            ? "s"
            : ""
        }`;


    /* -----------------------------------------
       EMPTY
    ----------------------------------------- */

    if (
        filteredCustomers.length === 0
    ) {

        paymentCustomerList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    💰
                </div>

                <h3>
                    No customers found
                </h3>

                <p>
                    Add customers first to
                    collect payments.
                </p>

            </div>

        `;

        updatePaymentSummary();

        return;

    }


    /* -----------------------------------------
       CUSTOMER CARDS
    ----------------------------------------- */

    filteredCustomers.forEach(
        customer => {

            const customerPayments =
                payments.filter(
                    payment =>
                        payment.customerId ===
                        customer.id
                );


            const totalPaid =
                customerPayments.reduce(
                    (
                        total,
                        payment
                    ) =>
                        total +
                        Number(
                            payment.amount
                        ),
                    0
                );


            const lastPayment =
                customerPayments.length > 0
                    ? customerPayments[0]
                    : null;


            const outstanding =
                getCustomerOutstanding(
                    customer.id
                );


            const initials =
                customer.name
                    .split(" ")
                    .map(
                        word =>
                            word.charAt(0)
                    )
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "payment-customer-card";


            card.innerHTML = `

                <div class="payment-avatar">
                    ${initials}
                </div>


                <div class="payment-customer-info">

                    <h3>
                        ${escapeHTML(
                            customer.name
                        )}
                    </h3>

                    <p>
                        📞 ${escapeHTML(
                            customer.mobile
                        )}
                    </p>


                    ${
                        lastPayment
                        ?

                        `<small>
                            Last payment:
                            ${formatCurrency(
                                lastPayment.amount
                            )}
                            •
                            ${formatDate(
                                lastPayment.date
                            )}
                        </small>`

                        :

                        `<small>
                            No payments recorded
                        </small>`
                    }

                </div>


                <div class="payment-customer-right">

                    <strong>
                        ${formatCurrency(
                            outstanding
                        )}
                    </strong>

                    <span>
                        Outstanding
                    </span>

                    <button
                        class="small-pay-btn"
                        data-id="${customer.id}"
                    >
                        Collect
                    </button>

                </div>

            `;


            const collectButton =
                card.querySelector(
                    ".small-pay-btn"
                );


            collectButton.addEventListener(
                "click",
                function() {

                    openPaymentModal();


                    paymentCustomer.value =
                        customer.id;


                    customerOutstanding.textContent =
                        formatCurrency(
                            getCustomerOutstanding(
                                customer.id
                            )
                        );

                }
            );


            paymentCustomerList.appendChild(
                card
            );

        }
    );


    updatePaymentSummary();

}


/* =====================================================
   PAYMENT SUMMARY
===================================================== */

function updatePaymentSummary() {

    const customers =
        getCustomers();

    const payments =
        getPayments();


    /* -----------------------------------------
       TOTAL OUTSTANDING
    ----------------------------------------- */

    let outstandingTotal = 0;


    customers.forEach(
        customer => {

            outstandingTotal +=
                getCustomerOutstanding(
                    customer.id
                );

        }
    );


    totalOutstanding.textContent =
        formatCurrency(
            outstandingTotal
        );


    /* -----------------------------------------
       TODAY'S COLLECTION
    ----------------------------------------- */

    const collectedToday =
        payments
            .filter(
                payment =>
                    isToday(
                        payment.date
                    )
            )
            .reduce(
                (
                    total,
                    payment
                ) =>
                    total +
                    Number(
                        payment.amount
                    ),
                0
            );


    todayCollected.textContent =
        formatCurrency(
            collectedToday
        );

}


/* =====================================================
   SEARCH
===================================================== */

if (paymentSearch) {

    paymentSearch.addEventListener(
        "input",
        function() {

            renderPayments(
                paymentSearch.value
            );

        }
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   INITIAL LOAD
===================================================== */

renderPayments();