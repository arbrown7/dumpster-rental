import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc,
    serverTimestamp
} from "firebase/firestore";

/**
 * Core function that creates a rental based on user input.
 * 
 * @param {number} size - Size of dumpster
 * @param {string} organization - HOA or organization associated with rental (if applicable)
 * @param {string} address - Address of rental
 * @param {string} placement - Placement instructions for dumpster
 * @param {date} deliveryDate - Delivery date
 * @param {date} pickupDate - Pickup date
 * @param {bool} agreement - Customer's agreement to the requirements of the contract
 * @returns {?} - I don't know if this needs to return anything...
 */
const createRental = async (
        size,
		organization,
		address,
		placement,
		deliveryDate,
		pickupDate,
		agreement) => {

    //TODO: find dumpster id
    
    const docRef = await addDoc(collection(db, "rental"), {
    size,
    organization,
    address,
    placement,
    deliveryDate,
    pickupDate,
    agreement,
    creationDate: serverTimestamp()
    });

    console.log("Created document with ID:", docRef.id);

    //TODO: figure out what to return here
};


/**
 * Finds all current rentals, meaning the current date is 
 * between their delivery and pickup dates AND the rental 
 * has been marked as paid.
 * 
 * @returns {id, name, phone, address, size, placement, deliveryDate, pickupDate, receiptNo, creationDate}
 */
const findCurrent = async () => {
    let currentDate = Date.now();
    //TODO: figure out how dates will be stored in the database

    //const q = query(collection(db, "rental"), where())
};

/**
 * Finds all past rentals, meaning their pickup date has passed.
 * 
 * @returns {?}
 */
const findHistory = async () => {

};

/**
 * Updates the status of a rental
 * 
 * @param {number} rentalId - rental ID
 * @param {string} status - new status
 * @returns {?}
 */
const updateStatus = async () => {

};

const findByUserId = async (userId) => {
    const q = query(collection(db, "rental"), where("userId", "==", userId));

    const snapshot = await getDocs(q);
    return snapshot;
};

const findById = async (rentalId) => {
    const q = query(collection(db, "rental"), where("id", "==", rentalId));

    const snapshot = await getDocs(q);
    return snapshot;
};

export {
    createRental,
    findByUserId,
    findById,
    findCurrent,
    findHistory,
    updateStatus
};