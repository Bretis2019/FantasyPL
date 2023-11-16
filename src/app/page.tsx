import Link from 'next/link';

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between overflow-x-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={"absolute h-[100svh] w-auto md:w-[100svw] md:h-[300svh] object-cover"} src={"Mahrez_Poster_Mobile.png"}  alt={"bgImage"}/>
        <div className={"sticky top-0 h-[8svh] w-[100svw] backdrop-blur-2xl flex justify-between items-center px-8"}>
            <Link href={"/signup"}><div className={"flex justify-center items-center px-8 py-2 bg-gray-800 rounded-md font-semibold"}>Sign up</div></Link>
            <Link href={"/signin"}><div className={"flex justify-center items-center px-8 py-2 bg-white rounded-md text-gray-800 font-semibold"}>Login</div></Link>
        </div>
    </main>
  )
}
