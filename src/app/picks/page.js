import PicksForm from "../../components/PicksForm";

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

export default async function Page(){
    //const date = getLastWednesdayAndNextWeek();
    const url = `https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=${process.env.NEXT_ODDS_API_KEY}&regions=eu&markets=spreads,totals&oddsFormat=decimal&bookmakers=onexbet`

    const response = await fetch(url);

    const data = await response.json();

    return (
        <PicksForm data={data} />
    )
}