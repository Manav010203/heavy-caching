import { createClient } from "redis";

const redis = createClient({
    socket: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT || 6379)
    },
})
redis.on("error",(error)=>console.error("Redis client Error",error));

(async ()=>{
    if(!redis.isOpen) await redis.connect();
})();

export default redis;