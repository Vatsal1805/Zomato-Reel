const express = require('express');
const router = express.Router();
const foodPartnerController = require('../controllers/food-partner.controller.js');
const { authenticateFoodPartner, authenticateUser } = require('../middlewares/auth.middlewares.js');

// Check if current user is authenticated food partner
router.get('/auth/check', authenticateFoodPartner, (req, res) => {
    res.status(200).json({
        message: "Food partner authenticated successfully",
        foodPartner: {
            _id: req.foodPartner._id,
            restaurantName: req.foodPartner.restaurantName || req.foodPartner.name,
            email: req.foodPartner.email
        }
    });
});

router.get('/:id', authenticateUser, foodPartnerController.getFoodPartnerProfile);

module.exports = router;