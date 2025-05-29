// Find all books in a specific genre
db.books.find({ genre: "Fantasy" })

// Find books published after a certain year
db.books.find({ published_year: { $gt: 2010 } })

// Find books by a specific author
db.books.find({ author: "George Orwell" })

// Update the price of a specific book
db.books.updateOne({ title: "Dune" }, { $set: { price: 28 } })

// Delete a book by its title
db.books.deleteOne({ title: "Rich Dad Poor Dad" })

// Books in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } })

// Projection: show only title, author, price
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })

// Sort by price ascending
db.books.find().sort({ price: 1 })

// Sort by price descending
db.books.find().sort({ price: -1 })

// Pagination: Page 1 (first 5 books)
db.books.find().skip(0).limit(5)

// Pagination: Page 2 (next 5 books)
db.books.find().skip(5).limit(5)

// Average price of books by genre
db.books.aggregate([
    { $group: { _id: "$genre", avg_price: { $avg: "$price" } } }
])

// Author with most books
db.books.aggregate([
    { $group: { _id: "$author", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
])

// Group books by publication decade
db.books.aggregate([
    {
        $group: {
            _id: { $concat: [ { $toString: { $subtract: [ { $divide: ["$published_year", 10] }, { $mod: ["$published_year", 10] } ] } }, "s" ] },
            count: { $sum: 1 }
        }
    }
])

// Average price of books by genre
db.books.aggregate([
    {
        $group: {
            _id: "$genre",
            averagePrice: { $avg: "$price" }
        }
    }
]);

// Index on title
db.books.createIndex({ title: 1 })

// Compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 })

// Explain query performance
db.books.find({ title: "Dune" }).explain("executionStats")
