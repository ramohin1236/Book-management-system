const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORt || 3000 ;



// middleware
app.use(express.json())
app.use(cors())




// ******************************************************
// connect mongodb
const uri = process.env.MONGODB_URL;

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
// -------------------------------------------------------
// create db and collection
const db = client.db('book-management-system');
const bookCollection = db.collection("books")



// create a book (POST)

app.post('/books', async(req,res)=>{
     const booksData = req.body;
     console.log(booksData)
     try{

      const book =await bookCollection.insertOne(booksData)
      res.status(201).json({message:"book inserted successfully!",book})
       console.log(book)
     }catch(error){
         res.status(500).json({error: error.message})
     }
})


// get books by id
app.get("/books/:id", async(req,res)=>{
  const bookId = req.params.id

  try {
    const bookwithID = await bookCollection.findOne({_id: new ObjectId(bookId)})

    if(!bookwithID) return res.status(404).json({message: "Book not Found!"})

      res.json(bookwithID)
      // res.status(201).json({message:"Bookid found successfully!",bookwithID})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

// get books data

app.get('/books', async(req,res)=>{
  const {page, limit,genre, minYear,maxYear, author, title,minPrice,maxPrice, year, sortBy, order,search} =req.query;
    try {

      // pagination
      const currentPage = Math.max(1,parseInt(page) || 1)
      const perPage = parseInt(limit) || 10;
      const skip =(currentPage-1)*perPage;

      // search filter
      const filter ={};

      if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },  
            { description: { $regex: search, $options: "i" } }
        ];
    }


     if(genre) filter.genre = genre

     if(minYear || maxYear){
       filter.publishedYear ={
        ...(minYear && {$gte: parseInt(minYear)}),
        ...(maxYear && {$lte: parseInt(maxYear)}),
       }
     }
     

     if(author) filter.author = author;



     if(minPrice || maxPrice){
      filter.price ={
       ...(minPrice && {$gte: parseInt(minPrice)}),
       ...(maxPrice && {$lte: parseInt(maxPrice)}),
      }
    }


        // sort
        const sortOptions = {[sortBy || 'title'] : order === 'desc' ? -1 :1}

        const [books, totalBooks] =await Promise.all([bookCollection.find(filter).sort(sortOptions).skip(skip).limit(perPage).toArray(), bookCollection.countDocuments(filter)
        ]) 
// get books
      // const getAllBooks = await bookCollection.find(filter).sort(sortOptions).skip(skip).limit(perPage).toArray();
      res.status(201).json({message: 'All Books find!', books,totalBooks, currentPage,totalPages: Math.ceil(totalBooks / perPage)})
    } catch (error) {
      res.status(501).json({message:error.message})
    }
})

// update book

app.put('/books/:id', async(req,res)=>{
  const bookId = req.params.id
  try {
    const updateBook = await bookCollection.updateOne({_id : new ObjectId(bookId)}, {$set: req.body});

    res.json(updateBook)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

// delete book

app.delete('/books/:id', async(req,res)=>{
  const bookId = req.params.id
  try {
    const deletedBook = await bookCollection.deleteOne({_id : new ObjectId(bookId)})
    res.json({message: "Book Deleted"})
   
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})




// -------------------------------------------------------
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// *********************************************************






app.get('/', (req, res) => {
  res.send('book mannagement systerm!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



// mohinr26
// wLJB6u6JNKSb3Ep0