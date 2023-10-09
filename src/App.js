import './App.css';
import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [countryInfo, setCountryInfo] = useState(null);

  useEffect(() => {
    // Function to fetch the list of countries
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/countries", {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }

        const data = await response.json();

        // Convert the API response format to an array of objects
        const formattedCountries = data.map((entry) => ({
          name: entry[0],
          code: entry[1],
        }));

        setCountries(formattedCountries); // Update the countries state
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // Function to fetch country information based on selectedCountry
    const fetchCountryInfo = async () => {
      if (selectedCountry) {
        try {
          const response = await fetch(`http://localhost:8080/api/countries/${selectedCountry}`, {
            method: 'GET',
          });

          if (!response.ok) {
            throw new Error('Failed to fetch country information');
          }

          const data = await response.json();
          setCountryInfo(data); // Update the countryInfo state
        } catch (error) {
          console.error('Error fetching country information:', error);
        }
      } else {
        // Reset the countryInfo state if no country is selected
        setCountryInfo(null);
      }
    };

    fetchCountryInfo();
  }, [selectedCountry]);

  const handleCountryChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCountry(selectedValue); // Update the selectedCountry state
    console.log('Selected Country:', selectedValue);
  };

  return (
    <Container className="mt-5 text-center">
      <Row>
        <Col md={{ span: 4, offset: 4 }}>
          <Form.Select aria-label="Default select example" onChange={handleCountryChange}>
            <option>Select a country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={{ span: 4, offset: 4 }}>
          {countryInfo && (
            <div className="text-center">
              <h2>Country Information</h2>
              <p>Name: {countryInfo.name}</p>
              <p>Country Code: {countryInfo.country_code}</p>
              <p>Capital: {countryInfo.capital}</p>
              <p>Population: {countryInfo.population}</p>
              <img src={countryInfo.flag_file_url} alt="Flag" width="100" height="100" />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
