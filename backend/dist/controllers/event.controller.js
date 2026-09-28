"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableSlotsController = getAvailableSlotsController;
exports.createEventController = createEventController;
exports.getEventsController = getEventsController;
exports.getPublicEventController = getPublicEventController;
exports.updateEventController = updateEventController;
exports.deleteEventController = deleteEventController;
const events_js_1 = require("../schemas/events.js");
const event_service_js_1 = require("../services/event.service.js");
async function getAvailableSlotsController(req, res, next) {
    const slug = req.params.slug;
    if (typeof slug !== "string") {
        return res.status(400).json({
            msg: "Invalid event slug",
        });
    }
    const date = req.query.date;
    if (typeof date !== "string") {
        return res.status(400).json({
            msg: "Invalid date",
        });
    }
    try {
        const slots = await (0, event_service_js_1.getAvailableSlots)(slug, date);
        return res.status(200).json({
            date,
            slots,
        });
    }
    catch (error) {
        next(error);
    }
}
async function createEventController(req, res, next) {
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
        next(error);
    }
}
async function getEventsController(req, res, next) {
    const userId = req.userId;
    try {
        const events = await (0, event_service_js_1.getEvents)(userId);
        return res.status(200).json(events);
    }
    catch (error) {
        next(error);
    }
}
async function getPublicEventController(req, res, next) {
    const slug = req.params.slug;
    if (typeof slug !== "string") {
        return res.status(400).json({
            msg: "Invalid event slug",
        });
    }
    try {
        const event = await (0, event_service_js_1.getPublicEvent)(slug);
        return res.status(200).json({
            event,
        });
    }
    catch (error) {
        next(error);
    }
}
async function updateEventController(req, res, next) {
    const eventId = Number(req.params.id);
    const userId = req.userId;
    if (Number.isNaN(eventId)) {
        return res.status(400).json({
            msg: "Invalid event ID",
        });
    }
    const result = events_js_1.updateEventSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            msg: "invalid input",
            errors: result.error,
        });
    }
    const { title, description, slug, duration } = result.data;
    try {
        const event = await (0, event_service_js_1.updateEvent)(eventId, userId, title, description, slug, duration);
        return res.status(200).json({
            msg: "Event updated successfully",
            event,
        });
    }
    catch (error) {
        next(error);
    }
}
async function deleteEventController(req, res, next) {
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
        next(error);
    }
}
