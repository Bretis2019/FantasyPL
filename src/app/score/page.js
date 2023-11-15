"use client"
import {useAuthContext} from "../../context/AuthContext";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function Page(){
    const { user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (user == null) {
            router.push("/");
        }
    }, [user, router]);


    const [score, setScore] = useState(null);

    useEffect(() => {
        fetch(`/api/user/score/${user.uid}`)
            .then(response => response.json())
            .then(data => {
                setScore(data);
            })
    }, [user]);
    return (
        <div>{score}</div>
    )
}