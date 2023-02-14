import mongoose from "mongoose";
import app from "./app"
import config from "./config";

// create a fn
// run a fn
(async()=>{
    try {
        await mongoose.connect(config.MONGODB_URL)
        console.log("DB Connected");
        app.on('error',(err)=>{
            console.log("ERROR ",err);
            throw err
        })
        const onListening = ()=>{
            console.log(`Listening on ${config.PORT}`);
        }
        app.listen(config.PORT,onListening())
    } catch (err) {
        console.log("ERROR ",err);
        throw err
        
    }
})