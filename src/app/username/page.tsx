"use client"
import { useRouter } from 'next/navigation';
import { useState } from "react";
import {useAuthContext} from "@/context/AuthContext";
import {doc, getFirestore, updateDoc} from "firebase/firestore";
import firebase_app from "@/firebase/config";

function Page(): JSX.Element {
    const [ username, setUsername ] = useState( '' );
    const { user } = useAuthContext() as { user: any };
    const router = useRouter();

    // Handle form submission
    const handleForm = async ( event: { preventDefault: () => void } ) => {
        event.preventDefault();

        const setUsername = async () => {
            if (user != null) {
                const firestore = getFirestore(firebase_app);
                const userDocRef = doc(firestore, "users", user.uid);
                try {
                    await updateDoc(userDocRef, {username: username});
                } catch (error) {
                    console.error("Error fetching user document:", error);
                }
            }
        };

        setUsername();

        // Redirect to the home page
        router.push( "/home" );
    }

    return (
        <div className="flex justify-center items-center h-screen text-black">
            <div className="w-96 bg-white rounded shadow p-6">
                <h1 className="text-3xl font-bold mb-6">Registration</h1>
                <form onSubmit={handleForm} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block mb-1 font-medium">
                            Username
                        </label>
                        <input
                            onChange={( e ) => setUsername( e.target.value )}
                            required
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Public name"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Page;
