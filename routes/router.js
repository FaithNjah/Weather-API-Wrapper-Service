const express = require('express');
const axios = require('axios');
const redisClient = require('../redis');
const router = express.Router();

router.get('/:cityName', async (req, res) => {
    try {
        const cityName = req.params.cityName.toLowerCase();
        
        // Step 1: Check cache first
        const cachedWeather = await redisClient.get(cityName);
        
        if (cachedWeather) {
            console.log(`Cache HIT for ${cityName}`);
            
            
            const cachedData = JSON.parse(cachedWeather);
            cachedData.cached = true;
            cachedData.source = 'cache';
            return res.json(cachedData);
        }
        
        console.log(`Cache MISS for ${cityName} - calling API`);
        
        // Step 2: Call weather API
        const apiKey = process.env.WEATHER_API_KEY;
        const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}?key=${apiKey}`;
        
        const response = await axios.get(weatherUrl);
        
        
        const weatherData = {
            city: cityName,
            temperature: response.data.currentConditions.temp,
            condition: response.data.currentConditions.conditions,
            description: response.data.description,
            cached: false,
            source: 'api' 
        };
        
        // Step 3: Store in cache
        await redisClient.setEx(cityName, 43200, JSON.stringify(weatherData));
        
        res.json(weatherData);
        
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch weather data' });
    }
});

module.exports = router;























