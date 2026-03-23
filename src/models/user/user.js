import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where
} from "firebase/firestore";
import { db } from "../../config/firebase.js";

const usersCollection = collection(db, "users");

const findUserByUsername = async (username) => {
    const normalized = username.trim().toLowerCase();
    const usernameQuery = query(usersCollection, where("usernameLower", "==", normalized));
    const snapshot = await getDocs(usernameQuery);

    if (snapshot.empty) {
        return null;
    }

    const firstDoc = snapshot.docs[0];
    return {
        id: firstDoc.id,
        ...firstDoc.data()
    };
};

const createUser = async ({ username, passwordHash, passwordSalt }) => {
    const normalizedUsername = username.trim();
    const payload = {
        username: normalizedUsername,
        usernameLower: normalizedUsername.toLowerCase(),
        passwordHash,
        passwordSalt,
        createdAt: serverTimestamp(),
        role: 'renter'
    };

    const created = await addDoc(usersCollection, payload);
    return {
        id: created.id,
        username: payload.username
    };
};

export { findUserByUsername, createUser };