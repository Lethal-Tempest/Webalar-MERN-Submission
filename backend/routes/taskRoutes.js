import express from 'express'
import {add, list, update, remove} from '../controllers/taskControllers.js'

const router = express.Router();

router.post('/add', add);
router.post('/list', list);
router.post('/update', update);
router.post('/remove', remove)

export default router

