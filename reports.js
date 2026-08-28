/* =========================================================
   MILK MANAGER
   reports.js
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setDefaultReportDate();

        setupReportDate();

        renderReport();

    }
);


/* =========================================================
   DEFAULT DATE
   ========================================================= */

function setDefaultReportDate() {

    const date =
        document.getElementById(
            "reportDate"
        ) ||
        document.getElementById(
            "date"
        );


    if (
        date &&
        !date.value
    ) {

        date.value =
            today();

    }

}


/* =========================================================
   DATE CHANGE
   ========================================================= */

function setupReportDate() {

    const date =
        document.getElementById(
            "reportDate"
        ) ||
        document.getElementById(
            "date"
        );


    if (!date) return;


    date.addEventListener(
        "change",
        renderReport
    );

}


/* =========================================================
   REPORT
   ========================================================= */

function renderReport() {

    const db = getDB();


    const dateElement =
        document.getElementById(
            "reportDate"
        ) ||
        document.getElementById(
            "date"
        );


    const selectedDate =
        dateElement &&
        dateElement.value
            ? dateElement.value
            : today();


    const customers =
        db.customers.filter(
            customer =>
                customer.active !== false
        );


    const records =
        db.deliveries.filter(
            delivery =>
                delivery.date ===
                selectedDate
        );


    const delivered =
        records.filter(
            record =>
                record.status ===
                "delivered"
        );


    const skipped =
        records.filter(
            record =>
                record.status ===
                "skipped"
        );


    const milk =
        delivered.reduce(
            (
                total,
                record
            ) =>
                total +
                Number(
                    record.qty
                ),
            0
        );


    const value =
        delivered.reduce(
            (
                total,
                record
            ) =>
                total +
                (
                    Number(
                        record.qty
                    ) *
                    Number(
                        record.rate
                    )
                ),
            0
        );


    const percentage =
        customers.length
            ? Math.round(
                delivered.length /
                customers.length *
                100
            )
            : 0;


    setReportText(
        [
            "totalCustomers",
            "reportCustomers"
        ],
        customers.length
    );


    setReportText(
        [
            "delivered",
            "reportDelivered"
        ],
        delivered.length
    );


    setReportText(
        [
            "skipped",
            "reportSkipped"
        ],
        skipped.length
    );


    setReportText(
        [
            "totalMilk",
            "reportMilk"
        ],
        milk + " L"
    );


    setReportText(
        [
            "deliveredValue",
            "reportValue",
            "todayValue"
        ],
        money(value)
    );


    setReportWidth(
        [
            "reportProgress",
            "progressBar"
        ],
        percentage
    );


    setReportText(
        [
            "reportPercentage",
            "percentage"
        ],
        percentage +
        "% completed"
    );


    renderReportDetails(
        records
    );

}


/* =========================================================
   REPORT DETAILS
   ========================================================= */

function renderReportDetails(
    records
) {

    const container =
        document.getElementById(
            "summary"
        ) ||
        document.getElementById(
            "reportList"
        ) ||
        document.getElementById(
            "reportDetails"
        );


    if (!container) return;


    if (!records.length) {

        container.innerHTML = `

            <div class="empty">

                No delivery records
                for this date.

            </div>

        `;

        return;

    }


    const delivered =
        records.filter(
            r =>
                r.status ===
                "delivered"
        ).length;


    const skipped =
        records.filter(
            r =>
                r.status ===
                "skipped"
        ).length;


    container.innerHTML = `

        <div class="between"
             style="padding:10px 0;">

            <span>
                ✓ Delivered
            </span>

            <b>
                ${delivered}
            </b>

        </div>


        <div class="between"
             style="padding:10px 0;">

            <span>
                ⏭️ Skipped
            </span>

            <b>
                ${skipped}
            </b>

        </div>


        <hr>


        ${
            records
                .sort(
                    (a, b) =>
                        (
                            a.customer || ""
                        ).localeCompare(
                            b.customer || ""
                        )
                )
                .map(
                    record => `

                    <div
                        class="between"
                        style="
                            padding:10px 0;
                            border-bottom:
                            1px solid var(--border);
                        ">

                        <span>

                            ${esc(
                                record.customer
                            )}

                        </span>


                        ${
                            record.status ===
                            "delivered"

                                ?

                                `<span
                                    class="badge badge-green">

                                    ${record.qty} L

                                </span>`

                                :

                                `<span
                                    class="badge badge-red">

                                    Skipped

                                </span>`
                        }

                    </div>

                `
                )
                .join("")
        }

    `;

}


/* =========================================================
   HELPERS
   ========================================================= */

function setReportText(
    ids,
    value
) {

    ids.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.textContent =
                    value;

            }

        }
    );

}


function setReportWidth(
    ids,
    value
) {

    ids.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.style.width =
                    value + "%";

            }

        }
    );

}
