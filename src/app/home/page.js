"use client"
import {useAuthContext} from "@/context/AuthContext";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import PicksDisplay from "../../components/PicksDisplay";
import Link from "next/link";

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

    const [userData, setUserData] = useState({});
    const [leaguePos, setLeaguePos] = useState(2);
    const firestore = getFirestore(firebase_app);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function getLeaguePosition(leagueCode, id){

        async function fetchScore(id) {
            const response = await fetch(`/api/user/score/${id}`);
            return await response.json();
        }

        async function getUserRank(ids, userId) {
            const scorePromises = ids.map(async (id) => {
                const score = await fetchScore(id);
                return { id, score };
            });

            const scores = await Promise.all(scorePromises);

            scores.sort((a, b) => b.score - a.score);
            return scores.findIndex((user) => user.id === userId) + 1;

        }

        const leagueDocRef = doc(firestore, "leagues", leagueCode);


        try {
            const leagueDocSnap = await getDoc(leagueDocRef);

            if (leagueDocSnap.exists()) {
                const leagueData = leagueDocSnap.data();
                const players = leagueData.players;

                getUserRank(players, id)
                    .then((rank) => {
                        setLeaguePos(rank);
                    })
                    .catch((error) => {
                        console.error(error);
                        return 2;
                    });

            } else {
                console.error("User document not found");
            }
        } catch (error) {
            console.error("Error fetching user document:", error);
        }
        return 2;
    }

    useEffect(() => {
        const fetchUserData = async () => {
            if (user != null) {
                const userDocRef = doc(firestore, "users", user.uid);

                try {
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = await userDocSnap.data();
                        setUserData(userData);
                        return userData;
                    } else {
                        console.error("User document not found");
                    }
                } catch (error) {
                    console.error("Error fetching user document:", error);
                }
            }
        };

        fetchUserData().then(response => {
            if(response.league){
                getLeaguePosition(response.league, user.uid)
            }
        })


    }, [firestore, getLeaguePosition, user]);

    return (
        <>
            {userData.picks ? (
                <div className={"bg-gradient-to-b from-green-300 via-blue-500 to-purple-600 h-fit min-h-screen flex flex-col items-center p-8 gap-y-3"}>
                    <div className={"Card flex justify-center items-center p-2 font-semibold text-black text-3xl"}>{userData.username}</div>
                    <div className={"Card flex justify-center items-center p-8 gap-x-4 font-bold text-black text-4xl md:text-5xl"}>
                        <Link href={userData.league === "" ? "/league" : `/league/${userData.league}`}>
                            <div className={"Card p-4 flex flex-col gap-y-2 justify-center items-center"}>
                                <div>{userData.league === "" ? "-" : leaguePos}</div>
                                <div className={"text-base"}>League</div>
                            </div>
                        </Link>
                        <div className={"Card p-4 flex flex-col gap-y-2 justify-center items-center"}>
                            <div>{score}</div>
                            <div className={"text-base"}>Points</div>
                        </div>
                        <div className={"Card p-4 flex flex-col gap-y-2 justify-center items-center"}>
                            <div>{userData.totalPoints}</div>
                            <div className={"text-base text-center"}>Total</div>
                        </div>
                    </div>
                    {
                        userData.picks.double !== undefined ?
                            <div className={"flex flex-col gap-y-3"}>
                                <Link href={"/picks"}>
                                    <div className={"bg-green-500 rounded-md px-4 py-2 text-xl text-black flex justify-center items-center font-semibold"}>
                                        Edit picks
                                    </div>
                                </Link>
                                <PicksDisplay picks={userData.picks} />
                            </div>
                                :
                            <Link href={"/picks"}>
                                <div className={"bg-green-500 rounded-md px-4 py-2 text-xl text-black flex justify-center items-center font-semibold"}>
                                    Set picks
                                </div>
                            </Link>
                    }
                </div>
            ) : (
                <h1>Loading user data...</h1>
            )}
        </>
    );
}

export default Page;
