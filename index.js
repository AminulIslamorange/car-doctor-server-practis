const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mpfz1at.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const serviceCollection = client.db('carDoctor').collection('services');
    const bookingCollection = client.db('carDoctor').collection('bookings');

    // service related api
    app.get('/services', async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
     const query = { _id: new ObjectId(id) };
      const options = {
       // Include only the `title` and `imdb` fields in the returned document
        projection: { title: 1, service_id: 1, price: 1,img:1 },
      };
      const result = await serviceCollection.findOne(query, options);
      res.send(result);
    });


    // bookings related api
    app.post('/bookings',async(req,res)=>{
      const bookings=req.body;
      const result=await bookingCollection.insertOne(bookings);
      res.send(result)

    });

    // for secific data
    app.get('/bookings',async(req,res)=>{
      let query={}
      if(req.query?.email){
        query={email:req.query.email}
      }
      const result=await bookingCollection.find(query).toArray();
      res.send(result)
    });







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('dorctor server running')
});

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})