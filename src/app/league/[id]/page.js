import {doc, getDoc, getFirestore} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {fetchUserData} from "../../../functions/fetchUserData";
import {calculateScore} from "../../api/user/score/[uid]/route";
import Link from "next/link";


export default async function Page({params}){
    const {id} = params;
    const firestore = getFirestore(firebase_app);
    const leagueRef = doc(firestore, "leagues", id);
    const docSnap = await getDoc(leagueRef);
    const data = docSnap.data();
    const players = data.players;

    async function findPlayerById(id){
        const docRef = doc(firestore, "users", id);
        const docSnap = await getDoc(docRef);

        return docSnap.data();
    }

    async function getPlayerScore(id) {
        try {
            const user = await fetchUserData(id);
            return await calculateScore(user.picks)
        } catch (err) {
            console.log(err);
        }
    }



    const elements = await Promise.all(players.map(async (player) => {
        const playerData = await findPlayerById(player);
        const playerScore = await getPlayerScore(player);
        return {
            player,
            username: playerData.username,
            totalScore: playerData.totalPoints,
            score: typeof playerScore === 'number' ? playerScore : 0
        };
    }));

// Sort the elements by playerScore in descending order
    elements.sort((a, b) => b.totalScore - a.totalScore);

    const sortedElements = elements.map(({ player, username, score, totalScore }, index) => (
        <Link href={`/home/${player}`} key={player}>
            <div className={"flex justify-between items-center w-[100svw] text-2xl py-4 px-2 Card"}>
                <div className={"flex space-x-2"}>
                    <div>{index + 1}</div>
                    <div>{username}</div>
                </div>
                <div>{score}</div>
                <div>{totalScore}</div>
            </div>
        </Link>
    ));

    return (
        <div className={"flex flex-col space-y-8 bg-gradient-to-b from-pink-300 via-purple-300 to-indigo-400 w-[100svw] h-[100svh] text-black"}>
            <div className={"flex justify-between items-center w-[100svw] text-2xl px-2 md:px-8 py-4 border-b-2 border-black"}>
                <div>Name</div>
                <div>GW</div>
                <div>Total</div>
            </div>
            {sortedElements}
        </div>
    )

}