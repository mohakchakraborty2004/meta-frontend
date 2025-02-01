"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {

  const [space, setSpace] = useState<string>("");
  const [token, setToken] = useState<string>("");

  //this is hardcoded, implement the logic to generate the spaceid given a button to create space. And then pass it onto the space area 

  return <div >
    <input className="text-black" type="text" onChange={(e: any) => {
      setSpace(e.target.value);
    }}/>
     <input className="text-black" type="text" onChange={(e: any) => {
      setToken(e.target.value);
    }}/>
    <Link href={`/space?spaceId=${space}&token=${token}`}>
     <button>Join</button>
    </Link>
  </div>

}