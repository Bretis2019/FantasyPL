"use client"
import { useRouter } from 'next/navigation';
import { useState } from "react";
import {useAuthContext} from "@/context/AuthContext";
import {doc, getDoc, getFirestore, updateDoc} from "firebase/firestore";
import firebase_app from "@/firebase/config";

function Page(){
    const [ code, setCode ] = useState( '' );
    const { user } = useAuthContext();
    const router = useRouter();

    // Handle form submission
    const handleForm = async (event) => {
        event.preventDefault();

        const sendCode = async () => {
            if (user != null) {
                const firestore = getFirestore(firebase_app);
                const userDocRef = doc(firestore, "users", user.uid);
                try {
                    const leagueRef = doc(firestore, "leagues", code);
                    const docSnap = await getDoc(leagueRef);
                    const data = docSnap.data();
                    if (!data.players.includes(user.uid)) {
                        data.players.push(user.uid);
                    }
                    await updateDoc(leagueRef, {players: data.players});
                    await updateDoc(userDocRef, {league: code});
                } catch (error) {
                    console.error("Error fetching user document:", error);
                }
            }
        };

        sendCode()
            .then(() => {
                router.push( `/league/${code}` )
            }).catch(error => {
                console.error(error)
        })

    }

    return (
        <div className="flex justify-center items-center h-screen text-black">
            <div className="w-96 bg-white rounded shadow p-6">
                <h1 className="text-3xl font-bold mb-6">Registration</h1>
                <form onSubmit={handleForm} className="space-y-4">
                    <div>
                        <label htmlFor="code" className="block mb-1 font-medium">
                            League Code
                        </label>
                        <input
                            onChange={( e ) => setCode( e.target.value )}
                            required
                            type="text"
                            name="code"
                            id="code"
                            placeholder="League code"
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
