const path = require("path");
const { Reader } = require("@maxmind/geoip2-node");

async function getCity(ip) {
  const dbPath = path.join(__dirname, "GeoLite2-City.mmdb");

  const reader = await Reader.open(dbPath);

  const result = reader.city(ip);

  console.log(result.city?.names?.en);
}

module.exports = { getCity };
