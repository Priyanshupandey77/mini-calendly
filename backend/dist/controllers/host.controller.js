"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostBookingsController = getHostBookingsController;
const host_service_1 = require("../services/host.service");
async function getHostBookingsController(req, res, next) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({
            msg: "Unauthorized",
        });
    }
    try {
        const bookings = await (0, host_service_1.getHostBookings)(userId);
        return res.status(200).json({
            msg: "Host bookings fetched successfully",
            bookings,
        });
    }
    catch (error) {
        next(error);
    }
}
