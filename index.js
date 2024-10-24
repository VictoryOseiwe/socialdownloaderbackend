import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import allDl from "rahad-media-downloader";
import tiktok from "tiktokdl";
import pkg from "nayan-media-downloader";

const app = express();
const PORT = 8080;

const { ytdown } = pkg;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my all social media video downloader" });
});

app.post("/videoInfo", async (req, res) => {
  const { URL } = req.body;

  try {
    if (URL.includes("facebook.com")) {
      try {
        const videoInfo = await allDl.rahadfbdl(URL);
        const videoDetails = {
          title: videoInfo.data.title,
          description: videoInfo.data.description,
          thumbnail: videoInfo.data.thumbnail,
          duration: videoInfo.data.duration_ms,
          video: videoInfo.data.hd,
        };
        return res.status(200).json(videoDetails);
      } catch (error) {
        res.status(500).json({ error: "Failed to get Facebook video details" });
      }
    } else if (URL.includes("youtube.com") || URL.includes("youtu.be")) {
      try {
        const videoInfo = await ytdown(URL);
        const videoDetails = {
          // duration: videoInfo.info.duration,
          thumbnail: videoInfo.data.thumb,
          title: videoInfo.data.title,
          video: videoInfo.data.video,
        };
        return res.status(200).json(videoDetails);
      } catch (error) {
        res.status(500).json({ error: "Failed to get youtube video details" });
      }
    } else if (URL.includes("tiktok.com")) {
      try {
        // const videoInfo = await tiktok.tiktokdl(URL);
        const videoInfo = await allDl.rahadtikdl(URL);
        const videoDetails = {
          video: videoInfo.data.noWatermarkMp4,
          title: videoInfo.data.title,
          thumbnail: videoInfo.data.cover,
        };
        return res.status(200).json(videoDetails);
      } catch (error) {
        res.status(500).json({ error: "Failed to get tiktok video details" });
      }
    } else if (URL.includes("instagram.com")) {
      try {
        const videoInfo = await allDl.rahadinsta(URL);
        const videoDetails = {
          video: videoInfo.data.video_url,
          thumbnail: videoInfo.data.thumbnail_src,
          title: videoInfo.data.title,
          duration: videoInfo.data.video_duration,
        };
        return res.status(200).json(videoDetails);
      } catch (error) {
        res
          .status(500)
          .json({ error: "failed to get instagram video details" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Invalid URL" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
