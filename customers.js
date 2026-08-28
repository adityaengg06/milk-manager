/* =====================================================
   MILK MANAGER
   CUSTOMERS MODULE
   ===================================================== */


/* -----------------------------------------------------
   STORAGE KEY
----------------------------------------------------- */

const CUSTOMER_STORAGE_KEY = "milkManagerCustomers";


/* -----------------------------------------------------
   GET CUSTOMERS
----------------------------------------------------- */

function getCustomers() {

    const savedCustomers =
        localStorage.getItem(CUSTOMER_STORAGE_KEY);

    if (!savedCustomers) {
        return [];
    }

    try {

        return JSON.parse(savedCustomers);

    } catch (error) {

        console.error(
            "Unable to read customers:",
            error
        );

        return [];

    }
}


/* -----------------------------------------------------
   SAVE CUSTOMERS
----------------------------------------------------- */

function saveCustomers(customers) {

    localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify(customers)
    );

}


/* -----------------------------------------------------
   PAGE ELEMENTS
----------------------------------------------------- */

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


/* -----------------------------------------------------
   OPEN MODAL
----------------------------------------------------- */

function openCustomerModal() {

    customerModal.classList.add("show");

    setTimeout(() => {

        const nameInput =
            document.getElementById("customerName");

        if (nameInput) {
            nameInput.focus();
        }

    }, 100);

}


/* -----------------------------------------------------
   CLOSE MODAL
----------------------------------------------------- */

function closeModal() {

    customerModal.classList.remove("show");

}


/* -----------------------------------------------------
   BUTTON EVENTS
----------------------------------------------------- */

if (addCustomerBtn) {

    addCustomerBtn.addEventListener(
        "click",
        openCustomerModal
    );

}


if (closeCustomerModal) {

    closeCustomerModal.addEventListener(
        "click",
        closeModal
    );

}


if (cancelCustomerBtn) {

    cancelCustomerBtn.addEventListener(
        "click",
        closeModal
    );

}


/* -----------------------------------------------------
   CLOSE WHEN CLICKING OUTSIDE MODAL
----------------------------------------------------- */

if (customerModal) {

    customerModal.addEventListener(
        "click",
        function(event) {

            if (event.target === customerModal) {

                closeModal();

            }

        }
    );

}


/* -----------------------------------------------------
   CREATE CUSTOMER CARD
----------------------------------------------------- */

