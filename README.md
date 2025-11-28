# Property Explorer

A personal project to explore properties for sale within a given area using 3D map tiles from Google Maps.

The web app is built with React. It uses [Resium](https://resium.reearth.io) ([Cesium](https://cesium.com) for React)
alongside Google Maps 3D tiles for photorealistic mapping of buildings, gardens, trees, etc.

The data for properties are from various online real estate listing sites. They are not covered by the license for this
repo and are used here for personal, non-commercial use only.

## Run

Add a Google Maps API key to a .env file in the root of this repo. The API key should be restricted to just 3D map
tiles. Consider also restricting which domain requests can come from.

    VITE_GOOGLE_MAPS_API_KEY=

Ensure you have Vite installed:

    npm install -D vite

Then run the web app:

    npx vite

and open a browser at the URL shown in your terminal.

## Limitations

* Google Maps 3D tiles are not available in all areas. Apple Maps 3D tiles are more widely available, but there is no
  public API to access them.

## Data

The areas I selected are generally Cults and Bieldside. Unfortunately, Google Maps does not have 3D tiles further West
for Milltimber, Peterculter or Banchory. This web app still supports properties in 2D-only areas, but the UX needs some
work (see TODOs).

The data are in `public/data/properties.json`. The scripts used to obtain the data are not made available.

## TODO:

### Features

* Back button for viewer (with an undo stack).
* Add orbit cursor icon when ctrl held down (to help user figure out which modifier keys do what).
* Add move/orbit/pan buttons next to zoom controls.
* Show number of properties for each filter (maybe on hover).
* Allow user to override property location coordinates.
* Add setting to not "fly to" a property when selected.
* Add 2D/3D toggle (useful for areas without 3D tiles).
* Overlay school catchment areas.

### Other

* Consolidate button styles (index.css, Filters.css, Sidebar.css)
* Why do markers/billboards have rendering artifacts when overlapping? This is not an issue when using Cesium without
  Resium.
* Can we make markers load more quickly (no need to wait until all tiles are loaded)?
