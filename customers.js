/* =========================================================
   MILK MANAGER
   CUSTOMERS MODULE
   DATABASE CONNECTED VERSION
========================================================= */


/* =========================================================
   PAGE ELEMENTS
========================================================= */

const customerList =
    document.getElementById("customerList");

const customerCount =
    document.getElementById("customerCount");

const addCustomerBtn =
    document.getElementById("addCustomerBtn");

const customerModal =
    document.getElementById("customerModal");

const closeCustomerModal =
    document.getElementById("closeCustomerModal");

const cancelCustomerBtn =
    document.getElementById("cancelCustomerBtn");

const customerForm =
    document.getElementById("customerForm");

const customerSearch =
    document.getElementById("customerSearch");


/* =========================================================
   OPEN MODAL
========================================================= */

function openCustomerModal() {

    if (!customerModal) return;

    customerModal.classList.add("show");

    setTimeout(() => {

        const input =
            document.getElementById("customerName");

        if (input) {
            input.focus();
        }

    }, 100);
}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeCustomerModalWindow() {

    if (!customerModal) return;

    customerModal.classList.remove("show");
}


/* =========================================================
   BUTTON EVENTS
========================================================= */

if (addCustomerBtn) {

    addCustomerBtn.addEventListener(
        "click",
        openCustomerModal
    );

}


if (closeCustomerModal) {

    closeCustomerModal.addEventListener(
        "click",
        closeCustomerModalWindow
    );

}


if (cancelCustomerBtn) {

    cancelCustomerBtn.addEventListener(
        "click",
        closeCustomerModalWindow
    );

}


if (customerModal) {

    customerModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                customerModal
            ) {

                closeCustomerModalWindow();

            }

        }
    );

}


/* =========================================================
   CREATE CUSTOMER CARD
========================================================= */

function createCustomerCard(customer) {

    const card =
        document.createElement("div");

    card.className =
        "customer-card";


    const name =
        customer.name || "Customer";


    const initials =
        name
            .split(" ")
            .filter(Boolean)
            .map(word => word.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();


    const milk =
        Number(customer.milk) || 0;


    const rate =
        Number(customer.milkRate) || 0;


    const phone =
        customer.phone || "-";


    const address =
        customer.address || "-";


    const status =
        customer.active === false
            ? "inactive"
            : "active";


    card.innerHTML = `

        <div class="customer-avatar">
            ${escapeHTML(initials)}
        </div>


        <div class="customer-info">

            <h3>
                ${escapeHTML(name)}
            </h3>


            <p>
                📞 ${escapeHTML(phone)}
            </p>


            <p>
                📍 ${escapeHTML(address)}
            </p>


            <p>
                🥛 ${milk} L/day
                • ₹${rate}/L
            </p>


            <small>
                ${status === "active"
                    ? "Active Customer"
                    : "Inactive Customer"}
            </small>

        </div>


        <div class="customer-actions">

            <span class="status-badge ${status}">
                ${
                    status === "active"
                        ? "Active"
                        : "Inactive"
                }
            </span>


            <button
                class="delete-customer-btn"
                data-id="${customer.id}"
                title="Delete customer"
                type="button"
            >
                🗑️
            </button>

        </div>

    `;


    const deleteButton =
        card.querySelector(
            ".delete-customer-btn"
        );


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            function() {

                deleteCustomerFromDatabase(
                    customer.id
                );

            }
        );

    }


    return card;
}


/* =========================================================
   DISPLAY CUSTOMERS
========================================================= */

