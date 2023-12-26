
const express = require('express');
const router = express.Router();
const elastic = require('../elasticSearch');

router.get('/_search', async (req, res) => {
    try {
        
        const results = await rangeQuery(req.query);
        res.json({ results });
    }
    catch (error) {
      console.error('Error performing Elasticsearch query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

async function rangeQuery(req) {
    const rangeFilter = {};
    const { fullname, email, latitude, longitude, distance } = req;

        const body = {
            query: {
                bool: {
                    must: [],
                },
            },
            _source: ["id", "fullname", "email", "address", "contact", "dateOfBirth", "address", "isPermanent", "skills", "location", "department", "distance"],
        };
        if (fullname) {
            body.query.bool.must.push({ match: { fullname: fullname } });
        }
        if (email) {
            body.query.bool.must.push({ term: { email } });
        }

        if (latitude && longitude && distance) {
            body.query.bool.must.push({
                geo_distance: {
                    distance: `${distance}km`,
                    location: {
                        lat: parseFloat(latitude),
                        lon: parseFloat(longitude),
                    },
                },
            });
        }
    
    Object.entries(req).forEach(([field, filter]) => {
        const [operator, value] = filter.split(':');
        switch (operator) {
            case 'gte':
                rangeFilter[field] = { gte: value };
                break;
            case 'lte':
                rangeFilter[field] = { lte: value };
                break;
            case 'eq':
                body.query.bool.must.push({
                    match: {
                        [field]: value,
                    },
                });
                break;
        }
    });
    if (Object.keys(rangeFilter).length > 0) {
        body.query.bool.must.push({ range: rangeFilter });
    }
    const response = await elastic.search({
        index: 'employees',
        body: body,
    });
    const results = response.hits.hits.map((ele) => {
        return ele._source;
    });
    return results;
}

module.exports = router
