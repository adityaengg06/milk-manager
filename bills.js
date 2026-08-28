/* =========================================================
   MILK MANAGER
   BILLING SYSTEM
   CONNECTED TO DATABASE.JS
========================================================= */


/* =========================================================
   BASIC HELPERS
========================================================= */

function billDB() {

    if (typeof getDB === "function") {
        return getDB();
    }

    try {

        return JSON.parse(
            localStorage.getItem("milkManagerDB")
        ) || {
            customers: [],
            deliveries: [],
            payments: [],
            products: []
        };

    } catch (error) {

        console.error(
            "Could not load database:",
            error
        );

        return {
            customers: [],
            deliveries: [],
            payments: [],
            products: []
        };

    }

}


/* =========================================================
   CUSTOMERS
========================================================= */

function getBillCustomers() {

    const db = billDB();

    return (db.customers || [])
        .filter(
            customer =>
                customer.active !== false
        );

}


/* =========================================================
   DELIVERIES
========================================================= */

function getBillDeliveries() {

    const db = billDB();

    return db.deliveries || [];

}


/* =========================================================
   PAYMENTS
========================================================= */

function getBillPayments() {

    const db = billDB();

    return db.payments || [];

}


/* =========================================================
   PRODUCTS
========================================================= */

function getBillProducts() {

    const db = billDB();

    return db.products || [];

}


/* =========================================================
   MONEY
========================================================= */

function money(value) {

    return "₹" +
        Number(value || 0)
            .toLocaleString(
                "en-IN"
            );

}


/* =========================================================
   CURRENT MONTH
========================================================= */

function currentMonth() {

    const d = new Date();

    return (
        d.getFullYear() +
        "-" +
        String(
            d.getMonth() + 1
        ).padStart(2, "0")
    );

}


/* =========================================================
   FORMAT MONTH
========================================================= */

