"use client";

import React, { useEffect, useRef, useState } from "react";
import { lineString } from "@turf/helpers";
import { getCoordinatesDownriver } from "@/utils/riverUtils";
import { geocodeAddress } from "@/utils/getRawLocation";
import mapboxgl from "mapbox-gl";
import along from "@turf/along";
import length from "@turf/length";
import { SignOutButton, SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
const apiKey = process.env.NEXT_PUBLIC_MAPS_KEY as string;

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);
  const router = useRouter();

  if (!isLoaded || !isSignedIn) {
    router.push("/");
    return;
  }

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.328, 40.487],
      zoom: 9,
    });

    map.current.on("click", async (event: mapboxgl.MapMouseEvent) => {
      const { lngLat } = event;
      setSelectedLocation([lngLat.lng, lngLat.lat]);

      try {
        const distance = 9999;
        const result = await getCoordinatesDownriver(
          lngLat.lat,
          lngLat.lng,
          distance
        );
        const downriverCoordinates = result.downstreamCoordinates;
        const flattenedCoordinates = downriverCoordinates.flat();
        const lineFeature = lineString(flattenedCoordinates);

        if (map.current?.getSource("river")) {
          (map.current?.getSource("river") as mapboxgl.GeoJSONSource).setData(
            lineFeature
          );
        } else {
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
        }

        const bounds = new mapboxgl.LngLatBounds();
        flattenedCoordinates.forEach((coord: any) => {
          bounds.extend(coord as [number, number]);
        });
        // map.current?.fitBounds(bounds, { padding: 150 });

        const lineDistance = length(lineFeature).valueOf();  
        const duration = Math.pow(lineDistance,0.85)*7.0
        const numPoints = Math.floor(lineDistance*0.3);
        const segmentDistance = lineDistance / (numPoints - 1);

        const distances = Array.from(
          { length: numPoints },
          (_, i) => i * segmentDistance
        );

        const interpolatedPoints = distances.map(
          (distance) => along(lineFeature, distance).geometry.coordinates
        );

        const easing = (t: number) =>
          t*(1-t);

        let start: number | null = null;
        let pointIndex = 0;
        let lastUpdateTime = 0;
        const throttleInterval = 10;

        const frame = (time: number) => {
          if (time - lastUpdateTime < throttleInterval) {
            window.requestAnimationFrame(frame);
            return;
          }
          lastUpdateTime = time;

          if (!start) start = time;
          const progress = (time - lastUpdateTime) / duration;

          if (progress > 1){ 
            return;} // animation continued

          const currentIndex = Math.floor(progress * (numPoints - 1));
          const nextIndex = Math.min(currentIndex + 1, numPoints - 1);
          console.log("current "+currentIndex);
          console.log("next "+nextIndex);
          const currentPoint = interpolatedPoints[currentIndex];
          const nextPoint = interpolatedPoints[nextIndex];
          const t =
            (progress - currentIndex) / ((numPoints - 1) * (numPoints - 1));

          const lerpedPoint = [
            currentPoint[0] + (nextPoint[0] - currentPoint[0]) * t,
            currentPoint[1] + (nextPoint[1] - currentPoint[1]) * t,
          ];

          if (lerpedPoint.length === 2) {
            map.current?.flyTo({
              center: lerpedPoint as [number, number],
              easing: easing,
            });
          } else {
            console.error(
              "Invalid coordinates for camera center:",
              lerpedPoint
            );
          }

          window.requestAnimationFrame(frame);
        };
        
    
        window.requestAnimationFrame(frame);
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedLocation && map.current) {
      const marker = new mapboxgl.Marker()
        .setLngLat(selectedLocation)
        .addTo(map.current);

      map.current.flyTo({
        center: selectedLocation,
        zoom: 9,
      });

      return () => {
        marker.remove();
      };
    }
  }, [selectedLocation]);

  return (
    <div>
      <div className="flex justify-between items-center p-5">
        <h1>Cosmopolitan</h1>
        <SignOutButton>
          <button className="font-medium bg-red-700 hover:bg-red-500 transition ease-in duration-100 rounded-lg py-2 px-4">
            Log out
          </button>
        </SignOutButton>
      </div>
      <div ref={mapContainer} style={{ width: "100%", height: "92vh" }} />
    </div>
  );
}
