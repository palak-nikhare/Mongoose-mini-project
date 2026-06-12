const express = require("express");
const app = express();
const mongoose = require("mongoose")
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))

main().then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/watsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


app.get("/chats", async(req, res)=>{
    let chats = await Chat.find();
    console.log(chats);
    res.render("index.ejs", {chats});
})

//index page
app.get("/chats", async(req, res)=>{
    let chats = await Chat.find();
    console.log(chats);
    res.render("index.ejs", {chats});
})

//new chat page
app.get("/chats/new" , (req, res)=> {
    res.render("new.ejs");
})

//create route
app.post("/chats", (req, res)=>{
    let {from, msg, to} = req.body;
    let newChat = new Chat({
        from : from,
        msg :msg,
        to: to,
        created_at : new Date(),
    })
    console.log(newChat);
    newChat.save()
    .then((res)=> {console.log("chat saved");

    }).catch((err)=>{
        console.log(err);
    })

    res.redirect("/chats");
})

//Edit route
app.get("/chats/:id/edit", async (req, res)=> {
    let {id} = req.params;
    let chat = await Chat.findById(id)
    res.render("edit.ejs", {chat})
})

//Update route
app.put("/chats/:id", async (req, res)=> {
    let {id} = req.params;
    let newmsg = req.body.msg;
    
    let upchat = await Chat.findByIdAndUpdate(id, {msg: newmsg},{runValidators: true, new: true});

    console.log(upchat);
    res.redirect("/chats")
})

//destroy route
app.delete("/chats/:id", async (req,res)=> {
    let {id} = req.params;
    let dechat= await Chat.findByIdAndDelete(id);
    console.log(dechat);
    res.redirect("/chats")
})

app.get("/", (req ,res)=> {
    res.send("root working");
})

app.listen(8080, ()=> {
    console.log("Server is listening on port 8080");
});