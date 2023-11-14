import PicksForm from "../../components/PicksForm";
import * as fs from "fs";


export default async function Page(){
    const readFileData = await fs.promises.readFile('data.json', 'utf-8');
    const data = JSON.parse(readFileData);

    return (
        <PicksForm data={data} />
    )
}