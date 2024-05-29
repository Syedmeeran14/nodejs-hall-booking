import express from 'express'
import BookingsController from '../controller/bookings.js'

const router = express.Router()

router.get('/getAllRooms',BookingsController.getAllRooms)
router.get('/getAllCustomers',BookingsController.getAllCustomers)
router.get('/bookingCount',BookingsController.bookingCount)
router.post('/createRoom',BookingsController.createRoom)
router.post('/createBooking',BookingsController.createBooking)


export default router