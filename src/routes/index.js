import express from 'express'
import BookingsRoutes from './bookings.js'

const router = express.Router()

router.use('/hall-booking',BookingsRoutes)

export default router