function formatMonth(month) {

    if (!month) {
        return "";
    }

    const parts =
        month.split("-");

    const year =
        Number(parts[0]);

    const mon =
        Number(parts[1]);

    const d =
        new Date(
            year,
            mon - 1,
            1
        );

    return d.toLocaleDateString(
        "en-IN",
        {
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   DAYS IN MONTH
========================================================= */

function daysInMonth(month) {

    const parts =
        month.split("-");

    const year =
        Number(parts[0]);

    const mon =
        Number(parts[1]);

    return new Date(
        year,
        mon,
        0
    ).getDate();

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {

    const d =
        new Date(
            date + "T00:00:00"
        );

    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short"
        }
    );

}


/* =========================================================
   FIND CUSTOMER
========================================================= */

function findBillCustomer(id) {

    const customers =
        getBillCustomers();

    return customers.find(
        customer =>
            String(customer.id) ===
            String(id)
    );

}


/* =========================================================
   CUSTOMER MONTH DELIVERIES
========================================================= */

function getCustomerMonthDeliveries(
    customerId,
    month
) {

    const records =
        getBillDeliveries();


    return records

        .filter(
            record => {

                if (
                    String(
                        record.customerId
                    ) !==
                    String(customerId)
                ) {

                    return false;

                }


                if (!record.date) {

                    return false;

                }


                return String(
                    record.date
                ).startsWith(
                    month
                );

            }
        )

        .sort(
            (a, b) =>
                String(a.date)
                    .localeCompare(
                        String(b.date)
                    )
        );

}


/* =========================================================
   BUILD MILK DAILY ROWS
========================================================= */

function buildDailyRows(
    customer,
    month
) {

    const records =
        getCustomerMonthDeliveries(
            customer.id,
            month
        );


    const rows = [];


    /*
       IMPORTANT

       New delivery.js saves:

       record.milk
       record.paneer
       record.curd
       record.ghee
       record.status

       It does NOT save:

       record.quantity

       Therefore we read record.milk here.
    */


    records.forEach(
        record => {

            const quantity =
                Number(
                    record.milk || 0
                );


            /*
               Milk rate comes from:
               1. record.milkRate
               2. customer.milkRate
               3. customer.rate
               4. default 55
            */

            const rate =
                Number(
                    record.milkRate ||
                    customer.milkRate ||
                    customer.rate ||
                    55
                );


            const amount =
                quantity * rate;


            rows.push({

                date:
                    record.date,

                quantity:
                    quantity,

                rate:
                    rate,

                amount:
                    amount,

                status:
                    record.status ||
                    "delivered"

            });

        }
    );


    return rows;

}


/* =========================================================
   PRODUCT RECORDS
========================================================= */

function getCustomerProducts(
    customerId,
    month
) {

    const db =
        billDB();


    /*
       First check the old separate
       product storage.
    */

    const products =
        db.products || [];


    return products.filter(
        product => {

            if (
                String(
                    product.customerId
                ) !==
                String(customerId)
            ) {

                return false;

            }


            if (!product.date) {

                return false;

            }


            return String(
                product.date
            ).startsWith(
                month
            );

        }
    );

}


/* =========================================================
   PRODUCT ITEMS FROM DELIVERY RECORDS
========================================================= */

function getProductsFromDeliveries(
    customerId,
    month
) {

    const records =
        getCustomerMonthDeliveries(
            customerId,
            month
        );


    const items = [];


    records.forEach(
        record => {

            /*
               Paneer
            */

            const paneer =
                Number(
                    record.paneer || 0
                );


            if (paneer > 0) {

                items.push({

                    name:
                        "Paneer",

                    quantity:
                        paneer,

                    unit:
                        "kg",

                    rate:
                        320,

                    date:
                        record.date

                });

            }


            /*
               Curd
            */

            const curd =
                Number(
                    record.curd || 0
                );


            if (curd > 0) {

                items.push({

                    name:
                        "Curd",

                    quantity:
                        curd,

                    unit:
                        "kg",

                    rate:
                        90,

                    date:
                        record.date

                });

            }


            /*
               Ghee
            */

            const ghee =
                Number(
                    record.ghee || 0
                );


            if (ghee > 0) {

                items.push({

                    name:
                        "Ghee",

                    quantity:
                        ghee,

                    unit:
                        "kg",

                    rate:
                        650,

                    date:
                        record.date

                });

            }

        }
    );


    return items;

}


/* =========================================================
   PAYMENTS
========================================================= */

function getCustomerPayments(
    customerId,
    month
) {

    const payments =
        getBillPayments();


    return payments.filter(
        payment => {

            if (
                String(
                    payment.customerId
                ) !==
                String(customerId)
            ) {

                return false;

            }


            const date =
                payment.date ||
                payment.createdAt;


            if (!date) {

                return false;

            }


            return String(
                date
            ).startsWith(
                month
            );

        }
    );

}


/* =========================================================
   CALCULATE CUSTOMER BILL
========================================================= */

function calculateCustomerBill(
    customer,
    month
) {

    /*
       DAILY MILK
    */

    const dailyRows =
        buildDailyRows(
            customer,
            month
        );


    /*
       PRODUCTS STORED DIRECTLY
    */

    const storedProducts =
        getCustomerProducts(
            customer.id,
            month
        );


    /*
       PRODUCTS FROM DELIVERY
    */

    const deliveryProducts =
        getProductsFromDeliveries(
            customer.id,
            month
        );


    /*
       Combine both.
    */

    const products =
        [
            ...storedProducts,
            ...deliveryProducts
        ];


    /*
       PAYMENTS
    */

    const payments =
        getCustomerPayments(
            customer.id,
            month
        );


    /* =====================================================
       MILK TOTAL
    ===================================================== */

    const totalMilk =
        dailyRows.reduce(
            (
                total,
                row
            ) =>
                total +
                Number(
                    row.quantity || 0
                ),
            0
        );


    /* =====================================================
       MILK AMOUNT
    ===================================================== */

    const milkAmount =
        dailyRows.reduce(
            (
                total,
                row
            ) =>
                total +
                Number(
                    row.amount || 0
                ),
            0
        );


    /* =====================================================
       PRODUCT TOTAL
    ===================================================== */

    const productTotal =
        products.reduce(
            (
                total,
                product
            ) => {

                const quantity =
                    Number(
                        product.quantity || 0
                    );


                const rate =
                    Number(
                        product.rate || 0
                    );


                return (
                    total +
                    (
                        quantity *
                        rate
                    )
                );

            },
            0
        );


    /* =====================================================
       GRAND TOTAL
    ===================================================== */

    const grandTotal =
        milkAmount +
        productTotal;


    /* =====================================================
       PAID
    ===================================================== */

    const paid =
        payments.reduce(
            (
                total,
                payment
            ) =>
                total +
                Number(
                    payment.amount || 0
                ),
            0
        );


    /* =====================================================
       OUTSTANDING
    ===================================================== */

    const outstanding =
        Math.max(
            0,
            grandTotal - paid
        );


    return {

        dailyRows,

        products,

        payments,

        totalMilk,

        milkAmount,

        productTotal,

        grandTotal,

        paid,

        outstanding

    };

}


/* =========================================================
   RENDER BILL LIST
========================================================= */

function renderBills() {

    const customers =
        getBillCustomers();


    const monthElement =
        document.getElementById(
            "billMonth"
        );


    const searchElement =
        document.getElementById(
            "billSearch"
        );


    const list =
        document.getElementById(
            "billList"
        );


    if (
        !monthElement ||
        !searchElement ||
        !list
    ) {

        console.error(
            "Bill page elements missing."
        );

        return;

    }


    const month =
        monthElement.value ||
        currentMonth();


    const search =
        searchElement.value
            .toLowerCase()
            .trim();


    list.innerHTML = "";


    const filtered =
        customers.filter(
            customer => {

                if (!search) {

                    return true;

                }


                return (

                    String(
                        customer.name || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        customer.phone ||
                        customer.mobile ||
                        ""
                    )
                        .includes(search)

                );

            }
        );


    const countElement =
        document.getElementById(
            "billCustomerCount"
        );


    if (countElement) {

        countElement.textContent =
            `${filtered.length} Customer${
                filtered.length !== 1
                    ? "s"
                    : ""
            }`;

    }


    if (
        filtered.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🧾
                </div>

                <h3>
                    No customers found
                </h3>

            </div>

        `;


        updateSummary();

        return;

    }


    filtered.forEach(
        customer => {

            const bill =
                calculateCustomerBill(
                    customer,
                    month
                );


            const initials =
                String(
                    customer.name ||
                    "C"
                )
                    .split(" ")
                    .filter(Boolean)
                    .map(
                        word =>
                            word[0]
                    )
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();


            let status =
                "Pending";


            let statusClass =
                "pending";


            if (
                bill.grandTotal > 0 &&
                bill.outstanding === 0
            ) {

                status =
                    "Paid";

                statusClass =
                    "paid";

            }

            else if (
                bill.paid > 0
            ) {

                status =
                    "Partially Paid";

                statusClass =
                    "partial";

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "bill-card";


            card.innerHTML = `

                <div class="bill-avatar">
                    ${initials}
                </div>


                <div class="bill-info">

                    <h3>
                        ${escapeHTML(
                            customer.name ||
                            "Customer"
                        )}
                    </h3>


                    <p>
                        🥛
                        ${bill.totalMilk}
                        L
                        • Milk
                        ${money(
                            bill.milkAmount
                        )}
                    </p>


                    <p>
                        🧀
                        Products
                        ${money(
                            bill.productTotal
                        )}
                    </p>


                    <small>
                        ${formatMonth(month)}
                    </small>

                </div>


                <div class="bill-right">

                    <strong>
                        ${money(
                            bill.grandTotal
                        )}
                    </strong>


                    <span
                        class="bill-status ${statusClass}"
                    >
                        ${status}
                    </span>


                    <button
                        class="small-bill-btn"
                        type="button"
                    >
                        View
                    </button>

                </div>

            `;


            card
                .querySelector(
                    ".small-bill-btn"
                )
                .addEventListener(
                    "click",
                    () => {

                        showBill(
                            customer,
                            bill,
                            month
                        );

                    }
                );


            list.appendChild(
                card
            );

        }
    );


    updateSummary();

}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary() {

    const customers =
        getBillCustomers();


    const monthElement =
        document.getElementById(
            "billMonth"
        );


    if (!monthElement) {

        return;

    }


    const month =
        monthElement.value ||
        currentMonth();


    let milk = 0;

    let milkAmount = 0;

    let products = 0;

    let grand = 0;

    let paid = 0;

    let outstanding = 0;


    customers.forEach(
        customer => {

            const bill =
                calculateCustomerBill(
                    customer,
                    month
                );


            milk +=
                bill.totalMilk;


            milkAmount +=
                bill.milkAmount;


            products +=
                bill.productTotal;


            grand +=
                bill.grandTotal;


            paid +=
                bill.paid;


            outstanding +=
                bill.outstanding;

        }
    );


    const totalMilk =
        document.getElementById(
            "totalMilk"
        );


    if (totalMilk) {

        totalMilk.textContent =
            milk + " L";

    }


    const totalMilkAmount =
        document.getElementById(
            "totalMilkAmount"
        );


    if (totalMilkAmount) {

        totalMilkAmount.textContent =
            money(
                milkAmount
            );

    }


    const totalProductsAmount =
        document.getElementById(
            "totalProductsAmount"
        );


    if (totalProductsAmount) {

        totalProductsAmount.textContent =
            money(
                products
            );

    }


    const totalGrandAmount =
        document.getElementById(
            "totalGrandAmount"
        );


    if (totalGrandAmount) {

        totalGrandAmount.textContent =
            money(
                grand
            );

    }


    const totalPaid =
        document.getElementById(
            "totalPaid"
        );


    if (totalPaid) {

        totalPaid.textContent =
            money(
                paid
            );

    }


    const totalOutstanding =
        document.getElementById(
            "totalOutstanding"
        );


    if (totalOutstanding) {

        totalOutstanding.textContent =
            money(
                outstanding
            );

    }

}


/* =========================================================
   SHOW BILL
========================================================= */

function showBill(
    customer,
    bill,
    month
) {

    const modal =
        document.getElementById(
            "billModal"
        );


    if (!modal) {

        return;

    }


    const subtitle =
        document.getElementById(
            "billModalSubtitle"
        );


    if (subtitle) {

        subtitle.textContent =
            `${customer.name} • ${formatMonth(month)}`;

    }


    let html = `

        <div class="professional-invoice">


            <!-- CUSTOMER -->

            <div class="invoice-customer">

                <div>

                    <h2>
                        ${escapeHTML(
                            customer.name ||
                            "Customer"
                        )}
                    </h2>


                    <p>
                        📞
                        ${escapeHTML(
                            customer.phone ||
                            customer.mobile ||
                            "-"
                        )}
                    </p>


                    <p>
                        📍
                        ${escapeHTML(
                            customer.address ||
                            "-"
                        )}
                    </p>

                </div>


                <div class="invoice-meta">

                    <strong>
                        BILL
                    </strong>

                    <span>
                        ${formatMonth(month)}
                    </span>

                </div>

            </div>


            <!-- MILK -->

            <div class="invoice-section">

                <h3>
                    🥛 Milk Consumption
                </h3>


                <div class="invoice-table">

                    <div class="invoice-table-head">

                        <span>
                            Date
                        </span>

                        <span>
                            Qty
                        </span>

                        <span>
                            Rate
                        </span>

                        <span>
                            Amount
                        </span>

                    </div>

    `;


    if (
        bill.dailyRows.length === 0
    ) {

        html += `

            <div class="invoice-empty">

                No milk delivery records
                found for this month.

            </div>

        `;

    }


    bill.dailyRows.forEach(
        row => {

            html += `

                <div
                    class="invoice-table-row"
                >

                    <span>
                        ${formatDate(
                            row.date
                        )}
                    </span>


                    <span>
                        ${row.quantity} L
                    </span>


                    <span>
                        ${money(
                            row.rate
                        )}
                    </span>


                    <strong>
                        ${money(
                            row.amount
                        )}
                    </strong>

                </div>

            `;

        }
    );


    html += `

                    <div
                        class="invoice-subtotal"
                    >

                        <span>
                            Total Milk
                        </span>


                        <strong>

                            ${bill.totalMilk}
                            L

                            •

                            ${money(
                                bill.milkAmount
                            )}

                        </strong>

                    </div>


                </div>

            </div>


            <!-- PRODUCTS -->

            <div class="invoice-section">

                <h3>
                    🧀 Paneer / Other Products
                </h3>

    `;


    if (
        bill.products.length === 0
    ) {

        html += `

            <div class="invoice-empty">

                No extra products
                this month.

            </div>

        `;

    }

    else {

        html += `

            <div class="invoice-table">

                <div class="invoice-table-head">

                    <span>
                        Product
                    </span>

                    <span>
                        Qty
                    </span>

                    <span>
                        Rate
                    </span>

                    <span>
                        Amount
                    </span>

                </div>

        `;


        bill.products.forEach(
            product => {

                const quantity =
                    Number(
                        product.quantity || 0
                    );


                const rate =
                    Number(
                        product.rate || 0
                    );


                const amount =
                    quantity *
                    rate;


                html += `

                    <div
                        class="invoice-table-row"
                    >

                        <span>
                            ${escapeHTML(
                                product.name ||
                                "Product"
                            )}
                        </span>


                        <span>
                            ${quantity}
                            ${product.unit || ""}
                        </span>


                        <span>
                            ${money(
                                rate
                            )}
                        </span>


                        <strong>
                            ${money(
                                amount
                            )}
                        </strong>

                    </div>

                `;

            }
        );


        html += `

            </div>

        `;

    }


    html += `

            </div>


            <!-- TOTALS -->

            <div class="invoice-total-box">


                <div class="invoice-total-row">

                    <span>
                        Milk Total
                    </span>

                    <strong>
                        ${money(
                            bill.milkAmount
                        )}
                    </strong>

                </div>


                <div class="invoice-total-row">

                    <span>
                        Products Total
                    </span>

                    <strong>
                        ${money(
                            bill.productTotal
                        )}
                    </strong>

                </div>


                <div
                    class="invoice-total-row grand"
                >

                    <span>
                        GRAND TOTAL
                    </span>

                    <strong>
                        ${money(
                            bill.grandTotal
                        )}
                    </strong>

                </div>


                <div class="invoice-total-row">

                    <span>
                        Paid
                    </span>

                    <strong>
                        ${money(
                            bill.paid
                        )}
                    </strong>

                </div>


                <div
                    class="invoice-total-row outstanding"
                >

                    <span>
                        BALANCE DUE
                    </span>

                    <strong>
                        ${money(
                            bill.outstanding
                        )}
                    </strong>

                </div>


            </div>


        </div>

    `;


    const details =
        document.getElementById(
            "billDetails"
        );


    if (details) {

        details.innerHTML =
            html;

    }


    modal.classList.add(
        "show"
    );

}


/* =========================================================
   GENERATE ALL BILLS
========================================================= */

function generateAllBills() {

    const month =
        document.getElementById(
            "billMonth"
        ).value;


    const customers =
        getBillCustomers();


    if (
        customers.length === 0
    ) {

        alert(
            "No customers found."
        );

        return;

    }


    renderBills();


    alert(
        `Detailed bills ready for ${formatMonth(month)}.`
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )

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


/* =========================================================
   EVENTS
========================================================= */

const generateButton =
    document.getElementById(
        "generateAllBillsBtn"
    );


if (generateButton) {

    generateButton.addEventListener(
        "click",
        generateAllBills
    );

}


const monthInput =
    document.getElementById(
        "billMonth"
    );


if (monthInput) {

    monthInput.addEventListener(
        "change",
        renderBills
    );

}


const searchInput =
    document.getElementById(
        "billSearch"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderBills
    );

}


const closeBillModal =
    document.getElementById(
        "closeBillModal"
    );


if (closeBillModal) {

    closeBillModal.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "billModal"
                )
                .classList.remove(
                    "show"
                );

        }
    );

}


const closeBillButton =
    document.getElementById(
        "closeBillBtn"
    );


if (closeBillButton) {

    closeBillButton.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "billModal"
                )
                .classList.remove(
                    "show"
                );

        }
    );

}


const printBillButton =
    document.getElementById(
        "printBillBtn"
    );


if (printBillButton) {

    printBillButton.addEventListener(
        "click",
        () => {

            window.print();

        }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

if (monthInput) {

    monthInput.value =
        currentMonth();

}


renderBills();


console.log(
    "Milk Manager Billing System loaded."
);