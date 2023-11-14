"use client"
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import firebase_app from "@/firebase/config";
import PicksDisplay from "@/components/PicksDisplay";

function Page(){
    const { user } = useAuthContext();
    const router = useRouter();
    const [userData, setUserData] = useState({
    });
    useEffect(() => {
        const fetchUserData = async () => {
            if (user != null) {
                const firestore = getFirestore(firebase_app);
                const userDocRef = doc(firestore, "users", user.uid);

                try {
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        setUserData(userData);
                    } else {
                        console.error("User document not found");
                    }
                } catch (error) {
                    console.error("Error fetching user document:", error);
                }
            }
        };

        fetchUserData();
    }, [user]);

    useEffect(() => {
        if (user == null) {
            router.push("/");
        }
    }, [user, router]);

    return (
        <>
            {userData.username ? (
                <div>
                    <h1>Welcome, {userData.username}!</h1>
                    <PicksDisplay picks={userData.picks}/>
                </div>
            ) : (
                <h1>Loading user data...</h1>
            )}
        </>
    );
}

export default Page;
