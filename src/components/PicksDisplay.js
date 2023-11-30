"use client"
import DisplayCard from "./DisplayCard";
import React, { useState, useEffect } from "react";

function findGameById(gameId, data) {
    for(const game of data){
        if(game.id === gameId){
            return game;
        }
    }
    return null;
}

export default function PicksDisplay(props) {
    const {picks} = props;
    const games = picks.games;
    const double = picks.double;
    const shield = picks.shield;
    const total = picks.total;
    const [data, setData] = useState([]);

    async function fetchData() {
        try {
            const response = await fetch("/api/data");
            if (!response.ok) {
                console.log(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if(games && data.length > 0) {
        const elements =  games.map((game) => {
            const [id, pick] = Object.entries(game)[0];
            const gameData = findGameById(id, data);
            return (
                <DisplayCard item={gameData} key={gameData.id} total={total} shield={shield} double={double} pick={pick}/>
            )
        })
        return(
            <div className={"flex flex-col gap-y-3"}>
                {elements}
            </div>
        )
    }
}