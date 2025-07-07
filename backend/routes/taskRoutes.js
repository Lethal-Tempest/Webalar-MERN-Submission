import express from 'express'
import {add, list} from '../controllers/taskControllers.js'

const router = express.Router();

router.post('/add', add);
router.post('/list', list);

export default router

