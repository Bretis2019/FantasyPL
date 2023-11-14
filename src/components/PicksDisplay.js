"use client"
export default function PicksDisplay({ picks }){

    if(picks.length === 0){
        return <div>No picks set yet</div>
    }

    const elements = picks.map(item => {
        return (
            <div key={item.hteam}>
                <div>{item.hteam}</div>
                <div>{item.ateam}</div>
            </div>
        )
    })

    return (
        <div>
            {elements}
        </div>
    )

}