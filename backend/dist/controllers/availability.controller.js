"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAvailabilityController = createAvailabilityController;
exports.getAvailabilityController = getAvailabilityController;
exports.updateAvailabilityController = updateAvailabilityController;
exports.deleteAvailabilityController = deleteAvailabilityController;
const availability_schema_1 = require("../schemas/availability.schema");
const availability_service_1 = require("../services/availability.service");
async function createAvailabilityController(req, res, next) {
    const result = availability_schema_1.availabilitySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            msg: "Invalid Input",
            errors: result.error,
        });
    }
    const { dayOfWeek, startTime, endTime } = result.data;
    const userId = req.userId;
    try {
        const availability = await (0, availability_service_1.createAvailability)(dayOfWeek, startTime, endTime, userId);
        return res.status(201).json({
            msg: "Availability created successfully",
            availability,
        });
    }
    catch (error) {
        next(error);
    }
}
// GET
async function getAvailabilityController(req, res, next) {
    const userId = req.userId;
    try {
        const availability = await (0, availability_service_1.getAvailability)(userId);
        return res.status(200).json({
            availability,
        });
    }
    catch (error) {
        next(error);
    }
}
// UPDATE
async function updateAvailabilityController(req, res, next) {
    const result = availability_schema_1.availabilitySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            msg: "Invalid Input",
            errors: result.error,
        });
    }
    const availabilityId = Number(req.params.id);
    if (Number.isNaN(availabilityId)) {
        return res.status(400).json({
            msg: "Invalid availability id",
        });
    }
    const { dayOfWeek, startTime, endTime } = result.data;
    const userId = req.userId;
    try {
        const availability = await (0, availability_service_1.updateAvailability)(availabilityId, dayOfWeek, startTime, endTime, userId);
        return res.status(200).json({
            msg: "Availability updated successfully",
            availability,
        });
    }
    catch (error) {
        next(error);
    }
}
// DELETE
async function deleteAvailabilityController(req, res, next) {
    const availabilityId = Number(req.params.id);
    if (Number.isNaN(availabilityId)) {
        return res.status(400).json({
            msg: "Invalid availability id",
        });
    }
    const userId = req.userId;
    try {
        await (0, availability_service_1.deleteAvailability)(availabilityId, userId);
        return res.status(200).json({
            msg: "Availability deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
}
