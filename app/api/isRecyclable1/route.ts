import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export async function GET(request: NextRequest) {
  const items = request.nextUrl.searchParams.get("items");
  try {
    const key = process.env.REPLICATE_TOKEN as string;
    const API_URL =
      "https://api.replicate.com/v1/models/meta/meta-llama-3-70b-instruct/predictions";
    const prompt = `Is ${items} recyclable. Since there are two items, provide true and false for both, separated by a space respectively. Do not provide any other words besides the answer. Assume that plastic is non-recyclable.
    `;
    const prompt_template = "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful assistant<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n";

    interface ReplicatePrompt {
      stream: boolean;
      input: {
        prompt: string;
        prompt_template: string;
      };
    }

    interface ReplicateResponse {
      urls: {
        stream: string;
      };
    }

    const data: ReplicatePrompt = {
      stream: false,
      input: {
        prompt,
        prompt_template,
      },
    };
    const replicateResponse = await axios.post(API_URL,data, {headers:{
      Authorization: `Bearer ${process.env.REPLICATE_TOKEN}`},
    });
    const getUrl = replicateResponse.data.urls.get;
    const getOutput = async () => {
      const pollResponse = await axios.get(getUrl, {
        headers: { Authorization: `Bearer ${process.env.REPLICATE_TOKEN}` },
      });

      if (pollResponse.status !== 200) {
        throw new Error(`Request failed: ${pollResponse.status}`);
      }

      const pollData = pollResponse.data;
      if (pollData.status === "succeeded") {
        return pollData.output;
      } else if (
        pollData.status === "failed" ||
        pollData.status === "canceled"
      ) {
        throw new Error(`Prediction failed or canceled: ${pollData.status}`);
      } else {
        return null;
      }
    };

    let output = null;
    while (!output) {
      try {
        output = await getOutput();
      } catch (error) {
        console.error(error);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
    let format: string = output.toString();
    format=format.replace(/,/g,"");
    return new NextResponse(format);
  } catch (error) {
    console.error(error);
    return new NextResponse("An error occurred. :((");
  }
}
