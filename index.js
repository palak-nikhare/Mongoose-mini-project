const express = require("express");
const app = express();
const mongoose = require("mongoose")
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

const expressError = require("./expressError")

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

//index page
app.get("/chats", async(req, res)=>{
    try{let chats = await Chat.find();
    console.log(chats);
    res.render("index.ejs", {chats});}
    catch(err) {
        next(err);
    }
})

//index page
// app.get("/chats", async(req, res)=>{
//     let chats = await Chat.find();
//     console.log(chats);
//     res.render("index.ejs", {chats});
// })

//new chat page
app.get("/chats/new" , (req, res)=> {
    // throw new expressError(404 , "page not found");
    res.render("new.ejs");
})


//create route
app.post("/chats", async (req, res, next)=>{
    try{let {from, msg, to} = req.body;
    let newChat = new Chat({
        from : from,
        msg :msg,
        to: to,
        created_at : new Date(),
    })
    console.log(newChat);
    await newChat.save()
    // .then((res)=> {console.log("chat saved");
    // }).catch((err)=>{
    //     console.log(err);
    // })

    res.redirect("/chats");}
    catch(err) {
        next(err);
    }
})

function asyncwrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=> next(err));
    }
}

app.get("/chats/:id" , asyncwrap(async(req, res, next)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id);

    if(!chat){
        next(new expressError(404, "Chat not found"));
    }
    res.render("show.ejs", {chat});}
    
));

//Edit route
app.get("/chats/:id/edit", asyncwrap(async (req, res, next)=> {
    let {id} = req.params;
    let chat = await Chat.findById(id);

    if(!chat){
        next(new expressError(404, "Chat not found"));
    }
    res.render("edit.ejs", {chat})})
    )

//Update route
app.put("/chats/:id", asyncwrap(async (req, res)=> {
    let {id} = req.params;
    let newmsg = req.body.msg;
    
    let upchat = await Chat.findByIdAndUpdate(id, {msg: newmsg},{runValidators: true, new: true});

    console.log(upchat);
    res.redirect("/chats")}
    ))

//destroy route
app.delete("/chats/:id", asyncwrap(async (req,res)=> {
    let {id} = req.params;
    let dechat= await Chat.findByIdAndDelete(id);
    console.log(dechat);
    res.redirect("/chats")}
    ))

app.get("/", (req ,res)=> {
    res.send("root working");
})

const handleValError =(err) => {
    console.log("This was a validation , follow the rules");
    console.dir(err);
    return err;
}

app.use((err,req,res,next) => {
    console.log(err.name);
    if(err.name === "ValidationError"){
        err = handleValError(err.message);
    }
    next(err);
});

//error handling middleware
app.use((err, req, res, next)=> {
    let {status= 500, message= "Some error occured"} = err;
    console.log(status);
    res.status(status).send(message);
})


app.listen(8080, ()=> {
    console.log("Server is listening on port 8080");
});