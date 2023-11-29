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
            score: playerScore
        };
    }));

// Sort the elements by playerScore in descending order
    elements.sort((a, b) => b.score - a.score);

    const sortedElements = elements.map(({ player, username, score }) => (
        <Link href={`/home/${player}`} key={player}>
            <div className={"flex justify-between w-[100svw] text-2xl"}>
                <div>{username}</div>
                <div>{score}</div>
            </div>
        </Link>
    ));

    return (
        <div>
            {sortedElements}
        </div>
    )

}