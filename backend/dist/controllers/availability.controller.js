"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAvailabilityController = createAvailabilityController;
const availability_schema_1 = require("../schemas/availability.schema");
const availability_service_1 = require("../services/availability.service");
async function createAvailabilityController(req, res) {
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
        if (error instanceof Error) {
            return res.status(400).json({
                msg: error.message,
            });
        }
        return res.status(500).json({
            msg: "Internal server error",
        });
    }
}
