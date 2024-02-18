import express from 'express'
import cors from 'cors'
import corsOptions from './config/corsOptions.js'

const PORT = process.env.PORT || 5220

const app = express()

// ? HABILITA EL MANEJO DE SOLICITUDES CORS
app.use(cors(corsOptions))

// ? ANALIZA LAS SOLICITUDES ENTRANTES CON FORMATO JSON.
app.use(express.json())

app.listen(PORT)
console.log('sever en puerto ', PORT)