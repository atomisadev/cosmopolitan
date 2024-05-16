import axios from "axios";

export const findClosestFeature = async (lat: number, lng: number) => {
  let resultFound = false;
  let roundingDigits = 6;
  let data;

  while (resultFound === false && roundingDigits >= 0) {
    roundingDigits -= 1;

    try {
      const closestFeatureURL = `https://labs.waterdata.usgs.gov/api/nldi/linked-data/comid/position?coords=POINT%28${lng.toFixed(
        roundingDigits
      )}%20${lat.toFixed(roundingDigits)}%29`;
      const response = await axios.get(closestFeatureURL);
      data = response.data;

      resultFound = true;
    } catch (error) {
      console.log(
        `Error while rounding coordinates to ${roundingDigits} digits. Trying again with less precise coordinates.`
      );
    }
  }

  return data;
};

export const getDownstreamCoordinates = async (
  closestFeature: any,
  distance: number
) => {
  const navigationURL = closestFeature.features[0].properties.navigation;
  const response = await axios.get(
    `${navigationURL}/DM/flowlines?f=json&distance=${distance}`
  );
  const data = response.data;
  const coordinates = data.features.map(
    (feature: any) => feature.geometry.coordinates
  );
  return coordinates;
};

export const getCoordinatesDownriver = async (
  lat: number,
  lng: number,
  distance: number
) => {
  const closestFeatureData = await findClosestFeature(lat, lng);
  const closestFeature = closestFeatureData.features[0];
  const downstreamCoordinates = await getDownstreamCoordinates(
    closestFeatureData,
    distance
  );

  return {
    closestFeature,
    downstreamCoordinates,
  };
};
