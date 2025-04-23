const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORt || 3000 ;




// middleware
app.use(express.json())
app.use(cors())


const JWT_SECRET = 'your_secret_key'; 

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
const userCollection = db.collection("users");



// Signup route

app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role || "user" 
    };

    const result = await userCollection.insertOne(newUser);

    res.status(201).json({ message: "User created successfully", userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});


// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // ⛔️ BEFORE (this doesn't include role)
    // const token = jwt.sign(
    //   { id: user._id, email: user.email },
    //   JWT_SECRET,
    //   { expiresIn: '7d' }
    // );

    // ✅ AFTER (include role)
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role // ✅ ADD THIS
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // Optional: send it in the response too
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route (dummy, for client to call and remove token)
app.post('/logout', (req, res) => {
  // Token remove client-side e hobe, ei route just confirmation dey
  return res.status(200).json({ message: 'Logout successful' });
});



  
// Middleware to verify JWT and admin access
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Now we can use decoded info to check user role
    userCollection.findOne({ _id: new ObjectId(decoded.id) })
      .then(user => {
        if (!user || user.role !== 'admin') {
          return res.status(403).json({ message: "Access denied. Admins only." });
        }
        req.user = user;
        next();
      })
      .catch(err => res.status(500).json({ message: "Internal error", error: err.message }));
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// create a book (POST)

app.post('/books',verifyAdmin, async(req,res)=>{
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

app.put('/books/:id',verifyAdmin, async(req,res)=>{
  const bookId = req.params.id
  try {
    const updateBook = await bookCollection.updateOne({_id : new ObjectId(bookId)}, {$set: req.body});

    res.json(updateBook)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

// delete book

app.delete('/books/:id',verifyAdmin, async(req,res)=>{
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