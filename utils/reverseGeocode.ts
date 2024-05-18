import axios from "axios";

export async function reverseGeocodeCoordinates(
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<string | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === "OK" && data.results.length > 0) {
      const address = data.results[0].formatted_address;
      return address;
    } else {
      console.error("Reverse geocoding failed:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}
