const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/User.routes.js');
const productRoutes = require('./routes/Product.routes.js');


const App = express()
App.use(cors)
App.use(express.json())


require('dotenv').config();

App.use('/api/Users', userRoutes);
App.use('/api/Product', productRoutes);



App.listen(process.env.PORT || 5001, () => {
    console.log('Server is running on port 5001');
})