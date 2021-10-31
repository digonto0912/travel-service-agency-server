const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors =require('cors');



const app  = express();
const port = process.env.port || 5000;
//username:tourDBUSER
//pass:yuCckc4AN7jE1VVF
//middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pwb5s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);
async function run (){
    try{
        await client.connect();
        const database = client.db('tourist_plan');
        const tourCollection = database.collection ('deals');
        
        //get deal api 
        app.get('/deals',async(req,res)=>{
            const cursor = tourCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);

        
        })
        //get single service
        app.get("/deals/:id" ,async(req,res)=>{
            const id = req.params.id;
            console.log('getting deals',id);
            const query = {_id:objectId(id)};
            const deal = await tourCollection.findOne(query);
            res.json(deal);

        })

        // add deals 
        app.post("/addDeal",async(req,res)=>{
            console.log(req.body);
            const result = await tourCollection.insertOne(req.body);
            console.log(result);
           

        })
        //deleted api
        app.delete('/deals/:id',async(req,res)=>{
            const id = req.params.id;
            const query =  {_id:objectId(id)};
            const result = await tourCollection.deleteOne(query);
            res.json(result);
        })

        

    }
    finally{
       // await client.close();
    }

}

run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('my server is runnig');

});

app.listen(port,()=>{
    console.log('server runnig at port ',port);
})