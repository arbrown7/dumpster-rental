import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc,
    serverTimestamp,
    Timestamp,
    limit
} from "firebase/firestore";
import { db } from "../../config/firebase.js";

const rentalsCol = collection(db, "rentals");
const dumpstersCol = collection(db, "dumpsters");
const totalDumpstersPerDay = 5;

const toTimestamp = (yyyy_mm_dd) => {
  // if it's already a Date, keep it
  if (yyyy_mm_dd instanceof Date) return Timestamp.fromDate(yyyy_mm_dd);
  // assume "YYYY-MM-DD"
  return Timestamp.fromDate(new Date(`${yyyy_mm_dd}T00:00:00`));
};

//TODO: add rental id sequentially
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
    deliveryDate,
    pickupDate,
    agreement: !!agreement,
    status: "pending",
    paid: false,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(rentalsCol, payload);

  // Return something your controller can use
  return { id: docRef.id, ...payload };
};

const findCurrent = async () => {
    let currentDate = Date.now();
    //TODO: figure out how dates will be stored in the database

    //const q = query(collection(db, "rental"), where())
};

const findHistory = async () => {

};

const updateStatus = async () => {

};

const findByUserId = async (userId) => {
  const q = query(rentalsCol, where("userId", "==", userId));

  const snapshot = await getDocs(q);
  return snapshot;
};

const findById = async (rentalId) => {
  const q = query(rentalsCol, where("id", "==", rentalId));

  const snapshot = await getDocs(q);
  return snapshot;
};

const checkAvailability = async (size, deliveryDate) => {
  let currentSizeRentals = 0;
  let totalRentals = 0;
  let dumpsterInventory = 0;

  const rentalQ = query(
    rentalsCol, 
    where("size", "==", size), 
    where("deliveryDate", "==", deliveryDate)
  );

  const dayQ = query(
    rentalsCol,
    where("deliveryDate", "==", deliveryDate)
  );

  const dumpsterQ = query(
    dumpstersCol,
    where("size", "==", size),
    limit(1)
  );

  try {
    const snapshot = await getDocs(rentalQ);
    currentSizeRentals = snapshot.size;
  } catch (error) {
    console.error('Error retrieving currentSizeRentals:', error);
  }

  try {
    const snapshot = await getDocs(dayQ);
    totalRentals = snapshot.size;
  } catch (error) {
    console.error('Error retrieving totalRentals:', error);
  }

  try {
    const snapshot = await getDocs(dumpsterQ);
    if (!snapshot.empty) {
      dumpsterInventory = snapshot.docs[0].data().inventory;
    }

  } catch (error) {
    console.error('Error retrieving dmupsterInventory:', error);
  }

  if(currentSizeRentals < dumpsterInventory) {
    if(totalRentals < totalDumpstersPerDay) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export {
    createRental,
    findByUserId,
    findById,
    findCurrent,
    findHistory,
    updateStatus,
    checkAvailability
};