import { 
    collection, 
    query, 
    where,
    orderBy, 
    getDocs, 
    addDoc,
    updateDoc,
    doc,
    getDoc,
    serverTimestamp,
    Timestamp,
    limit,
    writeBatch
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
    deliveryDate,
    pickupDate,
    agreement: !!agreement,
    status: "pending",
    paid: false,
    receiptNo: null,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  };

  const docRef = await addDoc(rentalsCol, payload);

  return { id: docRef.id, ...payload };
};

const getCurrentRentals = async (sort = 'delivery', order = 'asc') => {
  const today = new Date().toISOString().split('T')[0]; // "2026-03-21"

  const sortBy =
    sort === 'name' ? 'name' :
    sort === 'org' ? 'organization' :
    sort === 'size' ? 'size' :
    'deliveryDate';
  const sortOrder = 
    order === 'asc' ? 'asc' : 'desc';

  //do not include rentals where today is their pickup date
  const q = query(
    rentalsCol,
    where('deliveryDate', '<=', today),
    where('pickupDate', '>', today),
    where('paid', '==', true),
    orderBy(sortBy, sortOrder)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((rentalDoc) => ({
    id: rentalDoc.id,
    ...rentalDoc.data()
  }));
};

const getAllRentals = async (sort = 'delivery', order = 'desc') => {
  const now = new Date().toISOString().split('T')[0];
  const sortBy =
    sort === 'name' ? 'name' :
    sort === 'org' ? 'organization' :
    sort === 'paid' ? 'paid' :
    sort === 'pickup' ? 'pickupDate' :
    sort === 'status' ? 'status' :
    sort === 'size' ? 'size' :
    'deliveryDate';
  const sortOrder = 
    order === 'asc' ? 'asc' : 'desc';

  const completed = await getDocs(
    query(rentalsCol,
      where('status', '==', 'pending'),
      where('paid', '==', true),
      where('pickupDate', '<', now)
    )
  );

  if (!completed.empty) {
    const batch = writeBatch(db);
    completed.forEach(doc => batch.update(doc.ref, { status: "completed" }));
    await batch.commit();
  }

  const cancelled = await getDocs(
    query(rentalsCol,
      where('status', '==', 'pending'),
      where('paid', '==', false),
      where('pickupDate', '<', now)
    )
  )
  
  if (!cancelled.empty) {
    const batch = writeBatch(db);
    cancelled.forEach(doc => batch.update(doc.ref, { status: "cancelled" }));
    await batch.commit();
  }

  const snapshot = await getDocs(
    query(rentalsCol,
      orderBy(sortBy, sortOrder)
    )
  );
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};

const getUserRentals = async (userId) => {
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

const updateRental = async (rentalId, {
  size,
  name,
  phone,
  organization = "",
  address,
  placement = "",
  deliveryDate,
  pickupDate,
  receiptNo = "",
  status
}) => {
  const payload = {
    size,
    name,
    phone,
    organization,
    address,
    placement,
    deliveryDate,
    pickupDate,
    status,
    paid: !!receiptNo,
    receiptNo: receiptNo,
    lastUpdated: serverTimestamp()
  };

  const docRef = doc(rentalsCol, rentalId);
  await updateDoc(docRef, payload);
  return { id: docRef.id, ...payload };
};

const checkHistory = async (userId) => {
  const today = new Date();
  const year = today.getFullYear();
  const yearStart = `${year}-01-01`;

  const q = query(
    rentalsCol, 
    where("userId", "==", userId),
    where("deliveryDate", ">=", yearStart)
  );
    
  const snapshot = await getDocs(q);
  return snapshot.docs.map((rentalDoc) => ({
    id: rentalDoc.id,
    ...rentalDoc.data()
  }));
};

const getFutureRentals = async () => {
  const thursDates = [1, 2, 3]; //days of the week where Thursday will be the next rental
  const monDates = [0, 4, 5, 6]; //days of the week where Monday will be the next rental
  const today = new Date();
  const currDay = today.getDay();

  const sortBy =
    sort === 'name' ? 'name' :
    sort === 'org' ? 'organization' :
    sort === 'size' ? 'size' :
    'deliveryDate';
  const sortOrder = 
    order === 'asc' ? 'asc' : 'desc';

  let q;

  if(thursDates.includes(currDay)) {
    let timeToNextRental = 4 - currDay;
    let futureRental = new Date();
    futureRental.setDate(today.getDate() + timeToNextRental);
    futureRental = futureRental.toISOString().split('T')[0];
    
    q = query(
      rentalsCol,
      where('deliveryDate', '<=', futureRental),
      where('pickupDate', '>', futureRental),
      where('paid', '==', true)
    );
  } else if (monDates.includes(currDay)) {
    let timeToNextRental = (1 - currDay + 7) % 7;
    let futureRental = new Date();
    futureRental.setDate(today.getDate() + timeToNextRental);
    futureRental = futureRental.toISOString().split('T')[0];

    q = query(
      rentalsCol,
      where('deliveryDate', '<=', futureRental),
      where('pickupDate', '>', futureRental),
      where('paid', '==', true)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((rentalDoc) => ({
    id: rentalDoc.id,
    ...rentalDoc.data()
  }));
};

export {
    createRental,
    getUserRentals,
    findById,
    getAllRentals,
    getCurrentRentals,
    checkAvailability,
    updateRental,
    checkHistory,
    getFutureRentals
};
