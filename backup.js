/* =========================================================
   MILK MANAGER
   DATABASE BACKUP & RESTORE
========================================================= */


/* =========================================================
   GET DATABASE
========================================================= */

function getBackupDatabase() {

    /*
       Prefer the existing database.js function.
    */

    if (
        typeof getDB === "function"
    ) {

        return getDB();

    }


    /*
       Fallback to localStorage.
    */

    try {

        const saved =
            localStorage.getItem(
                "milkManagerDB"
            );


        if (saved) {

            return JSON.parse(
                saved
            );

        }

    }

    catch (error) {

        console.error(
            "Database read error:",
            error
        );

    }


    /*
       Empty database fallback.
    */

    return {

        customers: [],

        deliveries: [],

        payments: [],

        products: []

    };

}


/* =========================================================
   SAVE DATABASE
========================================================= */

function saveBackupDatabase(
    database
) {

    /*
       Use existing saveDB()
       if available.
    */

    if (
        typeof saveDB === "function"
    ) {

        saveDB(
            database
        );

        return true;

    }


    /*
       Fallback.
    */

    try {

        localStorage.setItem(
            "milkManagerDB",
            JSON.stringify(
                database
            )
        );


        return true;

    }

    catch (error) {

        console.error(
            "Database save error:",
            error
        );

        return false;

    }

}


/* =========================================================
   CREATE BACKUP OBJECT
========================================================= */

function createBackup() {

    const database =
        getBackupDatabase();


    return {

        app:
            "Milk Manager",

        version:
            "1.0",

        backupDate:
            new Date().toISOString(),

        data:
            database

    };

}


/* =========================================================
   DOWNLOAD BACKUP
========================================================= */

function downloadBackup() {

    try {

        const backup =
            createBackup();


        const json =
            JSON.stringify(
                backup,
                null,
                2
            );


        const blob =
            new Blob(
                [json],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        const now =
            new Date();


        const date =
            now
                .toISOString()
                .slice(
                    0,
                    10
                );


        link.href =
            url;


        link.download =
            `milk-manager-backup-${date}.json`;


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );


        alert(
            "✅ Database backup downloaded successfully."
        );

    }

    catch (error) {

        console.error(
            "Backup error:",
            error
        );


        alert(
            "❌ Backup failed. Please try again."
        );

    }

}


/* =========================================================
   RESTORE BACKUP
========================================================= */

function restoreBackup(
    file
) {

    if (!file) {

        return;

    }


    const confirmed =
        confirm(

            "⚠️ Restore Backup\n\n" +

            "This will replace the current " +
            "Milk Manager database with the " +
            "data from this backup.\n\n" +

            "Make sure you have a backup of " +
            "your current data before continuing.\n\n" +

            "Continue?"

        );


    if (!confirmed) {

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            try {

                const backup =
                    JSON.parse(
                        event.target.result
                    );


                /*
                   Validate backup.
                */

                if (
                    !backup ||
                    backup.app !==
                    "Milk Manager"
                ) {

                    alert(
                        "❌ This is not a valid Milk Manager backup file."
                    );

                    return;

                }


                if (
                    !backup.data
                ) {

                    alert(
                        "❌ Backup data is missing."
                    );

                    return;

                }


                /*
                   Make sure important
                   database arrays exist.
                */

                const restoredDB = {

                    ...backup.data,

                    customers:
                        Array.isArray(
                            backup.data.customers
                        )
                            ? backup.data.customers
                            : [],

                    deliveries:
                        Array.isArray(
                            backup.data.deliveries
                        )
                            ? backup.data.deliveries
                            : [],

                    payments:
                        Array.isArray(
                            backup.data.payments
                        )
                            ? backup.data.payments
                            : [],

                    products:
                        Array.isArray(
                            backup.data.products
                        )
                            ? backup.data.products
                            : []

                };


                /*
                   Save database.
                */

                const success =
                    saveBackupDatabase(
                        restoredDB
                    );


                if (!success) {

                    alert(
                        "❌ Could not save restored database."
                    );

                    return;

                }


                /*
                   Notify user.
                */

                alert(

                    "✅ Database restored successfully!\n\n" +

                    "Customers: " +
                    restoredDB.customers.length +

                    "\nDeliveries: " +
                    restoredDB.deliveries.length +

                    "\nPayments: " +
                    restoredDB.payments.length +

                    "\nProducts: " +
                    restoredDB.products.length +

                    "\n\nThe page will now reload."

                );


                /*
                   Reload all pages/data.
                */

                window.location.reload();

            }

            catch (error) {

                console.error(
                    "Restore error:",
                    error
                );


                alert(
                    "❌ Invalid or corrupted backup file."
                );

            }

        };


    reader.onerror =
        function() {

            alert(
                "❌ Could not read backup file."
            );

        };


    reader.readAsText(
        file
    );

}


/* =========================================================
   BACKUP BUTTON
========================================================= */

const backupButton =
    document.getElementById(
        "backupButton"
    );


if (backupButton) {

    backupButton.addEventListener(
        "click",
        function() {

            const confirmed =
                confirm(

                    "Create a backup of all Milk Manager data?\n\n" +

                    "The backup will include:\n" +

                    "• Customers\n" +
                    "• Deliveries\n" +
                    "• Payments\n" +
                    "• Products"

                );


            if (!confirmed) {

                return;

            }


            downloadBackup();

        }
    );

}


/* =========================================================
   RESTORE BUTTON
========================================================= */

const restoreButton =
    document.getElementById(
        "restoreButton"
    );


const restoreFile =
    document.getElementById(
        "restoreFile"
    );


if (
    restoreButton &&
    restoreFile
) {

    restoreButton.addEventListener(
        "click",
        function() {

            restoreFile.value =
                "";

            restoreFile.click();

        }
    );


    restoreFile.addEventListener(
        "change",
        function() {

            const file =
                restoreFile.files[0];


            if (file) {

                restoreBackup(
                    file
                );

            }

        }
    );

}


/* =========================================================
   READY
========================================================= */

console.log(
    "Milk Manager Backup & Restore loaded."
);