"use client";

import { useState } from "react";
import axios from "axios";

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


export default function Generation() {
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
        `/api/getMaterials?item=${selectedItem || item}`
      );
      setMaterials(response.data);
    } catch (error) {
      console.error(error);
      setMaterials("An error occurred :(");
    }

    try {
      const response = await axios.get(`/api/isRecyclable?items=${materials}`);
      setRecyclable(response.data);
    } catch (error) {
      console.error(error);
      setMaterials("An error occurred :(");
    }

    setLoading(false);
  };

  const generateNewItems = async () => {
    setNewItemsLoading(true);
    const matArray = materials.split("and");
    const boolStrings = recyclable.toLowerCase().split(" ");
    const isRecyclable = [boolStrings[0] === "true", boolStrings[1] === "true"];

    const newItemsPromises = matArray.map((material, index) => {
      if (isRecyclable[index]) {
        return axios.get(`/api/generateNewItems?items=${material}`);
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

  return (
    <div className="flex justify-center items-center m-24">

      <Card className="w-[350px]">
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
          <CardFooter className="flex justify-center mb-0 mt-6">
        <Button disabled={loading} className="w-full"> {loading ? "Loading..." : "Submit"}</Button>
      </CardFooter>          
        </form>
      </CardContent>
    </Card>

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
              onClick={generateNewItems}
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
  );
}
