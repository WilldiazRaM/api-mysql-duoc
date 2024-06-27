const Wishlist = require('../models/wishlistModel');

exports.createWishlist = async (req, res) => {
    try {
        const newWishlist = await Wishlist.createWishlist(req.body);
        res.status(201).json({ message: 'Producto agregado a la wishlist correctamente', wishlist: newWishlist });
    } catch (err) {
        console.error("Error creating wishlist:", err.message);
        res.status(400).json({ error: err.message });
    }
};

exports.getAllWishlists = async (req, res) => {
    try {
        const wishlists = await Wishlist.getAllWishlists();
        res.json(wishlists);
    } catch (err) {
        console.error("Error fetching wishlists:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getWishlistById = async (req, res) => {
    try {
        const wishlist = await Wishlist.getWishlistById(req.params.id);
        if (!wishlist) {
            return res.status(404).json({ error: "Wishlist no encontrada" });
        }
        res.json(wishlist);
    } catch (err) {
        console.error("Error fetching wishlist:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateWishlist = async (req, res) => {
    try {
        const updatedWishlist = await Wishlist.updateWishlist(req.params.id, req.body);
        if (!updatedWishlist) {
            return res.status(404).json({ error: "Wishlist no encontrada" });
        }
        res.json({ message: 'Wishlist actualizada correctamente', wishlist: updatedWishlist });
    } catch (err) {
        console.error("Error updating wishlist:", err.message);
        res.status(400).json({ error: err.message });
    }
};

exports.deleteWishlist = async (req, res) => {
    try {
        const deletedWishlist = await Wishlist.deleteWishlist(req.params.id);
        if (!deletedWishlist) {
            return res.status(404).json({ error: "Wishlist no encontrada" });
        }
        res.status(200).json({ message: 'Wishlist eliminada correctamente' });
    } catch (err) {
        console.error("Error deleting wishlist:", err.message);
        res.status(500).json({ error: err.message });
    }
};
