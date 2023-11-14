"use client"

export default function PicksForm({ data }){
    const games = data.map(item => {
        const handicap = item.bookmakers[0].markets[0].outcomes[0].point > 0 ? item.bookmakers[0].markets[0].outcomes[0] : item.bookmakers[0].markets[0].outcomes[1]
        return (
            <div key={item.id}  className={"bg-gray-400 rounded-xl border-4 border-black px-4 py-2 max-w-[450px] flex flex-col gap-y-3"}>
                <div className={"flex w-full justify-between gap-x-5"}>
                    <div>
                        <div>{item.home_team}</div>
                    </div>
                    <div className={`flex justify-between ${handicap.name === item.home_team ? '' : ' flex-row-reverse'}`}>
                        <div>{handicap.point}</div>
                        <div>-</div>
                        <div>0</div>
                    </div>
                    <div>
                        <div>{item.away_team}</div>
                    </div>
                </div>
                <div className={"flex justify-between w-full"}>
                    <div className={"flex gap-x-2 items-center"}>
                        <div className={"rounded-full p-4 bg-white border-2 border-black"}></div>
                        <div>{(item.bookmakers[0].markets[0].outcomes[0].price * 100).toFixed(0)}</div>
                    </div>
                    <div className={"rounded-full bg-white text-black px-4 py-2 border-2 border-black flex justify-between items-center gap-x-4"}>
                        <div>{(item.bookmakers[0].markets[1].outcomes[0].price * 100).toFixed(0)}</div>
                        <div>{item.bookmakers[0].markets[1].outcomes[0].point}</div>
                        <div>{(item.bookmakers[0].markets[1].outcomes[1].price * 100).toFixed(0)}</div>
                    </div>
                    <div className={"flex gap-x-2 items-center"}>
                        <div>{(item.bookmakers[0].markets[0].outcomes[1].price * 100).toFixed(0)}</div>
                        <div className={"rounded-full p-4 bg-white border-2 border-black"}></div>
                    </div>
                </div>
                <div className={"flex justify-center items-center gap-x-4 w-full"}>
                    <div className={"rounded-full p-4 bg-blue-600 border-2 border-black"}></div>
                    <div className={"rounded-full p-4 bg-black border-2 border-white"}></div>
                </div>
            </div>
        )
    })


    return (
        <div>{games}</div>
    )
}