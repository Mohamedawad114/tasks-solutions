import express from 'express'
const controllor=express.Router()
import * as supServies from './servies/suppliers.servies.js'



controllor.post('/addsupplier',supServies.addsupplier)



export default controllor