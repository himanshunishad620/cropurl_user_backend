const path = require("path");
const { Reader } = require("@maxmind/geoip2-node");

async function getCity(ip) {
  const dbPath = path.join(__dirname, "GeoLite2-City.mmdb");
  let city = "";
  try {
    const reader = await Reader.open(dbPath);
    const result = reader.city(ip);
    city = result.city?.names?.en;
  } catch (err) {
    console.error("Maxmind Error:", err.message);
  }
  return city;
}

module.exports = { getCity };
