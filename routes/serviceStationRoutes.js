const express = require('express');
const router = express.Router();
const ServiceStation = require('../models/ServiceStation');
const haversine = require('haversine');
// Add a new service station
router.post('/', async (req, res) => {
    const { name, latitude, longitude, address, description } = req.body;
    try {
        const newStation = new ServiceStation({
            name,
            latitude,
            longitude,
            address,
            description,
        });
        await newStation.save();
        res.status(201).json(newStation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add service station' });
    }
});

// Get all service stations
router.get('/', async (req, res) => {
    try {
        const stations = await ServiceStation.find();
        res.status(200).json(stations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch service stations' });
    }
});

router.post('/nearest', async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const stations = await ServiceStation.find();
        console.log('Loaded stations:', stations); // Debug log

        if (!stations.length) {
            return res.status(404).json({ error: 'No service stations available.' });
        }

        let nearestStation = null;
        let minDistance = Infinity;

        stations.forEach((station) => {
            const distance = haversine(
                { latitude, longitude },
                { latitude: station.latitude, longitude: station.longitude }
            );
            console.log(`Distance to ${station.name}: ${distance} km`); // Debug log

            if (distance < minDistance) {
                minDistance = distance;
                nearestStation = station;
            }
        });

        if (!nearestStation) {
            return res.status(404).json({ error: 'No service stations found.' });
        }

        res.status(200).json({
            nearestStation,
            distance: `${minDistance.toFixed(2)} km`,
        });
    } catch (error) {
        console.error('Error in /nearest route:', error); // Debug log
        res.status(500).json({ error: 'Error finding the nearest station.' });
    }
});

module.exports = router;
