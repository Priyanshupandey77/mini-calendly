"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEventController = createEventController;
exports.getEventsController = getEventsController;
exports.deleteEventController = deleteEventController;
const client_1 = require("@prisma/client");
const events_js_1 = require("../schemas/events.js");
const event_service_js_1 = require("../services/event.service.js");
const AppError_js_1 = require("../errors/AppError.js");
async function createEventController(req, res) {
    const result = events_js_1.createEventSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            msg: "invalid input",
            errors: result.error,
        });
    }
    const { title, description, slug, duration } = result.data;
    const userId = req.userId;
    try {
        const event = await (0, event_service_js_1.createEvent)(title, description, slug, duration, userId);
        return res.status(201).json({
            msg: "event created successfully",
            event,
        });
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
            return res.status(409).json({
                msg: "An event with this slug already exists",
            });
        }
        return res.status(500).json({
            msg: "Internal server error",
        });
    }
}
async function getEventsController(req, res) {
    const userId = req.userId;
    try {
        const events = await (0, event_service_js_1.getEvents)(userId);
        return res.status(200).json(events);
    }
    catch (error) {
        return res.status(500).json({
            msg: "Internal server error",
        });
    }
}
async function deleteEventController(req, res) {
    const eventId = Number(req.params.id);
    const userId = req.userId;
    if (Number.isNaN(eventId)) {
        return res.status(400).json({
            msg: "Invalid event ID",
        });
    }
    try {
        await (0, event_service_js_1.deleteEvent)(userId, eventId);
        return res.status(200).json({
            msg: "Event deleted successfully",
        });
    }
    catch (error) {
        if (error instanceof AppError_js_1.AppError) {
            return res.status(error.statusCode).json({
                msg: error.message,
            });
        }
        return res.status(500).json({
            msg: "Internal server error",
        });
    }
}
