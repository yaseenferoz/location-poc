const mongoose = require('mongoose');

const ServiceStationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String },
    description: { type: String },
});

module.exports = mongoose.model('ServiceStation', ServiceStationSchema);
