import { v4 as uuid4 } from "uuid"

const date_regex = /^(0[1-9]|[12][0-9]|3[01])[-\/](0[1-9]|1[0-2])[-\/]\d{4}$/
const time_regex = /^(0[0-9]|1\d|2[0-3])\:(00)/

let rooms=[
    {
        roomId:1,
        roomName:'room-1',
        amenities:["TV","Non-AC"],
        seats:6,
        pricePerHour:1000
    },
    {
        roomId:2,
        roomName:'room-2',
        amenities:["TV","AC"],
        seats:8,
        pricePerHour:2000
    },
    {
        roomId:3,
        roomName:'room-3',
        amenities:["TV","AC","Snacks","Free- WIFI"],
        seats:10,
        pricePerHour:3000
    }
]

let customers = [
    {
      customerName: 'Alan',
      customerId: "Alan1",
    },
    {
        customerName: 'Conway',
        customerId: "Conway1",
    },
    {
        customerName: "Rachin",
        customerId: "Rachin1"
    }
]

let bookings = [
    {
        bookingId: "3c118575-d716-4c79-b49d-300e7e1c459e",
        customerName: "Alan",
        customerId: "Alan1",
        roomId: 1,
        date:"26/05/2024",
        startTime: "10:00",
        endTime: "11:00",
        bookingStatus: true
    },
    {
        bookingId: "9fc64a44-facb-4194-bc6d-7ed4e429cc26",
        customerName: "Conway",
        customerId: "Conway1",
        roomId: 2,
        date:"27/05/2024",
        startTime: "11:00",
        endTime: "12:00",
        bookingStatus: true
    },
    {
        bookingId: "b59784d4-1123-43c7-88d4-46836bdc5604",
        customerName: "Conway",
        customerId: "Conway1",
        roomId: 2,
        date:"28/05/2024",
        startTime: "13:00",
        endTime: "14:00",
        bookingStatus: true
    }
]



//Endpoint for creating a room
const createRoom = (req,res) => {
    try {
        let isCorrect = true

        let room = {}

        let roomId = rooms.length ? rooms[rooms.length-1].roomId + 1 : 1
        // let roomName = "room-" + roomId

        if(req.body.roomName) {
            if(typeof req.body.roomName !== 'string') {
                res.status(400).send({
                    message: "Enter only String values for the roomName"
                })
                isCorrect = false
                return;
            }
        } else {
            res.status(400).send({
                message: "Please provide Room Name"
            })
        }

        if(req.body.seats) {
            if(!Number.isInteger(req.body.seats)) {
              res.status(400).send({ message: "Enter only integer values for Number of Seats" })
              isCorrect = false
              return;
            }
        } else {
            res.status(400).send({ message: "Please specify No of seats for Room" })
            isCorrect = false
            return;
        }

        if(req.body.amenities) {
            if (!Array.isArray(req.body.amenities)) {
              res.status(400).send({ output: "Amenities list accepts only array of strings" })
              isCorrect = false
              return;
            }
        } else {
            res.status(400).send({
              output: "Please specify all Amenities for Room in Array format"
            })
            isCorrect = false
            return;
        }

        if (req.body.pricePerHour) {

            const pricePerHour = req.body.pricePerHour
            
            if(typeof pricePerHour !== 'number' || isNaN(pricePerHour)) {
                res.status(400).send({ output: "Enter only Integer or Float digits for Price per Hour" });
                isCorrect = false
                return;
            }
        } else {
            res.status(400).send({ output: "Please specify price per hour for Room" });
            isCorrect = false;
            return;
        }

        if(isCorrect) {

            room.roomId = roomId
            room.roomName = req.body.roomName
            room.seats = req.body.seats
            room.amenities = req.body.amenities
            room.pricePerHour = req.body.pricePerHour

            rooms.push(room)

            res.status(201).send({ message: "Room Created Successfully", CreatedRoom: room, AllRooms: rooms})
        }
          
    } catch(error) {
        res.status(500).send({
            error : error.message || "Internal Server Error"
        })
    }
}


