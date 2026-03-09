import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import { db } from "../../config/firebase.js";

const rentalsCol = collection(db, "rentals");

const toTimestamp = (yyyy_mm_dd) => {
  // if it's already a Date, keep it
  if (yyyy_mm_dd instanceof Date) return Timestamp.fromDate(yyyy_mm_dd);
  // assume "YYYY-MM-DD"
  return Timestamp.fromDate(new Date(`${yyyy_mm_dd}T00:00:00`));
};

//TODO: add rental id sequentially
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
const createRental = async ({
  userId = null,
  size,
  name,
  phone,
  organization = "",
  address,
  placement = "",
  deliveryDate,
  pickupDate,
  agreement
}) => {
  const payload = {
    userId,
    size,
    name,
    phone,
    organization,
    address,
    placement,
    deliveryDate: toTimestamp(deliveryDate),
    pickupDate: toTimestamp(pickupDate),
    agreement: !!agreement,
    status: "pending",
    paid: false,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(rentalsCol, payload);

  // Return something your controller can use
  return { id: docRef.id, ...payload };
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