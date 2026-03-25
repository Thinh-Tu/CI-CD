let inventoryModel = require('../schemas/inventories');

module.exports = {
    CreateInventory: async function (productId) {
        let newInventory = new inventoryModel({
            product: productId,
            stock: 0,
            reserved: 0,
            soldCount: 0
        });
        await newInventory.save();
        return newInventory;
    },

    GetAllInventories: async function () {
        return await inventoryModel.find({
            isDeleted: false
        }).populate({
            path: 'product',
            select: 'title price category'
        });
    },

    GetInventoryById: async function (id) {
        return await inventoryModel.findOne({
            isDeleted: false,
            _id: id
        }).populate({
            path: 'product',
            select: 'title price category'
        });
    },

    GetInventoryByProductId: async function (productId) {
        return await inventoryModel.findOne({
            isDeleted: false,
            product: productId
        }).populate({
            path: 'product',
            select: 'title price category'
        });
    },

    AddStock: async function (productId, quantity) {
        return await inventoryModel.findOneAndUpdate(
            { product: productId, isDeleted: false },
            { $inc: { stock: quantity } },
            { new: true }
        ).populate({
            path: 'product',
            select: 'title price category'
        });
    },

    RemoveStock: async function (productId, quantity) {
        let inventory = await inventoryModel.findOne({
            product: productId,
            isDeleted: false
        });

        if (!inventory) {
            throw new Error('Inventory not found');
        }

        if (inventory.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        return await inventoryModel.findOneAndUpdate(
            { product: productId, isDeleted: false },
            { $inc: { stock: -quantity } },
            { new: true }
        ).populate({
            path: 'product',
            select: 'title price category'
        });
    },

    Reservation: async function (productId, quantity) {
        let inventory = await inventoryModel.findOne({
            product: productId,
            isDeleted: false
        });

        if (!inventory) {
            throw new Error('Inventory not found');
        }

        if (inventory.stock < quantity) {
            throw new Error('Insufficient stock for reservation');
        }

        return await inventoryModel.findOneAndUpdate(
            { product: productId, isDeleted: false },
            { 
                $inc: { 
                    stock: -quantity,
                    reserved: quantity
                }
            },
            { new: true }
        ).populate({
            path: 'product',
            select: 'title price category'
        });
    },

    Sold: async function (productId, quantity) {
        let inventory = await inventoryModel.findOne({
            product: productId,
            isDeleted: false
        });

        if (!inventory) {
            throw new Error('Inventory not found');
        }

        if (inventory.reserved < quantity) {
            throw new Error('Insufficient reserved quantity for sale');
        }

        return await inventoryModel.findOneAndUpdate(
            { product: productId, isDeleted: false },
            { 
                $inc: { 
                    reserved: -quantity,
                    soldCount: quantity
                }
            },
            { new: true }
        ).populate({
            path: 'product',
            select: 'title price category'
        });
    }
};
