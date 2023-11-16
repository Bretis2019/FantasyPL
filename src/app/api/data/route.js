import fs from "fs";
import {NextResponse} from "next/server";

export async function GET(){
    const readFileData = await fs.promises.readFile('data.json', 'utf-8');
    const data = JSON.parse(readFileData);
    return NextResponse.json(data);
}