import axios from "axios";

interface Coordinates {
  latitude: number;
  longitude: number;
}

export async function geocodeAddress(
  address: string,
  apiKey: string
): Promise<Coordinates> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;
      return { latitude, longitude };
    } else {
      console.error("Geocoding failed:", data.status);
      throw new Error("Geocoding failed:", data.status);
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    throw new Error("Geocoding failed:");
  }
}