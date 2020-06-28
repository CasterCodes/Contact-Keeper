const express = require("express");
const app = express();
const connectDB = require('./config/db');
// connect to the database
connectDB()
// middleware
app.use(express.json({extended: false }))
const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
        res.json({message:'Welcome to the Contact Keeper App'})
})
// Define route parameters
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/contacts', require('./routes/contacts'))
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))