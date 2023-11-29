export async function getGameScore(id){
    const url = `https://www.fotmob.com/api/matchDetails?matchId=${id}`;
    const response = await fetch(url, {cache: 'no-store'});
    const data = await response.json();
    return [data.header.teams[0].score, data.header.teams[1].score];
}