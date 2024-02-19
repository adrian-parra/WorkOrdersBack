import express from 'express'
import cors from 'cors'
import corsOptions from './src/config/corsOptions.js'

import userRoute from './src/routes/users/userIndex.js'
import userAuthRoute from './src/routes/auth/userIndex.js'
import publicAuthRoute from './src/routes/auth/publicIndex.js'

const PORT = process.env.PORT || 5220
const RAIZ_ROUTE = process.env.RAIZ_ROUTE || '/api'

const app = express()

// ? HABILITA EL MANEJO DE SOLICITUDES CORS
app.use(cors(corsOptions))

// ? ANALIZA LAS SOLICITUDES ENTRANTES CON FORMATO JSON.
app.use(express.json())

app.use(RAIZ_ROUTE, userRoute)
app.use(RAIZ_ROUTE, publicAuthRoute)
app.use(RAIZ_ROUTE, userAuthRoute)

app.listen(PORT)
console.log('sever en puerto ', PORT)
