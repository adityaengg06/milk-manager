/* =========================================================
   MILK MANAGER - DATABASE
   V1 LOCAL STORAGE DATABASE
   ========================================================= */

const DB_KEY = "milkManagerDB";

/* =========================================================
   DEFAULT DATABASE
   ========================================================= */

const defaultDB = {
    customers: [
        {
            id: "C001",
            name: "Rajesh Kumar",
            phone: "8888888888",
            address: "House 24, Sector 5",
            milk: 2,
            milkRate: 55,
            products: {
                paneer: 0,
                curd: 0,
                ghee: 0
            },
            active: true,
            createdAt: new Date().toISOString()
        },
        {
            id: "C002",
            name: "Amit Sharma",
            phone: "9999999999",
            address: "House 18, Sector 5",
            milk: 1,
            milkRate: 55,
            products: {
                paneer: 0,
                curd: 0,
                ghee: 0
            },
            active: true,
            createdAt: new Date().toISOString()
        },
        {
            id: "C003",
            name: "Sunita Verma",
            phone: "7777777777",
            address: "House 31, Sector 6",
            milk: 2,
            milkRate: 55,
            products: {
                paneer: 0,
                curd: 0,
                ghee: 0
            },
            active: true,
            createdAt: new Date().toISOString()
        }
    ],

    deliveries: [],

    payments: [],

    products: [
        {
            id: "P001",
            name: "Milk",
            unit: "L",
            rate: 55
        },
        {
            id: "P002",
            name: "Paneer",
            unit: "kg",
            rate: 320
        },
        {
            id: "P003",
            name: "Curd",
            unit: "kg",
            rate: 90
        },
        {
            id: "P004",
            name: "Ghee",
            unit: "kg",
            rate: 650
        }
    ],

    settings: {
        businessName: "Your Milk Distribution",
        distributorName: "Milk Manager"
    }
};


/* =========================================================
   INITIALIZE DATABASE
   ========================================================= */

function initializeDatabase() {

    const existing = localStorage.getItem(DB_KEY);

    if (!existing) {
        localStorage.setItem(
            DB_KEY,
            JSON.stringify(defaultDB)
        );
    }
}


/* =========================================================
   GET DATABASE
   ========================================================= */

function getDB() {

    initializeDatabase();

    try {

        return JSON.parse(
            localStorage.getItem(DB_KEY)
        );

    } catch (error) {

        console.error("Database error:", error);

        localStorage.setItem(
            DB_KEY,
            JSON.stringify(defaultDB)
        );

        return JSON.parse(
            JSON.stringify(defaultDB)
        );
    }
}


/* =========================================================
   SAVE DATABASE
   ========================================================= */

function saveDB(db) {

    localStorage.setItem(
        DB_KEY,
        JSON.stringify(db)
    );
}


/* =========================================================
   GENERATE ID
   ========================================================= */

function generateID(prefix) {

    return (
        prefix +
        Date.now().toString().slice(-8)
    );
}


/* =========================================================
   CUSTOMER FUNCTIONS
   ========================================================= */

function getCustomers() {

    const db = getDB();

    return db.customers.filter(
        customer => customer.active !== false
    );
}


function getAllCustomers() {

    const db = getDB();

    return db.customers;
}


function getCustomer(id) {

    const db = getDB();

    return db.customers.find(
        customer => customer.id === id
    );
}


/* =========================================================
   ADD CUSTOMER
   ========================================================= */

function addCustomer(customerData) {

    const db = getDB();

    const customer = {

        id: generateID("C"),

        name: customerData.name || "",

        phone: customerData.phone || "",

        address: customerData.address || "",

        milk: Number(customerData.milk) || 0,

        milkRate:
            Number(customerData.milkRate) || 55,

        products: {

            paneer:
                Number(customerData.paneer) || 0,

            curd:
                Number(customerData.curd) || 0,

            ghee:
                Number(customerData.ghee) || 0
        },

        active: true,

        createdAt:
            new Date().toISOString()
    };

    db.customers.push(customer);

    saveDB(db);

    return customer;
}


