// Import MongoDB client
const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';

// Database and collection names
const dbName = 'plp_bookstore';
const collectionName = 'books';

// Sample book data
const books = [
    {
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self-help",
        published_year: 2018,
        price: 20,
        in_stock: true,
        pages: 320,
        publisher: "Avery"
    },
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        published_year: 1937,
        price: 15,
        in_stock: true,
        pages: 310,
        publisher: "George Allen & Unwin"
    },
    {
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        published_year: 1988,
        price: 18,
        in_stock: false,
        pages: 208,
        publisher: "HarperTorch"
    },
    {
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
        published_year: 1949,
        price: 12,
        in_stock: true,
        pages: 328,
        publisher: "Secker & Warburg"
    },
    {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        genre: "History",
        published_year: 2011,
        price: 22,
        in_stock: true,
        pages: 443,
        publisher: "Harvill Secker"
    },
    {
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        genre: "Finance",
        published_year: 1997,
        price: 10,
        in_stock: false,
        pages: 207,
        publisher: "Warner Books"
    },
    {
        title: "Dune",
        author: "Frank Herbert",
        genre: "Science Fiction",
        published_year: 1965,
        price: 25,
        in_stock: true,
        pages: 412,
        publisher: "Chilton Books"
    },
    {
        title: "Becoming",
        author: "Michelle Obama",
        genre: "Biography",
        published_year: 2018,
        price: 19,
        in_stock: false,
        pages: 448,
        publisher: "Crown"
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Classic",
        published_year: 1960,
        price: 14,
        in_stock: true,
        pages: 281,
        publisher: "J.B. Lippincott & Co."
    },
    {
        title: "Educated",
        author: "Tara Westover",
        genre: "Memoir",
        published_year: 2018,
        price: 16,
        in_stock: true,
        pages: 334,
        publisher: "Random House"
    }
];


// Function to insert books into MongoDB
async function insertBooks() {
    const client = new MongoClient(uri);
    
    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to MongoDB server');
        
        // Get database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        // Check if collection already has documents
        const count = await collection.countDocuments();
        if (count > 0) {
            console.log(`Collection already contains ${count} documents. Dropping collection...`);
            await collection.drop();
            console.log('Collection dropped successfully');
        }
        
        // Insert the books
        const result = await collection.insertMany(books);
        console.log(`${result.insertedCount} books were successfully inserted into the database`);
        
        // Display the inserted books
        console.log('\nInserted books:');
        const insertedBooks = await collection.find({}).toArray();
        insertedBooks.forEach((book, index) => {
            console.log(`${index + 1}. "${book.title}" by ${book.author} (${book.published_year})`);
        });
        
    } catch (err) {
        console.error('Error occurred:', err);
    } finally {
        // Close the connection
        await client.close();
        console.log('Connection closed');
    }
}

// Run the function
insertBooks().catch(console.error);