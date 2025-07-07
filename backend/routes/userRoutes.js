import express from 'express';
import { register, login,  fetchAllUsers } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/users', fetchAllUsers);

export default router;
