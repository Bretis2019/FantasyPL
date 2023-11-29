import {fetchUserData} from "../../../../../functions/fetchUserData";
import {getGameScore} from "../../../../../functions/getMatchScore";

function findGameById(gameId, data) {
    for(const game of data){
        if(game.id === gameId){
            return game;
        }
    }
    return null;
}

function calculateStartingScore(game) {
    const spreadsMarket = game.bookmakers[0].markets.find(market => market.key === 'spreads');

    if (!spreadsMarket) {
        return null; // No spreads market found
    }

    const homeTeamSpread = spreadsMarket.outcomes.find(outcome => outcome.name === game.home_team);
    const awayTeamSpread = spreadsMarket.outcomes.find(outcome => outcome.name === game.away_team);

    if (!homeTeamSpread || !awayTeamSpread) {
        return null; // Spread information for both teams not found
    }

    const homeTeamScore = homeTeamSpread.point >= 0 ? homeTeamSpread.point : 0;
    const awayTeamScore = awayTeamSpread.point >= 0 ? awayTeamSpread.point : 0;

    return [homeTeamScore, awayTeamScore];
}

export async function calculateScore(picks){
    const response = await fetch("https://fantasy-pl.vercel.app/api/data");
    const data = await response.json();
    const games = picks.games;
    const double = picks.double.id;
    const shield = picks.shield.id;
    const total = picks.total;
    let userScore = 0;
    for (const game of games) {
        const [id, pick] = Object.entries(game)[0];
        const gameData = await findGameById(id, data);
        let homePoints = gameData.bookmakers[0].markets[0].outcomes[0].name === gameData.home_team ? gameData.bookmakers[0].markets[0].outcomes[0].price * 100 : gameData.bookmakers[0].markets[0].outcomes[1].price * 100;
        let awayPoints = gameData.bookmakers[0].markets[0].outcomes[0].name === gameData.away_team ? gameData.bookmakers[0].markets[0].outcomes[0].price * 100 : gameData.bookmakers[0].markets[0].outcomes[1].price * 100;
        let cost = 100;
        const liveScore = await getGameScore(gameData.liveCode);
        const spread = calculateStartingScore(gameData);
        const pointScore = [liveScore[0] + spread[0], liveScore[1] + spread[1]];



        if(double === id){
            homePoints = homePoints * 2;
            awayPoints = homePoints * 2;
            cost = cost * 2;
        }

        if(shield === id){
            cost = 0;
        }

        if(total.id === id){

            const overUnder = gameData.bookmakers[0].markets[1].outcomes[0].point
            const matchScore = liveScore[0] + liveScore[1]
            const overPrice = gameData.bookmakers[0].markets[1].outcomes[0].price * 100;
            const underPrice = gameData.bookmakers[0].markets[1].outcomes[1].price * 100;

            if(total.choice === "Over"){
                if(overUnder > matchScore){
                    userScore -= 100;
                }else{
                    userScore += overPrice;
                }
            }else{
                if(overUnder < matchScore){
                    userScore -= 100;
                }else{
                    userScore += underPrice;
                }
            }
        }

        if(pointScore[0] > pointScore[1] && pick === 0){
            userScore += homePoints
        }else if(pointScore[0] > pointScore[1] && pick === 1){
            userScore -= cost;
        }else if(pointScore[0] < pointScore[1] && pick === 1){
            userScore += awayPoints;
        }else if(pointScore[0] < pointScore[1] && pick === 0){
            userScore -= cost;
        }
    }
    return parseInt(userScore.toFixed(2))
}

export async function GET(request, { params }) {
    const { uid } = params;
    const user = await fetchUserData(uid);
    const response = await calculateScore(user.picks);
    return new Response(response);
}