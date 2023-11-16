"use client"
import {ShieldSVG} from "./PicksCard";

export default function DisplayCard( props){
    const {item, total, double, shield, pick} = props;

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
                <div className={`flex text-transparent bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-6xl font-semibold justify-between ${handicap.name === item.home_team ? '' : ' flex-row-reverse'}`}>
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
                    <div className={`cursor-pointer rounded-full p-4 ${pick === 0 ? "bg-green-600" : "bg-white"} border-2 border-black`}></div>
                    <div>{(homePrice * 100).toFixed(0)}</div>
                </div>
                <div className={"rounded-full bg-white text-black px-2 border-2 border-black flex justify-between items-center gap-x-4"}>
                    <div className={`${(total.id === item.id && total.choice === "Under" )&& "bg-red-500"} rounded-l-full cursor-pointer pr-2 border-r-2 border-black flex items-center gap-x-1`}>
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 18L7 13M12 18L17 13" stroke="#000000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </g></svg>
                        <div>{(item.bookmakers[0].markets[1].outcomes[1].price * 100).toFixed(0)}</div>
                    </div>
                    <div className={"font-semibold text-transparent bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text"}>{item.bookmakers[0].markets[1].outcomes[0].point}</div>
                    <div className={`${(total.id === item.id && total.choice === "Over" )&& "bg-green-500"} rounded-r-full cursor-pointer pl-2 border-l-2 border-black flex items-center gap-x-1`}>
                        <div>{(item.bookmakers[0].markets[1].outcomes[0].price * 100).toFixed(0)}</div>
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 18L7 13M12 18L17 13" stroke="#000000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> </g></svg>
                    </div>
                </div>
                <div className={"flex gap-x-2 items-center"}>
                    <div>{(awayPrice * 100).toFixed(0)}</div>
                    <div className={`cursor-pointer rounded-full p-4 ${pick === 1 ? "bg-green-600" : "bg-white"} border-2 border-black`}></div>
                </div>
            </div>
            <div className={"flex justify-center items-center gap-x-4 w-full"}>
                <div className={`${double.id === item.id ? "opacity-100" : "opacity-30"} cursor-pointer rounded-full p-1 bg-blue-600 border-2 border-black flex justify-center items-center`}><div className={"font-semibold text-blue-950 w-[25px] h-[25px] flex justify-center items-center"}>2x</div></div>
                <div className={`${shield.id === item.id ? "opacity-100" : "opacity-30"} cursor-pointer rounded-full p-1 bg-black border-2 border-white flex justify-center items-center`}><ShieldSVG /></div>
            </div>
        </div>
    )

}