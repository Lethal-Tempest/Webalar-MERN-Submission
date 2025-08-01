import express from 'express'
import {add, list, update, remove, updateLastUpdated, smartAssign} from '../controllers/taskControllers.js'

const router = express.Router();

router.post('/add', add);
router.post('/list', list);
router.post('/update', update);
router.post('/remove', remove);
router.post('/updateLastUpdated', updateLastUpdated);
router.post('/smart-assign', smartAssign);

export default router

