import fluentFfmpeg from "fluent-ffmpeg";
import ytdl from "ytdl-core";
import express from "express";
import fs from "fs";
import { randomUUID } from "crypto";

import { MusicPlayerJSONManagerClass } from "./MusicPlayerJSONManagerClass.js";

const MusicPlayerJSONManager = new MusicPlayerJSONManagerClass();

const app = express();
