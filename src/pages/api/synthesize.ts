import { NextApiRequest, NextApiResponse } from "next";
import { voiceBox } from "@/utils/voicevox";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const requestBody = req.body.text;
    if (typeof requestBody !== "string") {
      res.status(400).json({ message: "Bad request" });
    }

    const speaker = parseInt(req.query.speaker as string, 10);

    const synthesizedAudio = await voiceBox(requestBody, speaker);

    res.setHeader("Content-Type", "audio/wav");
    res.status(200).send(synthesizedAudio);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