//Endpoint to create a booking
const createBooking = (req,res) => {
    try {
        let isCorrect = true
        let checkRoom = []

        if(rooms.length) {

            if(req.body.roomId) {
                if(Number.isInteger(req.body.roomId)) {

                    checkRoom = rooms.filter((r) => r.roomId === req.body.roomId)

                    if (!checkRoom.length) {
                      res.status(400).send({message: `No room available with room ID ${req.body.roomId} for booking`})
                      isCorrect = false
                      return;
                    }
                } else {
                    res.status(400).send({ message: "Enter only integer values for Room Number" })
                    isCorrect = false
                    return;
                }
            } else {
                res.status(400).send({ message: `Please specify a Room ID (field: "id") for booking`})
                  isCorrect = false
                  return;
            }

            if(req.body.customerName) {
                if(typeof req.body.customerName !== 'string') {
                    res.status(400).send({message: "Enter a String value for customer name"})
                    isCorrect = false
                    return;
                }
            } else {
                res.status(400).send({ message: "Please specify customer Name for booking" })
                isCorrect = false
                return;
            }

            if(req.body.date) {
                if (!date_regex.test(req.body.date)) {
                    res.status(400).send({ message: "Please specify date in DD/MM/YYYY" })
                    isCorrect = false
                    return;
                }
            } else {
                res.status(400).send({ message: "Please specify date for booking"});
                isCorrect = false
                return;
            }

            if(req.body.startTime) {

                if(time_regex.test(req.body.startTime)) {

                    let dateTime = `${req.body.date.substring(6)}-${req.body.date.substring(3, 5)}-${req.body.date.substring(0,2)}`

                    const currentDateTime = new Date().getTime()

                    dateTime = new Date(`${dateTime}T${req.body.startTime}`).getTime()

                    if (dateTime < currentDateTime) {
                        res.status(400).send({message: "Please specify a current or future date and time for booking"})
                        isCorrect = false
                        return;
                    }
                } else {
                    res.status(400).send({ message: "Please specify time in hh:min(24-hr format) where minutes should be zero(:00) only"})
                    isCorrect = false
                    return;
                }
            } else {
                res.status(400).send({ message: "Please specify Starting time for booking."})
                isCorrect = false
                return;
              }

              if(req.body.endTime) {

                if(time_regex.test(req.body.endTime)) {

                    let dateTime = `${req.body.date.substring(6)}-${req.body.date.substring(3, 5)}-${req.body.date.substring(0,2)}`

                    let sTime = new Date(`${dateTime}T${req.body.startTime}`).getTime()
                    let eTime = new Date(`${dateTime}T${req.body.endTime}`).getTime()

                    if(sTime >= eTime){
                        res.status(400).send({ message: "End time must be greater than Start time"})
                        isCorrect = false
                        return;
                    }
                    
                } else {
                    res.status(400).send({ message: "Please specify time in hh:min(24-hr format) where minutes should be zero(:00) only"})
                    isCorrect = false
                    return;
                }
              } else {
                res.status(400).send({ message: "Please specify Ending time for booking."})
                isCorrect = false
                return;
              }

              let isAvailable = false
              
              let temp = bookings.filter(b => b.roomId === checkRoom[0].roomId)

              if(temp.length) {

                    let sameDateBookings = temp.filter(e => e.date === req.body.date)

                        if(sameDateBookings.length) {

                            let isTimeAvailable = true

                            sameDateBookings.map((book) => {

                                let dateTime = `${req.body.date.substring(6)}-${req.body.date.substring(3, 5)}-${req.body.date.substring(0,2)}`

                                let sTime = new Date(`${dateTime}T${req.body.startTime}`).getTime()
                                let eTime = new Date(`${dateTime}T${req.body.endTime}`).getTime()

                                let bDate = book.date
                                let bDateTime = `${bDate.substring(6)}-${bDate.substring(3,5)}-${bDate.substring(0,2)}`

                                let bSTime = new Date(`${bDateTime}T${book.startTime}`).getTime()
                                let bETime = new Date(`${bDateTime}T${book.endTime}`).getTime()

                                if(
                                    !(
                                        ( (parseInt(bSTime) > parseInt(sTime) && parseInt(bSTime) >= parseInt(eTime)) || ( parseInt(bETime) <= parseInt(sTime) && parseInt(bETime) < parseInt(eTime) ))
                                    )
                                ) {
                                    isTimeAvailable = false
                                }
                            })

                            if(isTimeAvailable) {
                                isAvailable = true
                            }
                        } else {
                            isAvailable = true
                        }
                } else {
                    isAvailable = true
                }

                if(!isAvailable) {
                    res.status(400).send({
                        message: `Room ${req.body.roomId} is not available on Selected Date and Time`
                    })
                    isCorrect = false
                    return;
                } else {

                    if(isCorrect) {

                        let cusId

                        if(req.body.customerName) {

                            let temp1 = customers.filter(c => c.customerName === req.body.customerName)

                            if(temp1.length) {
                                cusId = temp1[0].customerId
                            } else {
                                cusId = `${req.body.customerName}1`
                                customers.push({
                                    customerName: req.body.customerName,
                                    customerId: cusId
                                })
                            }
                        }
  
                        bookings.push({
                            bookingId: uuid4(),
                            customerName: req.body.customerName,
                            customerId: cusId,
                            roomId: req.body.roomId,
                            date: req.body.date,
                            startTime: req.body.startTime,
                            endTime: req.body.endTime,
                            bookingStatus: true
                        })
                        
                        res.status(200).send({
                            message: "Room Booking Successfull"
                        })
                    } else {
                        res.status(400).send({
                            message: "Errors in Entered data"
                        })
                    }
                }
        } else {
            res.status(200).send({
                message: "No rooms available for booking"
            })
        }
    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


//Endpoint to list all rooms with Booked data
const getAllRooms = (req,res) => {
    try {
        if(rooms.length) {

            let data =  rooms.map((r) => {

                let bookingData = bookings.filter((b) => b.roomId === r.roomId)

                return {
                    ...r,
                    bookingData: bookingData.length? bookingData : "No Booking history available"
                }
            })

            res.status(200).send({RoomData: data})
        } else {
            res.status(400).send({message: "No Rooms available"})
        }
        
    } catch(error) {
        res.status(500).send({
            error : error.message || "Internal Server Error"
        })
    }
}


//Endpoint to list all the customers with Booked data
const getAllCustomers = (req,res) => {
    try{
        if(customers.length) {

            let customersData = customers.map(c => {

                let bookingData = bookings.filter(b => b.customerId === c.customerId)

                return {
                    ...c,
                    bookingData: bookingData.length? bookingData : "No Booking history available"
                }
            })
            res.status(200).send({
                message: "Customer Data fetch successfull",
                customersData
            })
        }
    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


//Endpoint to list how many time a customer has booked the room
const bookingCount = (req,res) => {
    try {

        let customerName = req.body.customerName
        if(!customerName) {
            return res.status(400).send({
                message: "Please fill the customer name field"
            })
        }


        let fetch = bookings.filter(e => e.customerName === customerName)
        if(fetch.length) {

            res.status(200).send({
                message: 'Data fetch Successfull',
                BookingData: {
                    count: fetch.length,
                    customerName,
                    customerId: fetch[0].customerId,
                    bookingData: fetch
                }
                
            })
        } else {
            res.status(400).send({
                message: "The Customer has no booking history"
            })
        }

    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}



export default {
    createRoom,
    getAllRooms,
    getAllCustomers,
    bookingCount,
    createBooking
}