"use client";

import React, { useEffect, useRef, useState } from "react";
import { lineString } from "@turf/helpers";
import { getCoordinatesDownriver } from "@/utils/riverUtils";
import { geocodeAddress } from "@/utils/getRawLocation";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css'; 

import axios from "axios";

import along from "@turf/along";
import length from "@turf/length";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;
const apiKey = process.env.NEXT_PUBLIC_MAPS_KEY as string;
let attempt=1;

export default function Dashboard() {

  const [item, setItem] = useState("");
  const [materials, setMaterials] = useState("");
  const [recyclable, setRecyclable] = useState("");
  const [loading, setLoading] = useState(false);
  const [newItemsLoading, setNewItemsLoading] = useState(false);
  const [newItems, setNewItems] = useState<String[]>([]);
  const [selectedItem, setSelectedItem] = useState("");

  const handleSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await axios.get(
        `/api/getMaterials${attempt}?item=${selectedItem || item}`
      );
      setMaterials(response.data);
    } catch (error) {
      console.error(error);
      setMaterials("An error occurred :(");
    }

    try {
      const response = await axios.get(`/api/isRecyclable${attempt}?items=${materials}`);
      setRecyclable(response.data);
    } catch (error) {
      console.error(error);
      setMaterials("An error occurred :(");
    }

    setLoading(false);
  };
  const newItemHandler = async () => {
    attempt++;
    switch(attempt){
      case 1: return generateNewItems1(); break;
      case 2: return generateNewItems2(); break;
      case 3: return generateNewItems3(); break;
      case 4: return generateNewItems4(); break;
      case 5: return generateNewItems5(); break;
      default:
        console.log(":(")
    }
  }

  const generateNewItems1 = async () => {
    setNewItemsLoading(true);
    const matArray = materials.split("and");
    const boolStrings = recyclable.toLowerCase().split(" ");
    const isRecyclable = [boolStrings[0] === "true", boolStrings[1] === "true"];

    const newItemsPromises = matArray.map((material, index) => {
      if (isRecyclable[index]) {
        return axios.get(`/api/generateNewItems${attempt}?items=${material}`);
      }
      return Promise.resolve({ data: "" });
    });

    try {
      const responses = await Promise.all(newItemsPromises);
      const newItemsData = responses.map((response) => response.data);
      setNewItems(newItemsData);
    } catch (error) {
      console.error(error);
    }

    setNewItemsLoading(false);
  };
  
  const generateNewItems2 = async () => {
    setNewItemsLoading(true);
    const matArray = materials.split("and");
    const boolStrings = recyclable.toLowerCase().split(" ");
    const isRecyclable = [boolStrings[0] === "true", boolStrings[1] === "true"];

    const newItemsPromises = matArray.map((material, index) => {
      if (isRecyclable[index]) {
        return axios.get(`/api/generateNewItems${attempt}?items=${material}`);
      }
      return Promise.resolve({ data: "" });
    });

    try {
      const responses = await Promise.all(newItemsPromises);
      const newItemsData = responses.map((response) => response.data);
      setNewItems(newItemsData);
    } catch (error) {
      console.error(error);
    }

    setNewItemsLoading(false);
  };

  const generateNewItems3 = async () => {
    setNewItemsLoading(true);
    const matArray = materials.split("and");
    const boolStrings = recyclable.toLowerCase().split(" ");
    const isRecyclable = [boolStrings[0] === "true", boolStrings[1] === "true"];

    const newItemsPromises = matArray.map((material, index) => {
      if (isRecyclable[index]) {
        return axios.get(`/api/generateNewItems${attempt}?items=${material}`);
      }
      return Promise.resolve({ data: "" });
    });

    try {
      const responses = await Promise.all(newItemsPromises);
      const newItemsData = responses.map((response) => response.data);
      setNewItems(newItemsData);
    } catch (error) {
      console.error(error);
    }

    setNewItemsLoading(false);
  };

  const generateNewItems4 = async () => {
    setNewItemsLoading(true);
    const matArray = materials.split("and");
    const boolStrings = recyclable.toLowerCase().split(" ");
    const isRecyclable = [boolStrings[0] === "true", boolStrings[1] === "true"];

    const newItemsPromises = matArray.map((material, index) => {
      if (isRecyclable[index]) {
        return axios.get(`/api/generateNewItems${attempt}?items=${material}`);
      }
      return Promise.resolve({ data: "" });
    });

    try {
      const responses = await Promise.all(newItemsPromises);
      const newItemsData = responses.map((response) => response.data);
      setNewItems(newItemsData);
    } catch (error) {
      console.error(error);
    }

    setNewItemsLoading(false);
  };

  const generateNewItems5 = async () => {
    setNewItemsLoading(true);
    const matArray = materials.split("and");
    const boolStrings = recyclable.toLowerCase().split(" ");
    const isRecyclable = [boolStrings[0] === "true", boolStrings[1] === "true"];

    const newItemsPromises = matArray.map((material, index) => {
      if (isRecyclable[index]) {
        return axios.get(`/api/generateNewItems${attempt}?items=${material}`);
      }
      return Promise.resolve({ data: "" });
    });

    try {
      const responses = await Promise.all(newItemsPromises);
      const newItemsData = responses.map((response) => response.data);
      setNewItems(newItemsData);
    } catch (error) {
      console.error(error);
    }

    setNewItemsLoading(false);
  };

  const handleItemSelect = (item: string) => {
    setSelectedItem(item);
    setNewItems([]);
    setMaterials("");
    setRecyclable("");
    setItem("");
  };

  const mapContainer = useRef(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.328, 40.487],
      zoom: 8,
    });

    map.current.on("click", async (event: mapboxgl.MapMouseEvent) => {

      const { lngLat } = event;
      // let marker : mapboxgl = null;
      // if(marker!=null){
      //   marker.remove();
      // }
      let marker = null;
      if(map.current){
       marker = new mapboxgl.Marker()
        .setLngLat([lngLat.lng, lngLat.lat])
        .addTo(map.current);
      }
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
        map.current?.fitBounds(bounds, { padding: 150 });

        const lineDistance = length(lineFeature).valueOf();  
        const duration = Math.pow(lineDistance,0.85)*7.0
        console.log(lineDistance);
        const numPoints = Math.ceil(500000.0/lineDistance);
        console.log(numPoints);
        const segmentDistance = lineDistance / (numPoints - 1);

        const distances = Array.from(
          { length: numPoints },
          (_, i) => i * segmentDistance
        );

        const interpolatedPoints = distances.map(
          (distance) => along(lineFeature, distance).geometry.coordinates
        );

        const easing = (t: number) =>
          t*(0.75-t);

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
          const progress = (time - start) / duration;

          if (progress > 1){ 
            return marker?.remove();} // animation continued

          const currentIndex = Math.floor(progress * (numPoints - 1));
          const nextIndex = Math.min(currentIndex + 1, numPoints - 1);
          const currentPoint = interpolatedPoints[currentIndex];
          const nextPoint = interpolatedPoints[nextIndex];
          const t =
            (progress - lastUpdateTime) / ((numPoints - 1) * (numPoints - 1));

          const lerpedPoint = [
            currentPoint[0] + (nextPoint[0] - currentPoint[0]) * progress,
            currentPoint[1] + (nextPoint[1] - currentPoint[1]) * progress,
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
        zoom: 8,
      });

      return () => {
        marker.remove();
      };
    }
  }, [selectedLocation]);
  const [color, setColor] = useState("#16a085");
  return(<> 
    <main className="flex justify-between bg-[#EFE9E1]">
    <div className="flex justify-center flex-col items-center m-24 gap-10">

    <div>
    <Card className="w-[350px] text-[#2E4C48] bg-[#D3E7C0] border border-[#2E4C486a]">
    <CardHeader>
      <CardTitle>Generations</CardTitle>
      <CardDescription>some text</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Input id="name" type="text" value={selectedItem || item} onChange={(e) => setItem(e.target.value)} placeholder="Enter an item" />
          </div>
        </div>
        <CardFooter className="flex justify-center mb-0 mt-8 p-0">
      <Button disabled={loading} className="w-full bg-[#2E4C48]"> {loading ? "Loading..." : "Submit"}</Button>
    </CardFooter>          
      </form>
    </CardContent>
    </Card>
    </div>
    <div className="w-full">
<Tabs defaultValue="account" className="w-full">
  <TabsList className="bg-[#D3E7C0] w-full">
    <TabsTrigger value="Recyling" className="w-full">Recyling</TabsTrigger>
    <TabsTrigger value="Landfill" className="w-full">Landfill</TabsTrigger>
  </TabsList>
  <TabsContent value="Recyling">Recyling</TabsContent>
  <TabsContent value="Landfill">Landfill</TabsContent>
</Tabs>  
</div>

{loading ? (
  <p>works</p>
) : (
  materials && (
    <div>
      <h2>Materials:</h2>
      <p>{materials}</p>
      <p>Recyclable:</p>
      <p>{recyclable}</p>
      <button
        onClick={newItemHandler}
        disabled={newItemsLoading}
        className="p bg-white font-semibold text-black rounded"
      >
        {newItemsLoading ? "Generating..." : "Generate New Items"}
      </button>
      {newItems.length > 0 && (
        <div>
          <h2>New Items:</h2>
          {newItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemSelect(item.toString())}
              className="p bg-white font-semibold text-black rounded"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
)}
</div>
      <div ref={mapContainer} style={{ width: "80%", height: "100vh" }}/> 
    </main>
  </>);
}
