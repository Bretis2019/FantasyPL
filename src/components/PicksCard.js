"use client"

import {useEffect, useState} from "react";

function ShieldSVG(){
    return (
        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <g id="Shape / Shield"> <path id="Vector" d="M12.9258 20.6314C15.0319 19.6781 20 16.7333 20 10.165V6.19691C20 5.07899 20 4.5192 19.7822 4.0918C19.5905 3.71547 19.2837 3.40973 18.9074 3.21799C18.4796 3 17.9203 3 16.8002 3H7.2002C6.08009 3 5.51962 3 5.0918 3.21799C4.71547 3.40973 4.40973 3.71547 4.21799 4.0918C4 4.51962 4 5.08009 4 6.2002V10.165C4 16.7333 8.9678 19.6781 11.074 20.6314C11.2972 20.7325 11.4094 20.7829 11.6621 20.8263C11.8215 20.8537 12.1795 20.8537 12.3389 20.8263C12.5907 20.7831 12.7017 20.7328 12.9235 20.6324L12.9258 20.6314Z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </g> </g></svg>
    )
}

export default function PicksCard( props ){



    const {item, updatePayload, updateTotal, total, updateDouble, double, updateShield, shield} = props;
    const [pick, setPick] = useState(null);

    useEffect(() => {
        updatePayload(prevPayload => {
            const gameId = item.id;
            const index = prevPayload.findIndex(obj => obj && obj[gameId] !== undefined);

            if (index !== -1) {
                // If the object with the matching ID is found, update it
                const updatedPayload = [...prevPayload];
                updatedPayload[index] = { ...updatedPayload[index], [gameId]: pick };
                return updatedPayload;
            } else {
                // If the object with the matching ID is not found, add a new object
                return [...prevPayload, { [gameId]: pick }];
            }
        });

    }, [item.id, pick, updatePayload]);


    const handicap = item.bookmakers[0].markets[0].outcomes[0].point > 0 ? item.bookmakers[0].markets[0].outcomes[0] : item.bookmakers[0].markets[0].outcomes[1]
    const homePrice = item.bookmakers[0].markets[0].outcomes[0].name === item.home_team ? item.bookmakers[0].markets[0].outcomes[0].price : item.bookmakers[0].markets[0].outcomes[1].price
    const awayPrice = item.bookmakers[0].markets[0].outcomes[0].name !== item.home_team ? item.bookmakers[0].markets[0].outcomes[0].price : item.bookmakers[0].markets[0].outcomes[1].price
    return (
        <div key={item.id}  className={"bg-gray-400 Card text-black rounded-xl border-2 border-black px-4 py-2 max-w-[90svw] md:max-w-[450px] flex flex-col gap-y-3"}>
            <div className={"flex w-full justify-between items-center"}>
                <div className={"flex flex-col justify-center gap-y-2"}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className={"h-[60px] w-auto object-contain"} src={`Badges/${item.home_team}.png`} alt={"Club badge"} />
                    <div className={"w-[150px] text-center"}>{item.home_team}</div>
                </div>
                <div onClick={getMatchDeatails} className={`flex text-transparent bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-6xl font-semibold justify-between ${handicap.name === item.home_team ? '' : ' flex-row-reverse'}`}>
                    <div>{handicap.point}</div>
                    <div>-</div>
                    <div>0</div>
                </div>
                <div className={"flex flex-col justify-center gap-y-2"}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className={"h-[60px] w-auto object-contain"} src={`Badges/${item.away_team}.png`} alt={"Club badge"} />
                    <div className={"w-[150px] text-center"}>{item.away_team}</div>
                </div>
            </div>
            <div className={"flex justify-between w-full"}>
                <div className={"flex gap-x-2 items-center"}>
                    <div onClick={() => setPick(0)} className={`cursor-pointer rounded-full p-4 ${pick === 0 ? "bg-green-600" : "bg-white"} border-2 border-black`}></div>
                    <div>{(homePrice * 100).toFixed(0)}</div>
                </div>
                <div className={"rounded-full bg-white text-black px-2 border-2 border-black flex justify-between items-center gap-x-4"}>
                    <div onClick={() => updateTotal({id: item.id, choice: "Under"})} className={`${(total.id === item.id && total.choice === "Under" )&& "bg-red-500"} rounded-l-full cursor-pointer pr-2 border-r-2 border-black flex items-center gap-x-1`}>
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 18L7 13M12 18L17 13" stroke="#000000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </g></svg>
                        <div>{(item.bookmakers[0].markets[1].outcomes[1].price * 100).toFixed(0)}</div>
                    </div>
                    <div className={"font-semibold text-transparent bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text"}>{item.bookmakers[0].markets[1].outcomes[0].point}</div>
                    <div onClick={() => updateTotal({id: item.id, choice: "Over"})} className={`${(total.id === item.id && total.choice === "Over" )&& "bg-green-500"} rounded-r-full cursor-pointer pl-2 border-l-2 border-black flex items-center gap-x-1`}>
                        <div>{(item.bookmakers[0].markets[1].outcomes[0].price * 100).toFixed(0)}</div>
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 18L7 13M12 18L17 13" stroke="#000000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </g></svg>
                    </div>
                </div>
                <div className={"flex gap-x-2 items-center"}>
                    <div>{(awayPrice * 100).toFixed(0)}</div>
                    <div onClick={() => setPick(1)} className={`cursor-pointer rounded-full p-4 ${pick === 1 ? "bg-green-600" : "bg-white"} border-2 border-black`}></div>
                </div>
            </div>
            <div className={"flex justify-center items-center gap-x-4 w-full"}>
                <div onClick={() => updateDouble({id: item.id})} className={`${double.id === item.id ? "opacity-100" : "opacity-30"} cursor-pointer rounded-full p-1 bg-blue-600 border-2 border-black flex justify-center items-center`}><div className={"font-semibold text-blue-950 w-[25px] h-[25px] flex justify-center items-center"}>2x</div></div>
                <div onClick={() => updateShield({id: item.id})} className={`${shield.id === item.id ? "opacity-100" : "opacity-30"} cursor-pointer rounded-full p-1 bg-black border-2 border-white flex justify-center items-center`}><ShieldSVG /></div>
            </div>
        </div>
    )
}