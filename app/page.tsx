"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { lineString } from "@turf/helpers";
import { getCoordinatesDownriver } from "@/utils/riverUtils";
import { geocodeAddress } from "@/utils/getRawLocation";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
const apiKey = process.env.NEXT_PUBLIC_MAPS_KEY as string;

export default function Home() {
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.328, 40.487],
      zoom: 9,
    });

    const fetchData = async () => {
      const address = "11 Jarman Place NJ";

      try {
        const coordinates = await geocodeAddress(address, apiKey);

        if (coordinates) {
          const { latitude, longitude } = coordinates;
          const distance = 9999;

          const result = await getCoordinatesDownriver(
            latitude,
            longitude,
            distance
          );
          const downriverCoordinates = result.downstreamCoordinates;

          const flattenedCoordinates = downriverCoordinates.flat();

          const lineFeature = lineString(flattenedCoordinates);

          map.current?.on("load", () => {
            map.current?.addSource("river", {
              type: "geojson",
              data: lineFeature,
            });

            map.current?.addLayer({
              id: "river",
              type: "line",
              source: "river",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#ff0000",
                "line-width": 5,
              },
            });
          });
        } else {
          console.error("No coordinates found");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
}
