import locations from './../utils/locations.json';

export const getCountriesAndStates = async () => {
  return locations;
};

export const getCountryByNumericCode = (code: string): any => {
  return locations.find(country => country.numericCode === parseInt(code) );
};
