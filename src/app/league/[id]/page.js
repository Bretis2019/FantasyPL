import {doc, getDoc, getFirestore} from "firebase/firestore";
import firebase_app from "@/firebase/config";


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
            const response = await fetch(`${process.env.NEXT_ODDS_DOMAIN}/api/user/score/${id}`);
            return await response.json();
        } catch (err) {
            console.log(err);
        }
    }



    const elements = players.map( async (player) => {
        const playerData = await findPlayerById(player);
        const playerScore = await getPlayerScore(player);
        return (
            <div className={"flex justify-between w-[100svw] text-2xl"} key={player}>
                <div>{playerData.username}</div>
                <div>{playerScore}</div>
            </div>
        )
    })

    return (
        <div>
            {elements}
        </div>
    )

}