function displayCustomers(
    searchText = ""
) {

    if (!customerList) return;


    /*
       IMPORTANT:
       Customers now come from
       milkManagerDB.
    */

    const customers =
        getCustomers();


    customerList.innerHTML = "";


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


                const name =
                    String(
                        customer.name || ""
                    ).toLowerCase();


                const phone =
                    String(
                        customer.phone || ""
                    );


                const address =
                    String(
                        customer.address || ""
                    ).toLowerCase();


                return (
                    name.includes(search) ||
                    phone.includes(search) ||
                    address.includes(search)
                );

            }
        );


    if (customerCount) {

        customerCount.textContent =
            `${filteredCustomers.length} Customer${
                filteredCustomers.length !== 1
                    ? "s"
                    : ""
            }`;

    }


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (
        filteredCustomers.length === 0
    ) {

        customerList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🥛
                </div>

                <h3>
                    No customers found
                </h3>

                <p>
                    Add your first customer
                    to start managing deliveries.
                </p>

                <button
                    class="primary-btn"
                    id="emptyAddCustomerBtn"
                    type="button"
                >
                    + Add Customer
                </button>

            </div>

        `;


        const emptyButton =
            document.getElementById(
                "emptyAddCustomerBtn"
            );


        if (emptyButton) {

            emptyButton.addEventListener(
                "click",
                openCustomerModal
            );

        }


        return;

    }


    /* =====================================================
       SHOW CUSTOMERS
    ===================================================== */

    filteredCustomers.forEach(
        customer => {

            customerList.appendChild(
                createCustomerCard(
                    customer
                )
            );

        }
    );

}


/* =========================================================
   ADD CUSTOMER
========================================================= */

if (customerForm) {

    customerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            /* =================================================
               GET FORM VALUES
            ================================================= */

            const name =
                document
                    .getElementById(
                        "customerName"
                    )
                    .value
                    .trim();


            const mobile =
                document
                    .getElementById(
                        "customerMobile"
                    )
                    .value
                    .trim();


            const address =
                document
                    .getElementById(
                        "customerAddress"
                    )
                    .value
                    .trim();


            const milk =
                Number(
                    document
                        .getElementById(
                            "milkQuantity"
                        )
                        .value
                );


            const milkRate =
                Number(
                    document
                        .getElementById(
                            "milkRate"
                        )
                        .value
                );


            const status =
                document
                    .getElementById(
                        "customerStatus"
                    )
                    .value;


            /* =================================================
               VALIDATION
            ================================================= */

            if (!name) {

                alert(
                    "Please enter customer name."
                );

                return;

            }


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


            if (!address) {

                alert(
                    "Please enter customer address."
                );

                return;

            }


            if (milk <= 0) {

                alert(
                    "Milk quantity must be greater than 0."
                );

                return;

            }


            if (milkRate <= 0) {

                alert(
                    "Milk rate must be greater than 0."
                );

                return;

            }


            /* =================================================
               CHECK DUPLICATE
            ================================================= */

            const existingCustomers =
                getAllCustomers();


            const duplicate =
                existingCustomers.some(
                    customer =>
                        customer.phone ===
                        mobile &&
                        customer.active !== false
                );


            if (duplicate) {

                alert(
                    "A customer with this mobile number already exists."
                );

                return;

            }


            /* =================================================
               ADD TO DATABASE
            ================================================= */

            const newCustomer =
                addCustomer({

                    name:
                        name,

                    phone:
                        mobile,

                    address:
                        address,

                    milk:
                        milk,

                    milkRate:
                        milkRate

                });


            /*
               If inactive was selected,
               mark customer inactive.
            */

            if (
                status === "inactive"
            ) {

                updateCustomer(
                    newCustomer.id,
                    {
                        active: false
                    }
                );

            }


            /* =================================================
               RESET FORM
            ================================================= */

            customerForm.reset();


            const milkInput =
                document.getElementById(
                    "milkQuantity"
                );


            const rateInput =
                document.getElementById(
                    "milkRate"
                );


            if (milkInput) {

                milkInput.value = 2;

            }


            if (rateInput) {

                rateInput.value = 60;

            }


            /* =================================================
               CLOSE MODAL
            ================================================= */

            closeCustomerModalWindow();


            /* =================================================
               REFRESH
            ================================================= */

            displayCustomers();


            /* =================================================
               SUCCESS
            ================================================= */

            alert(
                `${name} has been added successfully!`
            );

        }
    );

}


/* =========================================================
   DELETE CUSTOMER
========================================================= */

function deleteCustomerFromDatabase(
    customerId
) {

    const customer =
        getCustomer(customerId);


    if (!customer) {

        return;

    }


    const confirmed =
        confirm(
            `Delete ${customer.name} from customers?`
        );


    if (!confirmed) {

        return;

    }


    const result =
        deleteCustomer(
            customerId
        );


    if (result) {

        displayCustomers(
            customerSearch
                ? customerSearch.value
                : ""
        );


        alert(
            `${customer.name} has been deleted.`
        );

    }

}


/* =========================================================
   SEARCH
========================================================= */

if (customerSearch) {

    customerSearch.addEventListener(
        "input",
        function() {

            displayCustomers(
                customerSearch.value
            );

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

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


/* =========================================================
   INITIAL LOAD
========================================================= */

displayCustomers();