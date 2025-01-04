const express=require('express')
const app=express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors=require('cors')
require('dotenv').config()
const port= process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.rzyh2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("productsDB");
    const productCollection = database.collection("products");

    app.get('/product',async(req,res)=>{
      const query=productCollection.find()
      const result=await query.toArray()
      res.send(result)
    })
    app.post('/product',async(req,res)=>{
      const product=req.body
      console.log(product);
      const result = await productCollection.insertOne(product);
      res.send(result)

    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// basic server setting
app.get('/',(req,res)=>{
    res.send('Bicycle server is ready')
})
app.listen(port,(req,res)=>{
    console.log(`The server is runnning${port}`);
})