function createCustomerCard(customer) {

    const card =
        document.createElement("div");

    card.className = "customer-card";

    const initials =
        customer.name
            .split(" ")
            .map(word => word.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();


    const today =
        new Date().toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    card.innerHTML = `

        <div class="customer-avatar">
            ${initials}
        </div>

        <div class="customer-info">

            <h3>
                ${escapeHTML(customer.name)}
            </h3>

            <p>
                📞 ${escapeHTML(customer.mobile)}
            </p>

            <p>
                📍 ${escapeHTML(customer.address)}
            </p>

            <p>
                🥛 ${customer.milkQuantity} L/day
                • ₹${customer.rate}/L
            </p>

            <small>
                Added ${today}
            </small>

        </div>

        <div class="customer-actions">

            <span class="status-badge ${customer.status}">
                ${
                    customer.status === "active"
                    ? "Active"
                    : "Inactive"
                }
            </span>

            <button
                class="delete-customer-btn"
                data-id="${customer.id}"
                title="Delete customer"
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

                deleteCustomer(customer.id);

            }
        );

    }


    return card;
}


/* -----------------------------------------------------
   DISPLAY CUSTOMERS
----------------------------------------------------- */

function displayCustomers(searchText = "") {

    const customers =
        getCustomers();

    customerList.innerHTML = "";


    const filteredCustomers =
        customers.filter(customer => {

            const search =
                searchText
                    .toLowerCase()
                    .trim();

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

        });


    customerCount.textContent =
        `${filteredCustomers.length} Customer${
            filteredCustomers.length !== 1
            ? "s"
            : ""
        }`;


    /* -------------------------------------------------
       EMPTY STATE
    ------------------------------------------------- */

    if (filteredCustomers.length === 0) {

        customerList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🥛
                </div>

                <h3>
                    No customers found
                </h3>

                <p>
                    Add your first customer to
                    start managing deliveries.
                </p>

                <button
                    class="primary-btn"
                    id="emptyAddCustomerBtn"
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


    /* -------------------------------------------------
       SHOW CUSTOMERS
    ------------------------------------------------- */

    filteredCustomers.forEach(customer => {

        customerList.appendChild(
            createCustomerCard(customer)
        );

    });

}


/* -----------------------------------------------------
   ADD CUSTOMER
----------------------------------------------------- */

if (customerForm) {

    customerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("customerName")
                    .value
                    .trim();


            const mobile =
                document
                    .getElementById("customerMobile")
                    .value
                    .trim();


            const address =
                document
                    .getElementById("customerAddress")
                    .value
                    .trim();


            const milkQuantity =
                Number(
                    document
                        .getElementById("milkQuantity")
                        .value
                );


            const rate =
                Number(
                    document
                        .getElementById("milkRate")
                        .value
                );


            const status =
                document
                    .getElementById("customerStatus")
                    .value;


            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */

            if (!name) {

                alert(
                    "Please enter customer name."
                );

                return;

            }


            if (!/^[0-9]{10}$/.test(mobile)) {

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


            if (milkQuantity <= 0) {

                alert(
                    "Milk quantity must be greater than 0."
                );

                return;

            }


            if (rate <= 0) {

                alert(
                    "Milk rate must be greater than 0."
                );

                return;

            }


            /* -----------------------------------------
               GET EXISTING CUSTOMERS
            ----------------------------------------- */

            const customers =
                getCustomers();


            /* -----------------------------------------
               CHECK DUPLICATE MOBILE
            ----------------------------------------- */

            const duplicate =
                customers.some(
                    customer =>
                        customer.mobile === mobile
                );


            if (duplicate) {

                alert(
                    "A customer with this mobile number already exists."
                );

                return;

            }


            /* -----------------------------------------
               CREATE CUSTOMER
            ----------------------------------------- */

            const newCustomer = {

                id:
                    Date.now().toString(),

                name:
                    name,

                mobile:
                    mobile,

                address:
                    address,

                milkQuantity:
                    milkQuantity,

                rate:
                    rate,

                status:
                    status,

                createdAt:
                    new Date().toISOString()

            };


            /* -----------------------------------------
               SAVE
            ----------------------------------------- */

            customers.push(
                newCustomer
            );

            saveCustomers(
                customers
            );


            /* -----------------------------------------
               RESET FORM
            ----------------------------------------- */

            customerForm.reset();


            document.getElementById(
                "milkQuantity"
            ).value = 2;


            document.getElementById(
                "milkRate"
            ).value = 60;


            /* -----------------------------------------
               CLOSE MODAL
            ----------------------------------------- */

            closeModal();


            /* -----------------------------------------
               REFRESH LIST
            ----------------------------------------- */

            displayCustomers();


            /* -----------------------------------------
               SUCCESS MESSAGE
            ----------------------------------------- */

            alert(
                `${name} has been added successfully!`
            );

        }
    );

}


/* -----------------------------------------------------
   DELETE CUSTOMER
----------------------------------------------------- */

function deleteCustomer(id) {

    const customers =
        getCustomers();


    const customer =
        customers.find(
            item => item.id === id
        );


    if (!customer) {
        return;
    }


    const confirmDelete =
        confirm(
            `Delete ${customer.name} from customers?`
        );


    if (!confirmDelete) {
        return;
    }


    const updatedCustomers =
        customers.filter(
            item => item.id !== id
        );


    saveCustomers(
        updatedCustomers
    );


    displayCustomers(
        customerSearch
            ? customerSearch.value
            : ""
    );


    alert(
        `${customer.name} has been deleted.`
    );

}


/* -----------------------------------------------------
   SEARCH
----------------------------------------------------- */

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


/* -----------------------------------------------------
   ESCAPE HTML
   Prevents HTML injection
----------------------------------------------------- */

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


/* -----------------------------------------------------
   INITIAL LOAD
----------------------------------------------------- */

displayCustomers();