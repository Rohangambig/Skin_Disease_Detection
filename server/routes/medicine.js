const express = require('express');
const router = express.Router();
const {allMedicines,CartMedicine,fetchCartMedicine,removeCartMedicine} = require('../controllers/medicine');
const {protect} = require('../middleWare/user'); 

router.get('/',allMedicines);
router.post('/cartProduct',protect,CartMedicine);
router.get('/fetchCart',protect,fetchCartMedicine);
router.post('/removeCart',protect,removeCartMedicine);

module.exports = router;