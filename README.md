# Property Explorer

https://github.com/user-attachments/assets/7263c420-3c08-4940-b752-088950eb3665

A personal project to explore properties for sale within a given area using 3D map tiles from Google Maps.

The web app is built with React. It uses [Resium](https://resium.reearth.io) ([Cesium](https://cesium.com) for React)
alongside Google Maps 3D tiles for photorealistic mapping of buildings, gardens, trees, etc.

The data for properties are from various online real estate listing sites. They are not covered by the license for this
repo and are used here for personal, non-commercial use only.

## Try the web app

It is hosted at https://craigwalton.github.io/PropertyExplorer/

> [!NOTE]  
> This uses a Google Maps tiles API key which will expire in February 2026 due to billing reasons.

### Features

* Navigate the 3D environment (drag to pan, hold `ctrl` key to orbit) to explore the area.
* Select a property marker to see basic info like price, main photo.
* You can shortlist or reject any property, and write notes.

## Limitations

* Google Maps 3D tiles are not available in all areas. Apple Maps 3D tiles are more widely available, but there is no
  public API to access them.
* The web app is designed for use on a laptop/desktop rather than touch or mobile screens.

## Data

### Properties

Property data are obtained from [ASPC](https://aspc.co.uk), [Rightmove](https://www.rightmove.co.uk/)
and [Zoopla](https://www.zoopla.co.uk/).

The properties are stored in `web-app/public/data/properties.json`. The scripts used to obtain the data are not made
available.

The areas for properties which I selected are generally Cults and Bieldside. Unfortunately, Google Maps does not
currently have 3D tiles further West for Milltimber, Peterculter or Banchory. This web app still supports properties in
2D-only areas, but the UX needs some work (see TODOs).

### School catchment areas

The school catchment areas were obtained
from Aberdeen City Council and Aberdeenshire Council in November 2025. Only the catchment areas of interest were
retained.

| Dataset                         | Source                                                                                               |
|---------------------------------|------------------------------------------------------------------------------------------------------|
| Aberdeen City Primary Schools   | https://spatialdata-accabdn.opendata.arcgis.com/datasets/f606a1b1b5b746aea68955d5d8458e6e_58/explore |
| Aberdeen City Secondary Schools | https://spatialdata-accabdn.opendata.arcgis.com/datasets/c8e7887f4519434b8564a608754002cb_5/explore  |
| Aberdeenshire Primary Schools   | https://opendata.scot/datasets/aberdeenshire+council-school+catchments+-+aberdeenshire/              |
| Aberdeenshire Secondary Schools | https://opendata.scot/datasets/aberdeenshire+council-school+catchments+-+aberdeenshire/              |

The GeoJSON files are stored in `web-app/public/data/*-school-catchments.geojson`.

## Run web app locally (for development)

Create a `web-app/.env` file and add a Google Maps API key. The API key should be restricted to just 3D map tiles.
Consider also restricting which domain requests can come from.

    VITE_GOOGLE_MAPS_API_KEY=

Ensure you have Vite installed:

    npm install -D vite

Then run the web app:

    cd web-app/
    npx vite

and open a browser at the URL shown in your terminal.

## TODO

### Features

* Back button for viewer (with an undo stack).
* Add orbit cursor icon when ctrl held down (to help user figure out which modifier keys do what).
* Add move/orbit/pan buttons next to zoom controls.
* Allow user to override property location coordinates.
* Add 2D/3D toggle (useful for areas without 3D tiles).

### Other

* Consolidate button styles (index.css, Filters.css, Sidebar.css)
* Why do markers/billboards have rendering artifacts when overlapping? This is not an issue when using Cesium without
  Resium.
* Poor UX: Catchment areas interfere with normal panning and double-clicking on them zooms to fit.
