import axios from "axios";

interface HomeData {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export const fetchRandomHome = async (
  latitude: number,
  longitude: number,
  radius: number,
  apiKey: string
): Promise<HomeData | null> => {
  try {
    const response = await axios.get<{ results: HomeData[] }>(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=home&key=${apiKey}`
    );

    const homes = response.data.results;

    if (homes.length > 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * homes.length);
    const randomHome = homes[randomIndex];

    return randomHome;
  } catch (error) {
    console.error("Error fetching random home:", error);
    return null;
  }
};
