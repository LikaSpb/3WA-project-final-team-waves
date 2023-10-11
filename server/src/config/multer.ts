import multer from 'multer'
import { Request } from 'express'
import { extname } from 'path'

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: any) => {
    cb(null, 'public/uploads/')
  },
  filename: (req: Request, file: Express.Multer.File, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const fileExtName = extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtName)
  },
})

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Seules les images sont autorisées.'))
  }
}

const upload = multer({ storage, fileFilter })

export { upload }
