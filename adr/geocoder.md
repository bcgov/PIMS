# Data BC Geocoder

## Status

> Accepted

> June 18, 2020

## Context

Presently when submitting new properties or editing existing properties within inventory the only way to set the latitude and longitude values is manually.
Ideally the inventory would use GIS location values that are pulled from Data BC (better source of truth).

Providing a way through the property address to pull valid GIS coordinates from Data BC Geocoder would improve the data and the user experience.

Additionally Geocoder can be used to verify addresses that are manually entered.

- [Geocoder](https://www2.gov.bc.ca/gov/content/data/geographic-data-services/location-services/geocoder)
- [Data BC](https://catalogue.data.gov.bc.ca/dataset/bc-address-geocoder-web-service)
- [API Swagger](https://catalogue.data.gov.bc.ca/dataset/bc-address-geocoder-web-service/resource/40d6411e-ab98-4df9-a24e-67f81c45f6fa/view/1d3c42fc-53dc-4aab-ae3b-f4d056cb00e0)
- [Developer API Keys](https://github.com/bcgov/gwa/wiki/Developer-Guide#developer-api-keys)
- API Host = `https://geocoder.api.gov.bc.ca`

## Decision

Integrate with Data BC Geocoder API.
When a user types an address a list of viable matches will be displayed.
If the user selects one of the matches it will be used to set the address and GIS coordinates,.

## Consequences

Submitting new properties and editing existing properties will be easier and less error prone.

GIS coordinates will be more tightly integrated with a single source of truth, and therefore more consistent and authentic.

Address values can be verified.
