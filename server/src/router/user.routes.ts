import { Router } from 'express'
import { validationMiddleware } from '../middlewares/validations.middleware'
import { EditPasswordDto, UserDto } from '../dtos/users.dto'
import { UsersController } from '../controllers/user.controller'
import { upload } from 'config/multer'

const usersController = new UsersController()

const router = Router()

router.post('/login', validationMiddleware(UserDto), usersController.loginUser)

router.post(
  '/register',
  validationMiddleware(UserDto),
  usersController.registerUser,
)

router.get('/', usersController.getAllUsers)

router.get('/connected', usersController.getAllUsersConnected)

router.get('/:id', usersController.getOneUser)

router.put('/:id', usersController.editUser)
router.put(
  '/:userId/profilepicture',
  upload.single('profilePicture'),
  usersController.editProfilePhoto,
)

router.put(
  '/changepsw/:id',
  validationMiddleware(EditPasswordDto),
  usersController.editPassword,
)

export default router
