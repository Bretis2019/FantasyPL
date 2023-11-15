import {doc, getDoc, getFirestore} from "firebase/firestore";
import firebase_app from "../firebase/config";

export async function fetchUserData(uid){
    const firestore = getFirestore(firebase_app);
    const userDocRef = doc(firestore, "users", uid);

    try {
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            return userDocSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching user document:", error);
        return null;
    }
}