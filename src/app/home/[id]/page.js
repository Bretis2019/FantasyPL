import PicksDisplay from "../../../components/PicksDisplay";
import {fetchUserData} from "../../../functions/fetchUserData";
import {calculateScore} from "../../api/user/score/[uid]/route";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import firebase_app from "../../../firebase/config";

export default async function Page({params}){
    const {id} = params;

    async function getPlayerScore(id) {
        try {
            const user = await fetchUserData(id);
            return await calculateScore(user.picks)
        } catch (err) {
            console.log(err);
        }
    }

    const userData = await fetchUserData(id);
    const score = await getPlayerScore(id);


    async function getLeaguePosition(leagueCode, id) {
        async function getUserRank(ids, userId) {
            const scorePromises = ids.map(async (id) => {
                const score = await getPlayerScore(id);
                return { id, score };
            });

            const scores = await Promise.all(scorePromises);

            scores.sort((a, b) => b.score - a.score);
            return scores.findIndex((user) => user.id === userId) + 1;
        }

        const firestore = getFirestore(firebase_app);
        const leagueDocRef = doc(firestore, "leagues", leagueCode);

        try {
            const leagueDocSnap = await getDoc(leagueDocRef);

            if (leagueDocSnap.exists()) {
                const leagueData = leagueDocSnap.data();
                const players = leagueData.players;

                return await getUserRank(players, id);
            } else {
                console.error("User document not found");
                return 2;
            }
        } catch (error) {
            console.error("Error fetching user document:", error);
            return 2;
        }
    }


    const leaguePos = await getLeaguePosition(userData.league, id);

    return (
        <>
            {userData.picks ? (
                <div className={"bg-gradient-to-b from-green-300 via-blue-500 to-purple-600 h-fit min-h-screen flex flex-col items-center p-8 gap-y-3"}>
                    <div className={"Card flex justify-center items-center p-2 font-semibold text-black text-3xl"}>{userData.username}</div>
                    <div className={"Card flex justify-center items-center p-8 gap-x-4 font-bold text-black text-4xl md:text-5xl"}>
                        <div className={"Card p-4 flex flex-col gap-y-2 justify-center items-center"}>
                            <div>{userData.league === "" ? "-" : leaguePos}</div>
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

