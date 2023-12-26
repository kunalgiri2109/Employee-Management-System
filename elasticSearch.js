const { Client } = require('@elastic/elasticsearch');
const ES_HOST = 'https://localhost:9200';
const client = new Client({ node:ES_HOST, auth : {username : "elastic", password : "Hz3C-18pOh3Cvz5cobAP"}
, tls : {rejectUnauthorized : false}})

async function checkConnection() {
    try {
      await client.ping();
      console.log('Connected to Elasticsearch');
    } catch (error) {
      console.error('Error connecting to Elasticsearch:', error);
    }
}

checkConnection();

module.exports = client