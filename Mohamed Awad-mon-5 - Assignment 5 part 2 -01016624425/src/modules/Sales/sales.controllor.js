import express from 'express'
const controllor=express.Router()
import * as salesServies from './servies/sales.servies.js'


controllor.post("/addsales",salesServies.addsales)
















export default controllor