import redis from "@/app/lib/redis";
import { NextRequest, NextResponse } from "next/server";
type newsinfo = {
    id:string, 
    title:string, 
    url:string, 
    source:string, 
    time:Date
}
const LIMIT = 15;
export async function GET(req:NextRequest) {
    try{
        const {searchParams} = new URL(req.url);
        const topic = searchParams.get("topic") || "technology";
        const cacheKey = `news:${topic}`;
        const cached =await redis.get(cacheKey);
        if(cached){
            // console.log("Cache memory is hitting huuuuraaah!!")
              return NextResponse.json({ source: "cache", data: JSON.parse(cached) });
        }
        const news = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
        if(!news.ok){
            return NextResponse.json({message:"Not a able to feth the news"},{status:400});
        }
        const ids = await news.json();
                // for (let i:number=0;i<ids.length;i++){
        //     const id_Data = await fetch(`https://hacker-news.firebaseio.com/v0/item/${ids[i]}.json?print=pretty`);
        //     dict[i]= await id_Data.json();
        //     if(!id_Data){
        //         throw new Error(`unable to fetch id ${i}`);
        //     }
        // }
        const items:newsinfo[] = await Promise.all(ids.slice(0, LIMIT).map(async (id: number) => {
            const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            const data = await res.json();
            return {
                id: data.id.toString(),
                title: data.title,
                url: data.url || '',
                source: 'Hacker News',
                time: new Date(data.time * 1000)
            };
        }));

        await redis.set(cacheKey,JSON.stringify(items),{EX:20})
        return NextResponse.json({ source: "fresh", data: items });
    }catch(err){
        console.error(err);
        return NextResponse.json({message:"Something went wrong on our side"},{status:500});
    }
}