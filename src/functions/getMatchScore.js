export async function GetMatchScore(id){
    const url = `https://www.fotmob.com/api/matchDetails?matchId=${id}`;
    const response = await fetch(url);
    const data = await response.json();
    const score = [data.header.teams[0].score, data.header.teams[1].score];
}