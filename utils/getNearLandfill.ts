

export async function nearestRecyclingCenter(address: string){
    const res = await fetch(
        `https://places.googleapis.com/v1/places:searchText`,
        {
          method: "POST",
          body: JSON.stringify({
            textQuery: "landfills near "+address,
            languageCode: "en",
          }),
          headers: {
            "X-Goog-Api-Key": process.env.NEXT_PUBLIC_MAPS_KEY as string,
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,places.id,places.internationalPhoneNumber,places.websiteUri",
            // "Content-Type": "application/json",
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
      if(json.places.length==0){
        throw new Error("No nearby landfills.")
      }
      return JSON.stringify(json.places[0].formattedAddress);
    }