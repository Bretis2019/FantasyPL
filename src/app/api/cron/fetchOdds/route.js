import { NextResponse } from 'next/server';
import * as fs from "fs";
import {findGameId} from "../../../../functions/GamesDB";
import {fetchUserData} from "../../../../functions/fetchUserData";
import {calculateScore} from "../../user/score/[uid]/route";
import {collection, getDocs, getFirestore, updateDoc} from "firebase/firestore"

function getWednesdays() {
    const today = new Date();
    const currentDay = today.getDay();

    // Calculate the difference between today and Wednesday (3rd day of the week)
    const daysUntilNextWednesday = currentDay <= 3 ? 3 - currentDay : 10 - currentDay;

    // Calculate this week's Wednesday
    const thisWednesday = new Date(today);
    thisWednesday.setDate(today.getDate() + daysUntilNextWednesday);
    thisWednesday.setUTCHours(0, 0, 0, 0);

    // Calculate next week's Wednesday
    const nextWednesday = new Date(thisWednesday);
    nextWednesday.setDate(thisWednesday.getDate() + 7);

    const formatISO8601 = (date) => date.toISOString().slice(0, 19) + "Z";

    return {
        thisWednesday: formatISO8601(thisWednesday),
        nextWednesday: formatISO8601(nextWednesday)
    };
}

async function updateOdds(){
    const wednesdays  = getWednesdays();
    const url = `https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=${process.env.NEXT_ODDS_API_KEY}&regions=eu&markets=spreads,totals&oddsFormat=decimal&bookmakers=onexbet&commenceTimeFrom=${wednesdays.thisWednesday}&commenceTimeTo=${wednesdays.nextWednesday}`

    const response = await fetch(url);

    const data = await response.json();

    const payload = data.map(item => ({
        ...item, // Spread the existing properties of the object
        liveCode: findGameId(item.home_team, item.away_team),
    }));


    await fs.writeFile("data.json", JSON.stringify(payload, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('File written successfully');
        }
    });
}

async function updateUserPoints(){
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, "users"));

    const promises = querySnapshot.docs.map(async (doc) => {
        try {
            const user = await fetchUserData(doc.id);
            if (!user || typeof user !== 'object' || !user.userId) {
                console.error(`Invalid user data for doc.id: ${doc.id}`, user);
                return;
            }

            const response = await calculateScore(user.picks);
            const data = doc.data();
            const totalPoints = data.totalPoints;
            await updateDoc(doc.ref, {
                totalPoints: totalPoints + response,
                picks: {}
            });
        } catch (error) {
            console.error(`Error processing doc.id: ${doc.id}`, error);
        }
    });

    await Promise.all(promises);

}

export async function GET() {
    try{
        await updateUserPoints();
        await updateOdds();
        return NextResponse.json(
            { message: `updated data.json` },
            { status: 200 },
        )
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to update data.json' },
            { status: 500 },
        );
    }
}


