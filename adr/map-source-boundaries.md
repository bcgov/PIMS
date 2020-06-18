# GIS Parcel Boundary Map Source

## Status

> Accepted

> May 1, 2020

## Context

To improve usability of the map it is required that we include the parcel boundaries as a default layer.
Data BC currently provides mapping layers (which includes parcel boundaries).

- [openmaps.gov.bc.ca](https://www2.gov.bc.ca/gov/content/data/geographic-data-services/web-based-mapping/map-services)

## Decision

Add the **Data BC** openmaps parcel boundaries layer to the default map.

## Consequences

Adding additional layers to the map will increase the amount of data that needs to be requested and displayed.
This will make the user experience slower, but will improve the view of property information (boundaries).
