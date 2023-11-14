"use client"
import PicksCard from "./PicksCard";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthContext} from "../context/AuthContext";
import {doc, getFirestore, updateDoc} from "firebase/firestore";
import firebase_app from "../firebase/config";

export default function PicksForm({ data }){

    const { user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (user == null) {
            router.push("/");
        }
    }, [user, router]);




    const [payload, setPayload] = useState({});
    const [total, setTotal] = useState({
        id: "",
        choice: ""
    });
    const [double, setDouble] = useState({
        id: "",
    });
    const [shield, setShield] = useState({
        id: "",
    });

    const setPicks = async () => {
        if (user != null) {
            const firestore = getFirestore(firebase_app);
            const userDocRef = doc(firestore, "users", user.uid);
            try {
                const picks = [payload, total, double]
                    await updateDoc(userDocRef, {picks: picks});
            } catch (error) {
                console.error("Error fetching user document:", error);
            }
            router.push("/home");
        }
    };


    const elements = data.slice(0, 10).map((item, index) => {
        return (
            <PicksCard item={item} key={index} updatePayload={setPayload} updateTotal={setTotal} total={total} updateDouble={setDouble} double={double} updateShield={setShield} shield={shield}/>
        )
    })

    return (
        <div className={"w-full bg-gradient-to-b from-green-300 via-blue-500 to-purple-600 p-4 flex flex-col gap-y-3 items-center"}>
            {elements}
            <div onClick={setPicks} className={"bg-blue-600 rounded-xl px-4 py-2 font-semibold text-2xl cursor-pointer"}>Submit</div>
        </div>
    )
}