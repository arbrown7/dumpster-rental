import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc,
    doc,
    getDoc,
    serverTimestamp,
    Timestamp,
    limit
} from "firebase/firestore";
import { db } from "../../config/firebase.js";

const rentalsCol = collection(db, "rentals");
const dumpstersCol = collection(db, "dumpsters");
const totalDumpstersPerDay = 5;

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
    deliveryDate: deliveryDate,
    pickupDate: pickupDate,
    agreement: !!agreement,
    status: "pending",
    paid: false,
    receiptNo: null,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(rentalsCol, payload);

  // Return something your controller can use
  return { id: docRef.id, ...payload };
};

const getCurrentRentals = async () => {
  const today = new Date().toISOString().split('T')[0]; // "2026-03-21"

  //do not include rentals where today is their pickup date
  const q = query(
    rentalsCol,
    where('deliveryDate', '<=', today),
    where('pickupDate', '>', today)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((rentalDoc) => ({
    id: rentalDoc.id,
    ...rentalDoc.data()
  }));
};

const getAllRentals = async () => {
  const snapshot = await getDocs(rentalsCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};

const findHistory = async () => {
  return [];
};

const updateStatus = async () => {
  return null;
};

const findByUserId = async (userId) => {
  const q = query(rentalsCol, where("userId", "==", userId));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((rentalDoc) => ({
    id: rentalDoc.id,
    ...rentalDoc.data()
  }));
};

const findById = async (rentalId) => {
  const rentalRef = doc(rentalsCol, rentalId);
  const snapshot = await getDoc(rentalRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  };
};

const checkAvailability = async (size, deliveryDate) => {
  const selectedDeliveryDate = deliveryDate;
  let currentSizeRentals = 0;
  let totalRentals = 0;
  let dumpsterInventory = 0;

  const rentalQ = query(
    rentalsCol, 
    where("size", "==", size), 
    where("deliveryDate", "==", selectedDeliveryDate)
  );

  const dayQ = query(
    rentalsCol,
    where("deliveryDate", "==", selectedDeliveryDate)
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
    getAllRentals,
    getCurrentRentals,
    findHistory,
    updateStatus,
    checkAvailability
};