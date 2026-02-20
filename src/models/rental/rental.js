import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc,
    serverTimestamp
} from "firebase/firestore";

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

const findCurrent = async () => {

};

const findHistory = async () => {

};

const updateStatus = async () => {

};

export {
    createRental,
    findByUserId,
    findById,
    findCurrent,
    findHistory,
    updateStatus
};