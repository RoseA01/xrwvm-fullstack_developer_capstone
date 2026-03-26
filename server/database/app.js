const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.urlencoded({ extended: false })); 
app.use(express.json());

const reviews_data = JSON.parse(fs.readFileSync("data/reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("data/dealerships.json", 'utf8'));

mongoose.connect("mongodb://mongo_db:27017/", { dbName: 'dealershipsDB' })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const Review = require('./review');
const Dealership = require('./dealership');

async function seedDatabase() {
    try {
        await Review.deleteMany({});
        await Review.insertMany(reviews_data['reviews']);

        await Dealership.deleteMany({});
        await Dealership.insertMany(dealerships_data['dealerships']);

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedDatabase();


app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API");
});


app.get('/fetchReviews', async (req, res) => {
    try {
        const documents = await Review.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});


app.get('/fetchReviews/dealer/:id', async (req, res) => {
    try {
        const documents = await Review.find({ dealership: req.params.id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});


app.get('/fetchDealers', async (req, res) => {
    try {
        const documents = await Dealership.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});


app.get('/fetchDealers/:state', async (req, res) => {
    try {
        const documents = await Dealership.find({
            state: req.params.state
        });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});


app.get('/fetchDealer/:id', async (req, res) => {
    try {
        const document = await Dealership.findOne({ id: parseInt(req.params.id) });
        if (!document) {
            return res.status(404).json({ error: 'Dealer not found' });
        }
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching document' });
    }
});


app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
    try {
        const data = JSON.parse(req.body);

        const lastReview = await Review.findOne().sort({ id: -1 });
        const new_id = lastReview ? lastReview.id + 1 : 1;

        const review = new Review({
            id: new_id,
            name: data['name'],
            dealership: data['dealership'],
            review: data['review'],
            purchase: data['purchase'],
            purchase_date: data['purchase_date'],
            car_make: data['car_make'],
            car_model: data['car_model'],
            car_year: data['car_year']
        });

        const savedReview = await review.save();
        res.json(savedReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error inserting review' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
