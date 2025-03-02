import fluentFfmpeg from "fluent-ffmpeg";
import ytdl from "ytdl-core";
import express from "express";
import fs from "fs";
import { randomUUID } from "crypto";
import multer from "multer";

import { MusicPlayerJSONManagerClass } from "./MusicPlayerJSONManagerClass.js";

const MusicPlayerJSONManager = new MusicPlayerJSONManagerClass();

const app = express();
app.use(express.json());

app.get("/", (req, res) => { res.sendFile("index.html"); });
app.get("index.html", (req, res) => { res.sendFile("index.html"); });
app.get("script.js", (req, res) => { res.sendFile("script.js"); });
app.get("style.css", (req, res) => { res.sendFile("style.css"); });

app.post("/uploadFile", multer().any(), async (req, res) => {
    const file = Array.isArray(req.files) ? req.files[0] : null;
    if (!file) { res.status(400).send("No file uploaded"); return; }
    const json: {
        userUUID?: string;
        name?: string;
        importSource?: "other" | "onlineVideoService" | "analogRecording" | "onlineMusicService" | "digitalRecording" | "CD" | "downloadFile" | "original";
        originalURL?: {
            videoId?: string;
            downloadURL?: string;
        };
    } = req.body;
    if (!json.userUUID || !json.name || !json.importSource || !json.originalURL) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.addFile({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        name: json.name,
        importSource: json.importSource,
        originalURL: {
            videoId: json.originalURL.videoId,
            downloadURL: json.originalURL.downloadURL,
        },
        readStream: file.stream,
    });
    if (result) { res.status(200).send(result.name); return; }
    else { res.status(500).send("Failed to add file"); return; }
});
