/* =========================================================
   MILK MANAGER
   history.js
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadHistoryCustomers();

        renderHistory();

        setupHistoryFilters();

    }
);


/* =========================================================
   CUSTOMER FILTER
   ========================================================= */

function loadHistoryCustomers() {

    const select =
        document.getElementById(
            "customerFilter"
        ) ||
        document.getElementById(
            "historyCustomer"
        );


    if (!select) return;


    const db = getDB();


    select.innerHTML = `

        <option value="">
            All Customers
        </option>

    `;


    db.customers
        .filter(
            c => c.active !== false
        )
        .sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        )
        .forEach(
            customer => {

                select.innerHTML += `

                    <option
                        value="${customer.id}">

                        ${esc(
                            customer.name
                        )}

                    </option>

                `;

            }
        );

}


/* =========================================================
   FILTERS
   ========================================================= */

function setupHistoryFilters() {

    const customer =
        document.getElementById(
            "customerFilter"
        ) ||
        document.getElementById(
            "historyCustomer"
        );


    if (customer) {

        customer.addEventListener(
            "change",
            renderHistory
        );

    }


    const date =
        document.getElementById(
            "historyDate"
        ) ||
        document.getElementById(
            "dateFilter"
        );


    if (date) {

        date.addEventListener(
            "change",
            renderHistory
        );

    }

}


/* =========================================================
   RENDER HISTORY
   ========================================================= */

function renderHistory() {

    const db = getDB();


    const customerSelect =
        document.getElementById(
            "customerFilter"
        ) ||
        document.getElementById(
            "historyCustomer"
        );


    const dateSelect =
        document.getElementById(
            "historyDate"
        ) ||
        document.getElementById(
            "dateFilter"
        );


    const selectedCustomer =
        customerSelect
            ? customerSelect.value
            : "";


    const selectedDate =
        dateSelect
            ? dateSelect.value
            : "";


    let records =
        [...db.deliveries];


    if (selectedCustomer) {

        records =
            records.filter(
                record =>
                    record.customerId ===
                    selectedCustomer
            );

    }


    if (selectedDate) {

        records =
            records.filter(
                record =>
                    record.date ===
                    selectedDate
            );

    }


    records.sort(
        (a, b) =>
            (
                b.date +
                (b.time || "")
            ).localeCompare(
                a.date +
                (a.time || "")
            )
    );


    const container =
        document.getElementById(
            "historyList"
        ) ||
        document.getElementById(
            "historyContainer"
        );


    if (!container) return;


    if (!records.length) {

        container.innerHTML = `

            <div class="empty">

                <div style="font-size:45px;">
                    📜
                </div>

                <h3>
                    No history found
                </h3>

                <p class="small">
                    Delivery records will
                    appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="card">

            <div class="history-list">

                ${
                    records.map(
                        record => `

                        <div
                            class="history-item"
                            style="
                                padding:12px 0;
                                border-bottom:
                                1px solid var(--border);
                            ">

                            <div
                                class="between">

                                <div>

                                    <b>
                                        ${esc(
                                            record.customer
                                        )}
                                    </b>

                                    <div class="small">

                                        ${fmtDate(
                                            record.date
                                        )}

                                        ${
                                            record.time
                                                ? " • " +
                                                  record.time
                                                : ""
                                        }

                                    </div>

                                </div>


                                <span
                                    class="
                                        badge
                                        ${
                                            record.status ===
                                            "delivered"

                                                ? "badge-green"

                                                : "badge-red"
                                        }
                                    ">

                                    ${
                                        record.status ===
                                        "delivered"

                                            ? "✓ Delivered"

                                            : "Skipped"
                                    }

                                </span>

                            </div>


                            ${
                                record.status ===
                                "delivered"

                                    ?

                                    `

                                    <div
                                        class="small"
                                        style="margin-top:7px;">

                                        🥛
                                        ${record.qty}
                                        L

                                        ×

                                        ${money(
                                            record.rate
                                        )}

                                        =

                                        <b>
                                            ${money(
                                                Number(
                                                    record.qty
                                                ) *
                                                Number(
                                                    record.rate
                                                )
                                            )}
                                        </b>

                                    </div>

                                    `

                                    :

                                    record.reason

                                        ?

                                        `
                                        <div
                                            class="small"
                                            style="margin-top:7px;">

                                            Reason:
                                            ${esc(
                                                record.reason
                                            )}

                                        </div>
                                        `

                                        :

                                        ""

                            }

                        </div>

                    `
                    ).join("")
                }

            </div>

        </div>

    `;

}