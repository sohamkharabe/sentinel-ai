/* eslint-disable */

const fs = require("fs");
const path = require("path");
const topojson = require("topojson-client");

/* -------------------------------------------------
   Input / output paths
------------------------------------------------- */

const inputPath = path.join(
  process.env.USERPROFILE,
  "Downloads",
  "india-districts-2019-734.json"
);

const outputPath = path.join(
  process.cwd(),
  "public",
  "geo",
  "districts-ne.geojson"
);

/* -------------------------------------------------
   Read TopoJSON
------------------------------------------------- */

const topo = JSON.parse(
  fs.readFileSync(inputPath, "utf8")
);

const objectName =
  "india-districts-2019-734";

const geojson = topojson.feature(
  topo,
  topo.objects[objectName]
);

/* -------------------------------------------------
   Northeast states
------------------------------------------------- */

const northeastStates = new Set([
  "Assam",
  "Arunachal Pradesh",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Tripura",
  "Sikkim",
]);

/* -------------------------------------------------
   Filter districts
------------------------------------------------- */

const northeastDistricts =
  geojson.features.filter((feature) => {
    const state =
      feature.properties?.st_nm;

    return northeastStates.has(state);
  });

/* -------------------------------------------------
   Build final FeatureCollection
------------------------------------------------- */

const output = {
  type: "FeatureCollection",
  features: northeastDistricts,
};

/* -------------------------------------------------
   Ensure output directory exists
------------------------------------------------- */

fs.mkdirSync(
  path.dirname(outputPath),
  { recursive: true }
);

/* -------------------------------------------------
   Write GeoJSON
------------------------------------------------- */

fs.writeFileSync(
  outputPath,
  JSON.stringify(output)
);

console.log(
  `Created districts-ne.geojson with ${northeastDistricts.length} districts.`
);