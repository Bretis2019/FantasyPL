"use client"
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getDoc, doc, getFirestore } from "firebase/firestore";
import firebase_app from "@/firebase/config";
import PicksDisplay from "../../components/PicksDisplay";

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

    function getLeaguePosition(){
        return 2;
    }

    return (
        <>
            {userData.picks ? (
                <div className={"bg-gradient-to-b from-green-300 via-blue-500 to-purple-600 h-fit min-h-screen flex flex-col items-center p-8 gap-y-3"}>
                    <div className={"Card flex justify-center items-center p-2 font-semibold text-black text-3xl"}>{userData.username}</div>
                    <div className={"Card flex justify-center items-center p-8 gap-x-4 font-bold text-black text-4xl md:text-5xl"}>
                        <div className={"Card p-4 flex flex-col gap-y-2 justify-center items-center"}>
                            <div>{userData.league === "" ? "-" : getLeaguePosition(userData.league, user.uid)}</div>
                            <div className={"text-base"}>League</div>
                        </div>
                        <div className={"Card p-4 flex flex-col gap-y-2 justify-center items-center"}>
                            <div>{score}</div>
                            <div className={"text-base"}>Points</div>
                        </div>
                        <div className={"Card p-4 flex flex-col gap-y-2 justify-center items-center"}>
                            <div>{userData.totalPoints}</div>
                            <div className={"text-base text-center"}>Total</div>
                        </div>
                    </div>
                    <PicksDisplay picks={userData.picks} />
                </div>
            ) : (
                <h1>Loading user data...</h1>
            )}
        </>
    );
}

export default Page;
