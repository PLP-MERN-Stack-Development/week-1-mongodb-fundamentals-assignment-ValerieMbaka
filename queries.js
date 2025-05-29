// queries.js

const { MongoClient } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db("plp_bookstore");
        const books = db.collection("books");
        
        // Find all books in a specific genre e.g. find all Fantasy books
        const fantasyBooks = await books.find({ genre: "Fantasy" }).toArray();
        console.log("Fantasy Books:", fantasyBooks);
        
        // Find books published after 2010
        const booksAfter2010 = await books.find({ published_year: { $gt: 2010 } }).toArray();
        console.log("Books after 2010:", booksAfter2010);
        
        // Find books by George Orwell
        const orwellBooks = await books.find({ author: "George Orwell" }).toArray();
        console.log("George Orwell books:", orwellBooks);
        
        // Update price of "Dune"
        const updatePrice = await books.updateOne({ title: "Dune" }, { $set: { price: 28 } });
        console.log("Updated Dune:", updatePrice);
        
        // Delete "Rich Dad Poor Dad"
        const deleteBook = await books.deleteOne({ title: "Rich Dad Poor Dad" });
        console.log("Deleted book:", deleteBook);
        
        // Find in-stock books published after 2010
        const inStockRecent = await books.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray();
        console.log("In-stock & recent books:", inStockRecent);
        
        // Projection (title, author, price only)
        const projection = await books.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).toArray();
        console.log("Projected books:", projection);
        
        // Sort by price ASC
        const sortedAsc = await books.find().sort({ price: 1 }).toArray();
        console.log("Books sorted by price (asc):", sortedAsc);
        
        // Sort by price DESC
        const sortedDesc = await books.find().sort({ price: -1 }).toArray();
        console.log("Books sorted by price (desc):", sortedDesc);
        
        // Pagination - Page 1 (first 5 books)
        const page1 = await books.find().skip(0).limit(5).toArray();
        console.log("Page 1:", page1);
        
        // Pagination - Page 2 (next 5 books)
        const page2 = await books.find().skip(5).limit(5).toArray();
        console.log("Page 2:", page2);
        
        // Average price by genre
        const avgPriceGenre = await books.aggregate([
            { $group: { _id: "$genre", avg_price: { $avg: "$price" } } }
        ]).toArray();
        console.log("Average price by genre:", avgPriceGenre);
        
        // Author with most books
        const topAuthor = await books.aggregate([
            { $group: { _id: "$author", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]).toArray();
        console.log("Top author:", topAuthor);
        
        // Group books by decade
        const groupByDecade = await books.aggregate([
            {
                $group: {
                    _id: {
                        $concat: [
                            { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
                            "s"
                        ]
                    },
                    count: { $sum: 1 }
                }
            }
        ]).toArray();
        console.log("Books by decade:", groupByDecade);
        
        // Average price of books by genre (again, in a slightly different format)
        const averagePriceByGenre = await books.aggregate([
            {
                $group: {
                    _id: "$genre",
                    averagePrice: { $avg: "$price" }
                }
            }
        ]).toArray();
        console.log("Average price by genre (2nd):", averagePriceByGenre);
        
        // Create index on title
        const indexTitle = await books.createIndex({ title: 1 });
        console.log("Created index on title:", indexTitle);
        
        // Create compound index on author & published_year
        const compoundIndex = await books.createIndex({ author: 1, published_year: 1 });
        console.log("Created compound index:", compoundIndex);
        
        // Explain query performance for title = "Dune"
        const explain = await books.find({ title: "Dune" }).explain("executionStats");
        console.log("Query explain (Dune):", explain);
        
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

run();