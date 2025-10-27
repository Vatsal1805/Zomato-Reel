const foodPartnerModel = require("../models/foodPartner.model");
const foodItemModel = require("../models/fooditem.model");

async function getFoodPartnerProfile(req, res) {
    try {
        const foodPartnerId = req.params.id;
        console.log("Fetching profile for partner ID:", foodPartnerId);
        
        // Fetch food partner details
        const foodPartner = await foodPartnerModel.findById(foodPartnerId).select('-password');
        console.log("Found food partner:", foodPartner);
        
        if (!foodPartner) {
            console.log("No food partner found with ID:", foodPartnerId);
            return res.status(404).json({ message: "Food partner not found" });
        }

        // Fetch all food items by this partner
        const foodItems = await foodItemModel.find({ foodPartner: foodPartnerId });
        console.log("Found food items:", foodItems.length);
        
        // Calculate statistics
        const totalMeals = foodItems.length;
        const customersServed = totalMeals * 10; // Sample calculation - you can modify this logic
        
        // Handle different field formats for backward compatibility
        const partnerData = {
            _id: foodPartner._id,
            // Handle restaurant name - try different possible field names
            restaurantName: foodPartner.restaurantName || foodPartner.name || 'Restaurant Name Not Available',
            // Handle owner name - try different possible field names (note the capital O)
            ownerName: foodPartner.ownerName || foodPartner.OwnerName || 'Owner Name Not Available',
            // Handle address - try different possible field names
            address: foodPartner.address || foodPartner.RestaurantAddress || 'Address Not Available',
            email: foodPartner.email,
            // Handle phone - try different possible field names
            phone: foodPartner.phone || foodPartner.ContactNumber || 'Phone Not Available'
        };

        console.log("Formatted partner data:", partnerData);

        res.status(200).json({
            message: "Food partner profile fetched successfully",
            foodPartner: partnerData,
            statistics: {
                totalMeals,
                customersServed: customersServed > 1000 ? `${Math.floor(customersServed / 1000)}K` : customersServed
            },
            foodItems
        });
    }
    catch(error) {
        return res.status(500).json({ message: error.message });
    }
}


module.exports = { getFoodPartnerProfile };

