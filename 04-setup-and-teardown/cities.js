let cities;

module.exports = {
  isCity(city) {
    return cities.includes(city);
  },
  initializeCityDatabase() {
    cities = ['Vienna', 'San Juan'];
  },
  clearCityDatabase() {
    cities = [];
  }
}
