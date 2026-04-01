import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
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

const findUserById = async (userId) => {
    const userRef = doc(usersCollection, userId);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };
};

const updateUser = async (userId, { username, passwordHash, passwordSalt }) => {
    const userRef = doc(usersCollection, userId);

    const payload = {
        lastUpdated: serverTimestamp()
    };

    if (username !== undefined) {
        payload.username = username.trim();
        payload.usernameLower = username.trim().toLowerCase();
    }
    if (passwordHash !== undefined) {
        payload.passwordHash = passwordHash;
        payload.passwordSalt = passwordSalt;
    }

    await updateDoc(userRef, payload);
    return payload;
};

export { findUserByUsername, findUserById, createUser, updateUser };