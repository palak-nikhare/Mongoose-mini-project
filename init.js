const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main().then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/watsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

let chats = [{
    from :"palak",
    to : "silvia",
    msg :"you are looking gorgeous girl",
    created_at : new Date()
},
{
    from :"manjiri",
    to : "anaya",
    msg :"can you send me some imp ques",
    created_at : new Date()
},
{
    from :"prakriti",
    to : "nture",
    msg :"send me some notes please",
    created_at : new Date()
},
{
    from :"tanaya",
    to : "pratista",
    msg :"let go for outing after exam",
    created_at : new Date()
},
{
    from :"gayatri",
    to : "gouri",
    msg :"heyy, can u explain me this topic",
    created_at : new Date()
},
{
    from :"nandini",
    to : "jaineeta",
    msg :"can you send me ques",
    created_at : new Date()
}]

Chat.insertMany(chats);

