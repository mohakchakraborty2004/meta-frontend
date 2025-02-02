"use client";

import MetaverseSpace from "@/components/Meta";
import { useRouter, useSearchParams } from "next/navigation";

export default function Space() {

const router = useRouter()
const param = useSearchParams()

const spaceId = param.get('spaceId') as string
const token = param.get('token') as string
const id = param.get('id') as string

    return <div>
        <h1> spaceId : {spaceId}</h1>
        <h1>Token : {token}</h1>
        <MetaverseSpace spaceId={spaceId} token={token} id={id}></MetaverseSpace>
    </div>
}

//cm63ut5wy0001udcgpail5fof

