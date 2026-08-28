/* =========================================================
   MILK MANAGER
   settings.js
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadSettings();

        setupSettingsForm();

        setupBackupButtons();

    }
);


/* =========================================================
   LOAD SETTINGS
   ========================================================= */

function loadSettings() {

    const db = getDB();


    setSettingValue(
        [
            "businessName",
            "business",
            "distributorName"
        ],
        db.business ||
        "My Milk Distribution"
    );

}


/* =========================================================
   SETTINGS FORM
   ========================================================= */

function setupSettingsForm() {

    const form =
        document.getElementById(
            "settingsForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const business =
                getSettingValue([
                    "businessName",
                    "business",
                    "distributorName"
                ]);


            if (!business) {

                alert(
                    "Please enter business name."
                );

                return;

            }


            const db = getDB();


            db.business =
                business;


            saveDB(db);


            toast(
                "Settings saved ✓"
            );

        }
    );

}


/* =========================================================
   BACKUP
   ========================================================= */

function setupBackupButtons() {

    const backup =
        document.getElementById(
            "backupBtn"
        ) ||
        document.getElementById(
            "exportBtn"
        );


    if (backup) {

        backup.addEventListener(
            "click",
            exportBackup
        );

    }


    const restore =
        document.getElementById(
            "restoreFile"
        );


    if (restore) {

        restore.addEventListener(
            "change",
            importBackup
        );

    }


    const clear =
        document.getElementById(
            "clearDataBtn"
        ) ||
        document.getElementById(
            "resetDataBtn"
        );


    if (clear) {

        clear.addEventListener(
            "click",
            clearAllData
        );

    }

}


/* =========================================================
   EXPORT
   ========================================================= */

function exportBackup() {

    const db = getDB();


    const data =
        JSON.stringify(
            db,
            null,
            2
        );


    const blob =
        new Blob(
            [data],
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


    link.href =
        url;


    link.download =
        "milk-manager-backup-" +
        today() +
        ".json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    toast(
        "Backup exported ✓"
    );

}


/* =========================================================
   IMPORT
   ========================================================= */

function importBackup(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        function () {

            try {

                const imported =
                    JSON.parse(
                        reader.result
                    );


                if (
                    !imported ||
                    !Array.isArray(
                        imported.customers
                    ) ||
                    !Array.isArray(
                        imported.deliveries
                    )
                ) {

                    throw new Error(
                        "Invalid backup"
                    );

                }


                if (
                    !Array.isArray(
                        imported.payments
                    )
                ) {

                    imported.payments =
                        [];

                }


                const confirmRestore =
                    confirm(
                        "Restore this backup? Current data will be replaced."
                    );


                if (!confirmRestore) {

                    return;

                }


                saveDB({

                    business:
                        imported.business ||
                        "My Milk Distribution",

                    customers:
                        imported.customers,

                    deliveries:
                        imported.deliveries,

                    payments:
                        imported.payments

                });


                loadSettings();


                toast(
                    "Backup restored ✓"
                );


            }

            catch (error) {

                alert(
                    "Invalid backup file."
                );


                console.error(
                    error
                );

            }

        };


    reader.readAsText(
        file
    );

}


/* =========================================================
   CLEAR DATA
   ========================================================= */

function clearAllData() {

    const firstConfirm =
        confirm(
            "Are you sure you want to delete all Milk Manager data?"
        );


    if (!firstConfirm) {

        return;

    }


    const secondConfirm =
        confirm(
            "This cannot be undone. Continue?"
        );


    if (!secondConfirm) {

        return;

    }


    localStorage.removeItem(
        "milkManagerV3"
    );


    location.reload();

}


/* =========================================================
   SETTINGS HELPERS
   ========================================================= */

function getSettingValue(ids) {

    for (
        const id of ids
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            return element.value.trim();

        }

    }


    return "";

}


function setSettingValue(
    ids,
    value
) {

    for (
        const id of ids
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.value =
                value;

            return;

        }

    }

}