/* =========================================================
   UPDATE CUSTOMER
   ========================================================= */

function updateCustomer(id, updatedData) {

    const db = getDB();

    const customer =
        db.customers.find(
            c => c.id === id
        );

    if (!customer) {
        return null;
    }

    customer.name =
        updatedData.name ?? customer.name;

    customer.phone =
        updatedData.phone ?? customer.phone;

    customer.address =
        updatedData.address ?? customer.address;

    customer.milk =
        Number(updatedData.milk ?? customer.milk);

    customer.milkRate =
        Number(
            updatedData.milkRate ??
            customer.milkRate
        );

    customer.products = {

        paneer:
            Number(
                updatedData.paneer ??
                customer.products?.paneer ??
                0
            ),

        curd:
            Number(
                updatedData.curd ??
                customer.products?.curd ??
                0
            ),

        ghee:
            Number(
                updatedData.ghee ??
                customer.products?.ghee ??
                0
            )
    };

    saveDB(db);

    return customer;
}


/* =========================================================
   DELETE CUSTOMER
   ========================================================= */

function deleteCustomer(id) {

    const db = getDB();

    const customer =
        db.customers.find(
            c => c.id === id
        );

    if (!customer) {
        return false;
    }

    /*
       We don't permanently remove the customer.
       We mark them inactive so their old bills/history
       remain available.
    */

    customer.active = false;

    saveDB(db);

    return true;
}


/* =========================================================
   DELIVERY FUNCTIONS
   ========================================================= */

function saveDelivery(deliveryData) {

    const db = getDB();

    const delivery = {

        id: generateID("D"),

        customerId:
            deliveryData.customerId,

        date:
            deliveryData.date ||
            getToday(),

        milk:
            Number(deliveryData.milk) || 0,

        paneer:
            Number(deliveryData.paneer) || 0,

        curd:
            Number(deliveryData.curd) || 0,

        ghee:
            Number(deliveryData.ghee) || 0,

        status:
            deliveryData.status || "delivered",

        createdAt:
            new Date().toISOString()
    };

    db.deliveries.push(delivery);

    saveDB(db);

    return delivery;
}


/* =========================================================
   GET DELIVERY FOR CUSTOMER
   ========================================================= */

function getCustomerDeliveries(
    customerId,
    month = null
) {

    const db = getDB();

    let deliveries =
        db.deliveries.filter(
            delivery =>
                delivery.customerId === customerId
        );

    if (month) {

        deliveries =
            deliveries.filter(
                delivery =>
                    delivery.date.startsWith(month)
            );
    }

    return deliveries;
}


/* =========================================================
   GET TODAY'S DELIVERIES
   ========================================================= */

function getTodayDeliveries() {

    const today = getToday();

    const db = getDB();

    return db.deliveries.filter(
        delivery =>
            delivery.date === today
    );
}


/* =========================================================
   PAYMENT FUNCTIONS
   ========================================================= */

function savePayment(paymentData) {

    const db = getDB();

    const payment = {

        id: generateID("PAY"),

        customerId:
            paymentData.customerId,

        amount:
            Number(paymentData.amount) || 0,

        date:
            paymentData.date ||
            getToday(),

        mode:
            paymentData.mode || "Cash",

        note:
            paymentData.note || "",

        createdAt:
            new Date().toISOString()
    };

    db.payments.push(payment);

    saveDB(db);

    return payment;
}


/* =========================================================
   GET CUSTOMER PAYMENTS
   ========================================================= */

function getCustomerPayments(
    customerId,
    month = null
) {

    const db = getDB();

    let payments =
        db.payments.filter(
            payment =>
                payment.customerId === customerId
        );

    if (month) {

        payments =
            payments.filter(
                payment =>
                    payment.date.startsWith(month)
            );
    }

    return payments;
}


/* =========================================================
   TOTAL PAYMENTS
   ========================================================= */

