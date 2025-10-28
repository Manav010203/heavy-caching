import { createClient } from "redis";

const redis = createClient({
    url: process.env.REDIS_DATABASE_URL,
})
redis.on("error",(error)=>console.error("Redis client Error",error));

(async ()=>{
    if(!redis.isOpen) await redis.connect();
})();

export default redis;