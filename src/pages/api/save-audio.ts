import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import os from "os";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { url } from "@/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text } = req.body;
  const speaker = parseInt(req.query.speaker as string, 10);

  // synthesize APIを呼び出して音声データを取得
  const response = await axios.post(
    `${url}/api/synthesize`,
    { text },
    {
      params: {
        speaker,
      },
      responseType: "arraybuffer",
    }
  );

  // 音声データを一時ファイルに保存
  const audioBlob = new Blob([response.data], { type: "audio/x-wav" });
  const fileName = `${uuidv4()}.wav`;
  const tmpDir = os.tmpdir();
  const filePath = path.join(tmpDir, fileName);
  fs.writeFileSync(filePath, Buffer.from(await audioBlob.arrayBuffer()));

  // 一時ファイル名をレスポンスとして返す
  res.status(200).json({ fileName });
}