function getTotalPayments(
    customerId,
    month = null
) {

    const payments =
        getCustomerPayments(
            customerId,
            month
        );

    return payments.reduce(
        (total, payment) =>
            total + Number(payment.amount),
        0
    );
}


/* =========================================================
   BILL CALCULATION
   ========================================================= */

function calculateCustomerBill(
    customerId,
    yearMonth
) {

    const customer =
        getCustomer(customerId);

    if (!customer) {
        return null;
    }

    const deliveries =
        getCustomerDeliveries(
            customerId,
            yearMonth
        );

    const milkRate =
        Number(customer.milkRate) || 55;

    const milk =
        deliveries.reduce(
            (total, delivery) =>
                total +
                Number(delivery.milk || 0),
            0
        );

    const paneer =
        deliveries.reduce(
            (total, delivery) =>
                total +
                Number(delivery.paneer || 0),
            0
        );

    const curd =
        deliveries.reduce(
            (total, delivery) =>
                total +
                Number(delivery.curd || 0),
            0
        );

    const ghee =
        deliveries.reduce(
            (total, delivery) =>
                total +
                Number(delivery.ghee || 0),
            0
        );

    const paneerRate = 320;
    const curdRate = 90;
    const gheeRate = 650;

    const milkAmount =
        milk * milkRate;

    const paneerAmount =
        paneer * paneerRate;

    const curdAmount =
        curd * curdRate;

    const gheeAmount =
        ghee * gheeRate;

    const subtotal =
        milkAmount +
        paneerAmount +
        curdAmount +
        gheeAmount;

    const paid =
        getTotalPayments(
            customerId,
            yearMonth
        );

    const outstanding =
        Math.max(
            0,
            subtotal - paid
        );

    return {

        customer,

        billingMonth: yearMonth,

        billingDays: deliveries.length,

        items: {

            milk: {
                quantity: milk,
                unit: "L",
                rate: milkRate,
                amount: milkAmount
            },

            paneer: {
                quantity: paneer,
                unit: "kg",
                rate: paneerRate,
                amount: paneerAmount
            },

            curd: {
                quantity: curd,
                unit: "kg",
                rate: curdRate,
                amount: curdAmount
            },

            ghee: {
                quantity: ghee,
                unit: "kg",
                rate: gheeRate,
                amount: gheeAmount
            }
        },

        subtotal,

        paid,

        outstanding
    };
}


/* =========================================================
   DATE
   ========================================================= */

function getToday() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* =========================================================
   CURRENT MONTH
   ========================================================= */

function getCurrentMonth() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    return `${year}-${month}`;
}


/* =========================================================
   MONTHLY MILK TOTAL
   ========================================================= */

function getMonthlyMilk(
    customerId,
    yearMonth
) {

    const deliveries =
        getCustomerDeliveries(
            customerId,
            yearMonth
        );

    return deliveries.reduce(
        (total, delivery) =>
            total +
            Number(delivery.milk || 0),
        0
    );
}


/* =========================================================
   DELIVERY STATUS
   ========================================================= */

function isDelivered(
    customerId,
    date = getToday()
) {

    const db = getDB();

    return db.deliveries.some(
        delivery =>
            delivery.customerId === customerId &&
            delivery.date === date &&
            delivery.status === "delivered"
    );
}


/* =========================================================
   DATABASE RESET
   ========================================================= */

function resetDatabase() {

    const confirmed =
        confirm(
            "Reset all Milk Manager data? This cannot be undone."
        );

    if (!confirmed) {
        return false;
    }

    localStorage.removeItem(DB_KEY);

    initializeDatabase();

    location.reload();

    return true;
}


/* =========================================================
   EXPORT DATABASE
   ========================================================= */

function exportDatabase() {

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
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "milk-manager-backup.json";

    link.click();

    URL.revokeObjectURL(url);
}


/* =========================================================
   START DATABASE
   ========================================================= */

initializeDatabase();

console.log(
    "Milk Manager database loaded successfully."
);