const Medicine = require('../models/medicine');
const Cart = require('../models/cart')

const allMedicines = async (req, res) => {
  const { disease } = req.query; 
  try {
    
    const medicines = await Medicine.find({ disease });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicines' });
  }
};

const CartMedicine = async (req,res) =>{
  const userId = req.user._id;
  const {id} = req.body;

  if(!userId) 
    return res.status(403).json({'message':"Error in getting the userData"});

  try {
    const newData = new Cart({
      userId,
      productId:id
    });

    await newData.save();
    return res.status(200).json({message:"carted the product"});

  }catch(err){
    return res.status(402).json({'message':"Unable to add the item to the cart"})
  }
}

const fetchCartMedicine = async (req,res) =>{
  const userId = req.user._id;
  const getData =  await Cart.find({userId});
  try {
    if(!getData)
      return res.status(200).json({});

    const productIds = [...new Set(getData.map(item => item.productId))];
    const medicines = await Promise.all(
      productIds.map(async (id) => {
        const medicine = await Medicine.findById(id);
        return medicine;
      })
    );
    return res.status(200).json(medicines);
  }catch(err) {
    return res.status(403).json({message:"error in fetching cart data..."})
  }
 
}

const removeCartMedicine = async (req, res) => {
  const { id } = req.body; 
  const userId = req.user._id; 

  try {
    const data =  await Cart.find();
    const result = await Cart.deleteOne({productId:id});
    console.log(result)
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }
    res.status(200).json({ message: "Item has been removed from the cart" });
  } catch (err) {
    console.error("Error during removal:");
    res.status(500).json({ message: "Error removing the cart item" });
  }
};

module.exports = {allMedicines,CartMedicine,fetchCartMedicine,removeCartMedicine};