"use client"
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import firebase_app from "@/firebase/config";

function Page(){
    const { user } = useAuthContext();
    const router = useRouter();
    const [score, setScore] = useState(null);

    useEffect(() => {
        if (user == null) {
            router.push("/");
        }
        fetch(`/api/user/score/${user.uid}`)
            .then(response => response.json())
            .then(data => {
                setScore(data);
            })
    }, [user, router]);

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

    return (
        <>
            {userData.picks ? (
                <div>
                    <h1>Welcome, {userData.username}! You have {score} point this week</h1>
                </div>
            ) : (
                <h1>Loading user data...</h1>
            )}
        </>
    );
}

export default Page;
