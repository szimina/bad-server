import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join } from 'path'

const { v4: uuidv4 } = require('uuid');
const path = require('path');

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(
            null,
            join(
                __dirname,
                process.env.UPLOAD_PATH_TEMP
                    ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                    : '../public'
            )
        )
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, file.originalname)
    },

    // filename(_req:Request, file: Express.Multer.File, cb:FileNameCallback) {
    //     console.log(file.originalname)
    //     cb(null, uuidv4() + path.extname(file.originalname));
    //   }
  
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {

    const fileSize = req.file?.size
    console.log(fileSize)
    if (!types.includes(file.mimetype) || !fileSize || fileSize <= 2048) {
        return cb(null, false)
    }

    return cb(null, true)
}



export default multer({ storage, fileFilter })
