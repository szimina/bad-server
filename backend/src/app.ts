import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { rateLimit } from 'express-rate-limit'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'


const { PORT = 3000 } = process.env
const app = express()

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 минут
    max: 40, // Лимит для каждого IP на 40 запросов за 10 минут
    standardHeaders: 'draft-7',
	legacyHeaders: false,
    message: 'Слишком много запросов с данного IP, пожалуйста, попробуйте позднее'
});
// Применяем лимитер ко всем запросам
app.use(limiter);

app.use(cookieParser())


// app.use(cors())
app.use(cors({ origin: process.env.ORIGIN_ALLOW, credentials: true }));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))
app.use(json())

app.options('*', cors())
app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console
const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
