const express = require('express'); // require express
const mongoose = require('mongoose'); // require mongoose for connecting to MongoDB

const app = express(); // initiliaze app with express

const path = require('path');
const config = require('config');

// body parser middleware
app.use(express.json());

// DB config
const db = config.get('mongoURI');

// connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// use routes
app.use('/api/items', require('./routes/api/Items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

// Serve static assests if in production
if(process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));