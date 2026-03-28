const express = require('express');
const router = express.Router();
const { getCustomers, toggleCustomer, getDashboard } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboard);
router.get('/customers', getCustomers);
router.put('/customers/:id/toggle', toggleCustomer);

module.exports = router;
