import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import authRoutes from './routes/authRoutes.js'

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})