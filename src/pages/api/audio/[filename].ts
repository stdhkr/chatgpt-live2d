import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import os from "os";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { filename },
  } = req;

  if (req.method === "GET") {
    const tmpDir = os.tmpdir();
    const filePath = path.join(tmpDir, filename as string);

    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "audio/x-wav");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(fs.readFileSync(filePath));
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
