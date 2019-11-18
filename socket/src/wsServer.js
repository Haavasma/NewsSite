//@flow
let express: function = require("express");
let axios: function = require("axios");
let socketio: function = require("socket.io");

let app = express();

let server: function = app.listen(4001, ()=> console.log("Listening on port 4001"));

let io: function = socketio(server);

let interval: IntervalID;
io.on("connection", socket => {
    console.log("Ny klient tilkoblet");
    if(interval){
        clearInterval(interval);
    }

    interval = setInterval(()=>{
        getLiveFeedAndEmit(socket);
    }, 1000);
    socket.on("disconnect", ()=>{
        console.log("Klient koblet fra");
    });
});

let getLiveFeedAndEmit = async socket =>{
    try{
        let res = await axios.get('http://localhost:4000/api/uviktigeNyheter');
        socket.emit("livefeed", res.data);
    } catch(error){
        console.error("Error", error);
    }
}