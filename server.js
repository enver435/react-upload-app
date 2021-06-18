const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const multer = require('multer')
const port = 3001

/**
 * Use App Middlewares
 */
app.use(cors())
app.use('uploads', express.static(path.join(__dirname, 'uploads')))

/**
 * Upload Images
 */
const storageImages = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads/images'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const uploadImage = multer({storage: storageImages})
app.put('/upload/image', uploadImage.single('file'), (req, res) => {
    const json = {
        filename: path.basename(req.file.path),
        originalname: req.file.originalname
    }
    console.log(json)
    res.json(json)
})

/**
 * Upload Images
 */
const storageVideos = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads/videos'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const uploadVideo = multer({storage: storageVideos})
app.put('/upload/video', uploadVideo.single('file'), (req, res) => {
    const json = {
        filename: path.basename(req.file.path),
        originalname: req.file.originalname
    }
    console.log(json)
    res.json(json)
})

/**
 * Listen Http Server
 */
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})