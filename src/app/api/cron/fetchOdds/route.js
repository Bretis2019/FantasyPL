import { NextResponse } from 'next/server';
import * as fs from "fs";
import {findGameId} from "../../../../functions/GamesDB";

export async function GET() {
    try {
        const url = `https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=${process.env.NEXT_ODDS_API_KEY}&regions=eu&markets=spreads,totals&oddsFormat=decimal&bookmakers=onexbet`

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


        return NextResponse.json(
            { message: `updated data.json` },
            { status: 200 },
        );
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to update data.json' },
            { status: 500 },
        );
    }
}

//const date = getLastWednesdayAndNextWeek();


/*function getLastWednesdayAndNextWeek() {
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const daysUntilLastWednesday = (currentDayOfWeek + 7 - 3) % 7; // Calculate days until last Wednesday

    const lastWednesday = new Date(today);
    lastWednesday.setDate(today.getDate() - daysUntilLastWednesday);

    const nextWeek = new Date(lastWednesday);
    nextWeek.setDate(lastWednesday.getDate() + 7);

    // Format dates to YYYY-MM-DDTHH:MM:SSZ format
    const isoLastWednesday = lastWednesday.toISOString().slice(0, 19) + 'Z';
    const isoNextWeek = nextWeek.toISOString().slice(0, 19) + 'Z';

    return {
        beginDate: isoLastWednesday,
        endDate: isoNextWeek,
    };
}*/