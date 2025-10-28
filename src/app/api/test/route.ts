// import { NextRequest, NextResponse } from "next/server";
// type newsinfo = {
//     id:string, 
//     title:string, 
//     url:string, 
//     source:string, 
//     time:Date
// }
// export async function GET(req:NextRequest) {
//     try{
//         const data = await fetch("https://hn.algolia.com/api/v1/search?query=technology");
//         const item:newsinfo = await data.json()
//         return NextResponse.json(item);
//     }catch(err){
//         console.error(err);
//     }
// }

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic") || "technology";

  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
    topic
  )}&tags=story&restrictSearchableAttributes=title`;

  const response = await fetch(url);
  const data = await response.json();

  // Extract only useful info
  const stories = data.hits.map((story: any) => ({
    id: story.objectID,
    title: story.title,
    url: story.url,
    author: story.author,
    time: story.created_at,
  }));

  return NextResponse.json(stories);
}
