import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

// Get the authentication instance using the Firebase app
const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app); // Get Firestore instance

// Function to sign up a user with email and password
export default async function signUp(email: string, password: string) {
  let result = null, // Variable to store the sign-up result
      error = null; // Variable to store any error that occurs

  try {
    // Create a new user with email and password
    result = await createUserWithEmailAndPassword(auth, email, password);

    // Add user data to Firestore
    const userDocRef = doc(db, "users", result.user.uid); // Assume "users" is the collection name
    await setDoc(userDocRef, { userId: result.user.uid, email: email, totalPoints: 0,league: "" , username: "", friends: [], picks: {} });
  } catch (e) {
    error = e; // Catch and store any error that occurs during sign-up
  }

  return { result, error }; // Return the sign-up result and error (if any)
}
