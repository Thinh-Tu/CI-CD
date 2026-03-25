var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventories');

// Get all inventories
router.get('/', async function (req, res, next) {
    try {
        let result = await inventoryController.GetAllInventories();
        res.send(result);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// Get inventory by ID
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await inventoryController.GetInventoryById(id);
        if (!result) {
            res.status(404).send({
                message: "Inventory ID NOT FOUND"
            });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(404).send({
            message: "ID NOT FOUND"
        });
    }
});

// Add stock
router.post('/add_stock', async function (req, res, next) {
    try {
        let productId = req.body.product;
        let quantity = req.body.quantity;

        if (!productId || !quantity) {
            res.status(400).send({
                message: "product and quantity are required"
            });
            return;
        }

        if (quantity <= 0) {
            res.status(400).send({
                message: "quantity must be greater than 0"
            });
            return;
        }

        let result = await inventoryController.AddStock(productId, quantity);
        res.send(result);
    } catch (error) {
        res.status(500).send({
            message: error.message
        });
    }
});

// Remove stock
router.post('/remove_stock', async function (req, res, next) {
    try {
        let productId = req.body.product;
        let quantity = req.body.quantity;

        if (!productId || !quantity) {
            res.status(400).send({
                message: "product and quantity are required"
            });
            return;
        }

        if (quantity <= 0) {
            res.status(400).send({
                message: "quantity must be greater than 0"
            });
            return;
        }

        let result = await inventoryController.RemoveStock(productId, quantity);
        res.send(result);
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// Reservation
router.post('/reservation', async function (req, res, next) {
    try {
        let productId = req.body.product;
        let quantity = req.body.quantity;

        if (!productId || !quantity) {
            res.status(400).send({
                message: "product and quantity are required"
            });
            return;
        }

        if (quantity <= 0) {
            res.status(400).send({
                message: "quantity must be greater than 0"
            });
            return;
        }

        let result = await inventoryController.Reservation(productId, quantity);
        res.send(result);
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

// Sold
router.post('/sold', async function (req, res, next) {
    try {
        let productId = req.body.product;
        let quantity = req.body.quantity;

        if (!productId || !quantity) {
            res.status(400).send({
                message: "product and quantity are required"
            });
            return;
        }

        if (quantity <= 0) {
            res.status(400).send({
                message: "quantity must be greater than 0"
            });
            return;
        }

        let result = await inventoryController.Sold(productId, quantity);
        res.send(result);
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});

module.exports = router;
