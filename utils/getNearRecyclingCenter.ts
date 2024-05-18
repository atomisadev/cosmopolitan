

export async function nearestRecyclingCenter(){
const res = await fetch(
    `https://places.googleapis.com/v1/places:searchText`,
    {
      method: "POST",
      body: JSON.stringify({
        textQuery: "11 Jarman Place nj",
        languageCode: "en",
      }),
      headers: {
        "X-Goog-Api-Key": process.env.NEXT_PUBLIC_MAPS_KEY,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.id,places.internationalPhoneNumber,places.websiteUri",
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    let message;
    try {
      const json = await res.json();
      message = json.error.message;
    } catch (e) {
      message =
        "Unable to parse error message: Google did not return a JSON response.";
    }
    throw new Error(
      `Got ${res.status}: ${res.statusText} error from Google Places API: ${message}`
    );
  }

  const json = await res.json();

  const results =
    json?.places?.map(
      (place: {
        id?: string;
        internationalPhoneNumber?: string;
        formattedAddress?: string;
        websiteUri?: string;
        displayName?: { text?: string };
      }) => ({
        name: place.displayName?.text,
        id: place.id,
        address: place.formattedAddress,
        phoneNumber: place.internationalPhoneNumber,
        website: place.websiteUri,
      })
    ) ?? [];
  return JSON.stringify(results);
}