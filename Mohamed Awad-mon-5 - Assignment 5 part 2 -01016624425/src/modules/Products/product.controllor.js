import express from 'express'
const controllor=express.Router()
import * as proServies from './servies/product.servies.js'


controllor.post("/addproduct",proServies.insertproduct)
















export default controllor