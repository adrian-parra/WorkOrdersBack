import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import corsOptions from './src/config/corsOptions.js'
import verifyJWT from './src/middleware/verifyJWT.js'
import credentials from './src/middleware/credentials.js'

import userRoute from './src/routes/users/userIndex.js'
import userAuthRoute from './src/routes/auth/userIndex.js'
import publicAuthRoute from './src/routes/auth/publicIndex.js'

const PORT = process.env.PORT || 5220
const RAIZ_ROUTE = process.env.RAIZ_ROUTE || '/api'

const app = express()

// ? HABILITA O DESHABILITA LA COMPARTICIÓN DE CREDENCIALES
app.use(credentials)

// ? HABILITA EL MANEJO DE SOLICITUDES CORS
app.use(cors(corsOptions))

// ? ANALIZA LAS SOLICITUDES ENTRANTES CON FORMATO JSON
app.use(express.json())

app.use(RAIZ_ROUTE, publicAuthRoute)

app.use(verifyJWT) // ? MIDDLEWARE VERIFICAR TOKEN DE ACCESO

/**
 * ? PERMITE QUE LA APLICACIÓN ANALICE LAS COOKIES QUE SE ENVÍAN CON
 * ? LAS SOLICITUDES HTTP ENTRANTES
 */
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }))

app.use(RAIZ_ROUTE, userAuthRoute)
app.use(RAIZ_ROUTE, userRoute)

app.listen(PORT)
console.log('sever en puerto ', PORT)
