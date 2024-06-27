const Review = require('../models/reviewModel');

exports.createReview = async (req, res) => {
    try {
        const newReview = await Review.createReview(req.body);
        res.status(201).json({ message: 'Review agregada correctamente', review: newReview });
    } catch (err) {
        console.error("Error creating review:", err.message);
        res.status(400).json({ error: err.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.getAllReviews();
        res.json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.getReviewById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: "Review no encontrada" });
        }
        res.json(review);
    } catch (err) {
        console.error("Error fetching review:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const updatedReview = await Review.updateReview(req.params.id, req.body);
        if (!updatedReview) {
            return res.status(404).json({ error: "Review no encontrada" });
        }
        res.json({ message: 'Review actualizada correctamente', review: updatedReview });
    } catch (err) {
        console.error("Error updating review:", err.message);
        res.status(400).json({ error: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.deleteReview(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ error: "Review no encontrada" });
        }
        res.status(200).json({ message: 'Review eliminada correctamente' });
    } catch (err) {
        console.error("Error deleting review:", err.message);
        res.status(500).json({ error: err.message });
    }
};
