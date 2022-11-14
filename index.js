const express = require('express');
const bodyParser = require('body-Parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();
const multer = require("multer")

const ImageModel = require("./image.model")

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors())
app.use(express.json());

// mongodb

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nc5dmke.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// storage
const Storage = multer.diskStorage({
    destination:'uploads',
    filename:(req, file, cb)=>{
        cb(null, file.originalname);
    },
})

const upload = multer({
    storage: Storage
}).single("testImage");


// app.get('/upload', async(req, res)=>{
//     // const query = {};
//     // const cursor  = .find(query);
//     // const result = await cursor.toArray();
//     res.send("hello");
// })

app.post('/upload', (req, res)=>{
    upload(req,res,(err)=>{
        if(err){
            console.log(err)
        }
        else{
            const newImage = new ImageModel({
                name:req.body.name,
                image: {
                    data: req.file?.fileName,
                    contentType: 'image/png'
                }
            })
            newImage.save()
            .then(()=>res.send('successfully uploaded')).catch(err=>console.log(err))
        }
    })
})

app.get("/",(req,res)=> {

    res.json("hello world")
})

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nc5dmke.mongodb.net/test?retryWrites=true&w=majority`,{
    useNewUrlParser:true
})
.then(()=> {
    app.listen(port,()=> {
        console.log(`server is runnig on ${port} and database connected succesfully `)
    })

})
.catch(e=> {
    console.log(e)
})