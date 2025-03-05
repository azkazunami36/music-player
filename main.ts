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

// ファイルアップロード受付
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

// アルバム作成 - createAlbum
app.post("/createAlbum", async (req, res) => {
    const json: {
        userUUID?: string;
        lang?: string;
        title?: string;
    } = req.body;
    if (!json.userUUID || !json.lang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.createAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        title: json.title,
        lang: json.lang,
    });
    if (result) { res.status(200).send(result.uuid); return; }
    else { res.status(500).send("Failed to create album"); return; }
});
// アルバム削除 - deleteAlbum
app.post("/deleteAlbum", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.deleteAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID),
    });
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete album"); return; }
});

// アーティスト作成 - createArtist
app.post("/createArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        lang?: string;
        name?: string;
    } = req.body;
    if (!json.userUUID || !json.lang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.createArtist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        name: json.name,
        lang: json.lang,
    });
    if (result) { res.status(200).send(result.uuid); return; }
    else { res.status(500).send("Failed to create artist"); return; }
});
// アーティスト削除 - deleteArtist
app.post("/deleteArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        artistUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.artistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.deleteArtist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        artistUUID: MusicPlayerJSONManager.CreateType.artist(json.artistUUID),
    });
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete artist"); return; }
});

// ミュージック作成 - createMusic
app.post("/createMusic", async (req, res) => {
    const json: {
        userUUID?: string;
        lang?: string;
        title?: string;
    } = req.body;
    if (!json.userUUID || !json.lang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.createMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        title: json.title,
        lang: json.lang,
    });
    if (result) { res.status(200).send(result.uuid); return; }
    else { res.status(500).send("Failed to create music"); return; }
});
// ミュージック削除 - deleteMusic
app.post("/deleteMusic", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.deleteMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID),
    });
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete music"); return; }
});

// プレイリスト作成 - createPlaylist
app.post("/createPlaylist", async (req, res) => {
    const json: {
        userUUID?: string;
        name?: string;
    } = req.body;
    if (!json.userUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.createPlaylist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        name: json.name,
    });
    if (result) { res.status(200).send(result.uuid); return; }
    else { res.status(500).send("Failed to create playlist"); return; }
});
// プレイリスト削除 - deletePlaylist
app.post("/deletePlaylist", async (req, res) => {
    const json: {
        userUUID?: string;
        playlistUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.playlistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.deletePlaylist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        playlistUUID: MusicPlayerJSONManager.CreateType.playlist(json.playlistUUID),
    });
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete playlist"); return; }
});

// アルバムのタイトル編集 - setTitle
app.post("/editAlbumTitle", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        title?: string;
        lang?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.title || !json.lang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).setTitle(json.title, json.lang);
    if (result) { res.status(200).send("Edited"); return; }
    else { res.status(500).send("Failed to edit album title"); return; }
});
// アルバムのタイトル削除 - removeTitle
app.post("/deleteAlbumTitle", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        lang?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.lang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).removeTitle(json.lang);
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete album title"); return; }
});

// アルバムのアーティスト追加 - addArtist
app.post("/addAlbumArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        artistUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.artistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).addArtist(MusicPlayerJSONManager.CreateType.artist(json.artistUUID));
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add album artist"); return; }
});
// アルバムのアーティスト削除 - removeArtist
app.post("/removeAlbumArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        artistUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.artistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).removeArtist(MusicPlayerJSONManager.CreateType.artist(json.artistUUID));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove album artist"); return; }
});

// アルバムのミュージック追加 - addMusic
app.post("/addAlbumMusic", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        musicUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.musicUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).addMusic(MusicPlayerJSONManager.CreateType.music(json.musicUUID));
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add album music"); return; }
});
// アルバムのミュージック削除 - removeMusic
app.post("/removeAlbumMusic", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        musicUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.musicUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).removeMusic(MusicPlayerJSONManager.CreateType.music(json.musicUUID));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove album music"); return; }
});

// アルバムのアートワーク追加 - addAlbumArtwork
app.post("/addAlbumArtwork", multer().any(), async (req, res) => {
    const file = Array.isArray(req.files) ? req.files[0] : null;
    if (!file) { res.status(400).send("No file uploaded"); return; }
    const json: {
        userUUID?: string;
        albumUUID?: string;
        lang?: string;
        file?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.lang || !json.file) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).addAlbumArtwork(MusicPlayerJSONManager.CreateType.artwork({
        lang: json.lang,
        file: json.file,
    }));
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add album artwork"); return; }
});
// アルバムのアートワーク削除 - removeAlbumArtwork
app.post("/removeAlbumArtwork", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        lang?: string;
        file?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.lang || !json.file) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).removeAlbumArtwork(MusicPlayerJSONManager.CreateType.artwork({
        lang: json.lang,
        file: json.file,
    }));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove album artwork"); return; }
});

// アルバムのジャンル追加 - addGenre
app.post("/addAlbumGenre", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        genre?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.genre) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).addGenre(json.genre);
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add album genre"); return; }
});
// アルバムのジャンル削除 - removeGenre
app.post("/removeAlbumGenre", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        genre?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.genre) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).removeGenre(json.genre);
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove album genre"); return; }
});
// アルバムのジャンル設定 - setGenre
app.post("/setAlbumGenre", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        genre?: string[];
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.genre) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).setGenre(json.genre);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set album genre"); return; }
});

// アルバムの読み仮名設定 - setTitleReadChar
app.post("/setAlbumTitleReadChar", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        lang?: string;
        char?: string;
        charLang?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.lang || !json.char || !json.charLang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).setTitleReadChar(json.lang, json.char, json.charLang);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set album title read character"); return; }
});
// アルバムの読み仮名削除 - deleteTitleReadChar
app.post("/deleteAlbumTitleReadChar", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        lang?: string;
        charLang?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.lang || !json.charLang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).deleteTitleReadChar(json.lang, json.charLang);
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete album title read character"); return; }
});

// アルバムのfeat.アーティスト追加 - addFeaturingArtist
app.post("/addAlbumFeaturingArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        artistUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.artistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).addFeaturingArtist(MusicPlayerJSONManager.CreateType.artist(json.artistUUID));
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add album featuring artist"); return; }
});
// アルバムのfeat.アーティスト削除 - removeFeaturingArtist
app.post("/removeAlbumFeaturingArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        artistUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.artistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).removeFeaturingArtist(MusicPlayerJSONManager.CreateType.artist(json.artistUUID));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove album featuring artist"); return; }
});
// アルバムのfeat.アーティスト設定 - setFeaturingArtist
app.post("/setAlbumFeaturingArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        artistUUID?: string[];
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.artistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).setFeaturingArtist(json.artistUUID.map(artistUUID => MusicPlayerJSONManager.CreateType.artist(artistUUID)));
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set album featuring artist"); return; }
});

// アルバムのリミックス元アルバム設定 - setRemixAlbum
app.post("/setAlbumRemixAlbum", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        remixAlbumUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.remixAlbumUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).setRemixAlbum(MusicPlayerJSONManager.CreateType.album(json.remixAlbumUUID));
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set album remix album"); return; }
});
// アルバムのリミックス元アルバム削除 - deleteRemixAlbum
app.post("/deleteAlbumRemixAlbum", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).deleteRemixAlbum();
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete album remix album"); return; }
});

// アルバムのカバー元アルバム設定 - setCoverAlbum
app.post("/setAlbumCoverAlbum", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
        coverAlbumUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID || !json.coverAlbumUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).setCoverAlbum(MusicPlayerJSONManager.CreateType.album(json.coverAlbumUUID));
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set album cover album"); return; }
});
// アルバムのカバー元アルバム削除 - deleteCoverAlbum
app.post("/deleteAlbumCoverAlbum", async (req, res) => {
    const json: {
        userUUID?: string;
        albumUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.albumUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editAlbum({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        albumUUID: MusicPlayerJSONManager.CreateType.album(json.albumUUID)
    }).deleteCoverAlbum();
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete album cover album"); return; }
});

// アーティストの名前設定 - setName
app.post("/setArtistName", async (req, res) => {
    const json: {
        userUUID?: string;
        artistUUID?: string;
        name?: string;
        lang?: string;
    } = req.body;
    if (!json.userUUID || !json.artistUUID || !json.name || !json.lang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editArtist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        artistUUID: MusicPlayerJSONManager.CreateType.artist(json.artistUUID)
    }).setName(json.name, json.lang);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set artist name"); return; }
});
// アーティストの名前削除 - removeName
app.post("/deleteArtistName", async (req, res) => {
    const json: {
        userUUID?: string;
        artistUUID?: string;
        lang?: string;
    } = req.body;
    if (!json.userUUID || !json.artistUUID || !json.lang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editArtist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        artistUUID: MusicPlayerJSONManager.CreateType.artist(json.artistUUID)
    }).removeName(json.lang);
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete artist name"); return; }
});

// アーティストのキャラクターボイス追加 - addCharacterVoice
app.post("/addArtistCharacterVoice", multer().any(), async (req, res) => {
    const file = Array.isArray(req.files) ? req.files[0] : null;
    if (!file) { res.status(400).send("No file uploaded"); return; }
    const json: {
        userUUID?: string;
        artistUUID?: string;
        characterVoiceArtistUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.artistUUID || !json.characterVoiceArtistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editArtist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        artistUUID: MusicPlayerJSONManager.CreateType.artist(json.artistUUID)
    }).addCharacterVoice(MusicPlayerJSONManager.CreateType.artist(json.characterVoiceArtistUUID));
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add artist character voice"); return; }
});
// アーティストのキャラクターボイス削除 - removeCharacterVoice
app.post("/removeArtistCharacterVoice", async (req, res) => {
    const json: {
        userUUID?: string;
        artistUUID?: string;
        characterVoiceArtistUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.artistUUID || !json.characterVoiceArtistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editArtist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        artistUUID: MusicPlayerJSONManager.CreateType.artist(json.artistUUID)
    }).removeCharacterVoice(MusicPlayerJSONManager.CreateType.artist(json.characterVoiceArtistUUID));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove artist character voice"); return; }
});

// アーティストのアートワーク追加 - addArtistArtwork
app.post("/addArtistArtwork", multer().any(), async (req, res) => {
    const file = Array.isArray(req.files) ? req.files[0] : null;
    if (!file) { res.status(400).send("No file uploaded"); return; }
    const json: {
        userUUID?: string;
        artistUUID?: string;
        lang?: string;
        file?: string;
    } = req.body;
    if (!json.userUUID || !json.artistUUID || !json.lang || !json.file) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editArtist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        artistUUID: MusicPlayerJSONManager.CreateType.artist(json.artistUUID)
    }).addArtistArtwork(MusicPlayerJSONManager.CreateType.artwork({
        lang: json.lang,
        file: json.file,
    }));
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add artist artwork"); return; }
});
// アーティストのアートワーク削除 - removeArtistArtwork
app.post("/removeArtistArtwork", async (req, res) => {
    const json: {
        userUUID?: string;
        artistUUID?: string;
        lang?: string;
        file?: string;
    } = req.body;
    if (!json.userUUID || !json.artistUUID || !json.lang || !json.file) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editArtist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        artistUUID: MusicPlayerJSONManager.CreateType.artist(json.artistUUID)
    }).removeArtistArtwork(MusicPlayerJSONManager.CreateType.artwork({
        lang: json.lang,
        file: json.file,
    }));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove artist artwork"); return; }
});

// アーティストの読み仮名設定 - setNameReadChar
app.post("/setArtistNameReadChar", async (req, res) => {
    const json: {
        userUUID?: string;
        artistUUID?: string;
        lang?: string;
        char?: string;
        charLang?: string;
    } = req.body;
    if (!json.userUUID || !json.artistUUID || !json.lang || !json.char || !json.charLang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editArtist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        artistUUID: MusicPlayerJSONManager.CreateType.artist(json.artistUUID)
    }).setNameReadChar(json.lang, json.char, json.charLang);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set artist name read character"); return; }
});
// アーティストの読み仮名削除 - deleteNameReadChar
app.post("/deleteArtistNameReadChar", async (req, res) => {
    const json: {
        userUUID?: string;
        artistUUID?: string;
        lang?: string;
        charLang?: string;
    } = req.body;
    if (!json.userUUID || !json.artistUUID || !json.lang || !json.charLang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editArtist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        artistUUID: MusicPlayerJSONManager.CreateType.artist(json.artistUUID)
    }).deleteNameReadChar(json.lang, json.charLang);
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete artist name read character"); return; }
});

// ミュージックのタイトル編集 - setTitle
app.post("/editMusicTitle", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        title?: string;
        lang?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.title || !json.lang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).setTitle(json.title, json.lang);
    if (result) { res.status(200).send("Edited"); return; }
    else { res.status(500).send("Failed to edit music title"); return; }
});
// ミュージックのタイトル削除 - removeTitle
app.post("/deleteMusicTitle", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        lang?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.lang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).removeTitle(json.lang);
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete music title"); return; }
});

// ミュージックのアーティスト編集 - addArtist
app.post("/addMusicArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        artistUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.artistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).addArtist(MusicPlayerJSONManager.CreateType.artist(json.artistUUID));
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add music artist"); return; }
});
// ミュージックのアーティスト編集 - removeArtist
app.post("/removeMusicArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        artistUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.artistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).removeArtist(MusicPlayerJSONManager.CreateType.artist(json.artistUUID));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove music artist"); return; }
});

// ミュージックのfeat.アーティスト編集 - addFeaturingArtist
app.post("/addMusicFeaturingArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        artistUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.artistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).addFeaturingArtist(MusicPlayerJSONManager.CreateType.artist(json.artistUUID));
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add music featuring artist"); return; }
});
// ミュージックのfeat.アーティスト編集 - removeFeaturingArtist
app.post("/removeMusicFeaturingArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        artistUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.artistUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).removeFeaturingArtist(MusicPlayerJSONManager.CreateType.artist(json.artistUUID));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove music featuring artist"); return; }
});

// ミュージックのジャンル編集 - addGenre
app.post("/addMusicGenre", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        genre?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.genre) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).addGenre(json.genre);
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add music genre"); return; }
});
// ミュージックのジャンル編集 - removeGenre
app.post("/removeMusicGenre", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        genre?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.genre) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).removeGenre(json.genre);
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove music genre"); return; }
});
// ミュージックのジャンル編集 - setGenre
app.post("/setMusicGenre", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        genre?: string[];
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.genre) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).setGenre(json.genre);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set music genre"); return; }
});

// ミュージックの歌詞編集 - setLyrics
app.post("/setMusicLyrics", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        lyrics?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.lyrics) { res.status(400).send("Invalid JSON"); return; }
    const lyrics = MusicPlayerJSONManager.CreateType.lyrics(json.lyrics);
    if (!lyrics) { res.status(400).send("Invalid lyrics"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).setLyrics(lyrics);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set music lyrics"); return; }
});
// ミュージックの歌詞編集 - removeLyrics
app.post("/removeMusicLyrics", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        lang?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.lang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).removeLyrics(json.lang);
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove music lyrics"); return; }
});

// ミュージックの音楽ファイルストリーム編集 - addMusicStream
app.post("/addMusicStream", multer().any(), async (req, res) => {
    const file = Array.isArray(req.files) ? req.files[0] : null;
    if (!file) { res.status(400).send("No file uploaded"); return; }
    const json: {
        userUUID?: string;
        musicUUID?: string;
        lang?: string;
        file?: string;
        type?: "normal" | "vocal" | "instrumental" | "other";
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.lang || !json.file || !json.type) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).addMusicStream(MusicPlayerJSONManager.CreateType.file(json.file), json.lang, json.type);
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add music stream"); return; }
});
// ミュージックの音楽ファイルストリーム編集 - removeMusicStream
app.post("/removeMusicStream", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).removeMusicStream(MusicPlayerJSONManager.CreateType.file(json.file));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove music stream"); return; }
});
// ミュージックの音楽ファイルストリームのファイル変更 - changeFile
app.post("/changeMusicStreamFile", multer().any(), async (req, res) => {
    const file = Array.isArray(req.files) ? req.files[0] : null;
    if (!file) { res.status(400).send("No file uploaded"); return; }
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
        newFile?: string;
        number?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file || !json.newFile || !json.number) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).editMusicStream(MusicPlayerJSONManager.CreateType.musicStream({
        uuid: json.musicUUID,
        number: json.number
    })).changeFile(MusicPlayerJSONManager.CreateType.file(json.file));
    if (result) { res.status(200).send("Changed"); return; }
    else { res.status(500).send("Failed to change music stream file"); return; }
});
// ミュージックの音楽ファイルストリームの言語変更 - changeLang
app.post("/changeMusicStreamLang", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
        lang?: string;
        number?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file || !json.lang || !json.number) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).editMusicStream(MusicPlayerJSONManager.CreateType.musicStream({
        uuid: json.musicUUID,
        number: json.number
    })).changeLang(json.lang);
    if (result) { res.status(200).send("Changed"); return; }
    else { res.status(500).send("Failed to change music stream language"); return; }
});
// ミュージックの音楽ファイルストリームのアーティスト追加 - addArtist
app.post("/addMusicStreamArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
        artistUUID?: string;
        number?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file || !json.artistUUID || !json.number) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).editMusicStream(MusicPlayerJSONManager.CreateType.musicStream({
        uuid: json.musicUUID,
        number: json.number
    })).addArtist(MusicPlayerJSONManager.CreateType.artist(json.artistUUID));
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add music stream artist"); return; }
});
// ミュージックの音楽ファイルストリームのアーティスト削除 - removeArtist
app.post("/removeMusicStreamArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
        artistUUID?: string;
        number?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file || !json.artistUUID || !json.number) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).editMusicStream(MusicPlayerJSONManager.CreateType.musicStream({
        uuid: json.musicUUID,
        number: json.number
    })).removeArtist(MusicPlayerJSONManager.CreateType.artist(json.artistUUID));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove music stream artist"); return; }
});
// ミュージックの音楽ファイルストリームのタイプ変更 - changeType
app.post("/changeMusicStreamType", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
        type?: "normal" | "vocal" | "instrumental" | "other";
        number?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file || !json.type || !json.number) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).editMusicStream(MusicPlayerJSONManager.CreateType.musicStream({
        uuid: json.musicUUID,
        number: json.number
    })).changeType(json.type);
    if (result) { res.status(200).send("Changed"); return; }
    else { res.status(500).send("Failed to change music stream type"); return; }
});
// ミュージックの音楽ファイルストリームの遅延補正設定 - setDelayCorrection
app.post("/setMusicStreamDelayCorrection", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
        startTime?: number;
        endTime?: number;
        number?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file || !json.startTime || !json.endTime || !json.number) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).editMusicStream(MusicPlayerJSONManager.CreateType.musicStream({
        uuid: json.musicUUID,
        number: json.number
    })).setDelayCorrection({
        startTime: json.startTime,
        endTime: json.endTime
    });
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set music stream delay correction"); return; }
});

// ミュージックの動画ストリーム編集 - addVideoStream
app.post("/addMusicVideoStream", multer().any(), async (req, res) => {
    const file = Array.isArray(req.files) ? req.files[0] : null;
    if (!file) { res.status(400).send("No file uploaded"); return; }
    const json: {
        userUUID?: string;
        musicUUID?: string;
        lang?: string;
        file?: string;
        type?: "other" | "musicvideo" | "movie";
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.lang || !json.file || !json.type) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).addVideoStream(MusicPlayerJSONManager.CreateType.file(json.file), json.lang, json.type);
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add music video stream"); return; }
});
// ミュージックの動画ストリーム編集 - removeVideoStream
app.post("/removeMusicVideoStream", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).removeVideoStream(MusicPlayerJSONManager.CreateType.file(json.file));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove music video stream"); return; }
});
// ミュージックの動画ファイルストリームのファイル変更 - changeFile
app.post("/changeMusicVideoStreamFile", multer().any(), async (req, res) => {
    const file = Array.isArray(req.files) ? req.files[0] : null;
    if (!file) { res.status(400).send("No file uploaded"); return; }
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
        newFile?: string;
        number?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file || !json.newFile || !json.number) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).editVideoStream(MusicPlayerJSONManager.CreateType.videoStream({
        uuid: json.musicUUID,
        number: json.number
    })).changeFile(MusicPlayerJSONManager.CreateType.file(json.file));
    if (result) { res.status(200).send("Changed"); return; }
    else { res.status(500).send("Failed to change music video stream file"); return; }
});
// ミュージックの動画ファイルストリームの言語変更 - changeLang
app.post("/changeMusicVideoStreamLang", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
        lang?: string;
        number?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file || !json.lang || !json.number) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).editVideoStream(MusicPlayerJSONManager.CreateType.videoStream({
        uuid: json.musicUUID,
        number: json.number
    })).changeLang(json.lang);
    if (result) { res.status(200).send("Changed"); return; }
    else { res.status(500).send("Failed to change music video stream language"); return; }
});
// ミュージックの動画ファイルストリームのアーティスト追加 - addArtist
app.post("/addMusicVideoStreamArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
        artistUUID?: string;
        number?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file || !json.artistUUID || !json.number) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).editVideoStream(MusicPlayerJSONManager.CreateType.videoStream({
        uuid: json.musicUUID,
        number: json.number
    })).addArtist(MusicPlayerJSONManager.CreateType.artist(json.artistUUID));
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add music video stream artist"); return; }
});
// ミュージックの動画ファイルストリームのアーティスト削除 - removeArtist
app.post("/removeMusicVideoStreamArtist", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
        artistUUID?: string;
        number?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file || !json.artistUUID || !json.number) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).editVideoStream(MusicPlayerJSONManager.CreateType.videoStream({
        uuid: json.musicUUID,
        number: json.number
    })).removeArtist(MusicPlayerJSONManager.CreateType.artist(json.artistUUID));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove music video stream artist"); return; }
});
// ミュージックの動画ファイルストリームのタイプ変更 - changeType
app.post("/changeMusicVideoStreamType", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
        type?: "other" | "musicvideo" | "movie";
        number?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file || !json.type || !json.number) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).editVideoStream(MusicPlayerJSONManager.CreateType.videoStream({
        uuid: json.musicUUID,
        number: json.number
    })).changeType(json.type);
    if (result) { res.status(200).send("Changed"); return; }
    else { res.status(500).send("Failed to change music video stream type"); return; }
});
// ミュージックの動画ファイルストリームの遅延補正設定 - setDelayCorrection
app.post("/setMusicVideoStreamDelayCorrection", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        file?: string;
        startTime?: number;
        endTime?: number;
        number?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.file || !json.startTime || !json.endTime || !json.number) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).editVideoStream(MusicPlayerJSONManager.CreateType.videoStream({
        uuid: json.musicUUID,
        number: json.number
    })).setDelayCorrection({
        startTime: json.startTime,
        endTime: json.endTime
    });
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set music video stream delay correction"); return; }
});

// ミュージックのアートワーク編集 - addMusicArtwork
app.post("/addMusicArtwork", multer().any(), async (req, res) => {
    const file = Array.isArray(req.files) ? req.files[0] : null;
    if (!file) { res.status(400).send("No file uploaded"); return; }
    const json: {
        userUUID?: string;
        musicUUID?: string;
        lang?: string;
        file?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.lang || !json.file) { res.status(400).send("Invalid JSON"); return; }
    const result = await MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).addMusicArtwork(MusicPlayerJSONManager.CreateType.artwork({
        lang: json.lang,
        file: json.file,
    }));
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add music artwork"); return; }
});
// ミュージックのアートワーク編集 - removeMusicArtwork
app.post("/removeMusicArtwork", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        lang?: string;
        file?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.lang || !json.file) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).removeMusicArtwork(MusicPlayerJSONManager.CreateType.artwork({
        lang: json.lang,
        file: json.file,
    }));
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove music artwork"); return; }
});

// ミュージックの読み仮名編集 - setTitleReadChar
app.post("/setMusicTitleReadChar", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        lang?: string;
        char?: string;
        charLang?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.lang || !json.char || !json.charLang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).setTitleReadChar(json.lang, json.char, json.charLang);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set music title read character"); return; }
});
// ミュージックの読み仮名編集 - deleteTitleReadChar
app.post("/deleteMusicTitleReadChar", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        lang?: string;
        charLang?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.lang || !json.charLang) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).deleteTitleReadChar(json.lang, json.charLang);
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete music title read character"); return; }
});

// ミュージックの作成日時編集 - setCreateDate
app.post("/setMusicCreateDate", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        year?: number;
        month?: number;
        day?: number;
        rawTime?: number;
    } = req.body;
    if (!json.userUUID || !json.musicUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).setCreateDate({
        year: json.year,
        month: json.month,
        day: json.day,
        rawTime: json.rawTime
    });
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set music create date"); return; }
});

// ミュージックのリミックス元曲編集 - setRemixMusic
app.post("/setRemixMusic", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        remixUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.remixUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).setRemixMusic(MusicPlayerJSONManager.CreateType.music(json.remixUUID));
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set remix music"); return; }
});
// ミュージックのリミックス元曲編集 - deleteRemixMusic
app.post("/deleteRemixMusic", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).deleteRemixMusic();
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete remix music"); return; }
});

// ミュージックのカバー元曲編集 - setCoverMusic
app.post("/setCoverMusic", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
        coverUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID || !json.coverUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).setCoverMusic(MusicPlayerJSONManager.CreateType.music(json.coverUUID));
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set cover music"); return; }
});
// ミュージックのカバー元曲編集 - deleteCoverMusic
app.post("/deleteCoverMusic", async (req, res) => {
    const json: {
        userUUID?: string;
        musicUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.musicUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editMusic({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        musicUUID: MusicPlayerJSONManager.CreateType.music(json.musicUUID)
    }).deleteCoverMusic();
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete cover music"); return; }
});

// プレイリストの名前編集 - setName
app.post("/setPlaylistName", async (req, res) => {
    const json: {
        userUUID?: string;
        playlistUUID?: string;
        name?: string;
    } = req.body;
    if (!json.userUUID || !json.playlistUUID || !json.name) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editPlaylist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        playlistUUID: MusicPlayerJSONManager.CreateType.playlist(json.playlistUUID)
    }).setName(json.name);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set playlist name"); return; }
});
// プレイリストの説明編集 - setDescription
app.post("/setPlaylistDescription", async (req, res) => {
    const json: {
        userUUID?: string;
        playlistUUID?: string;
        description?: string;
    } = req.body;
    if (!json.userUUID || !json.playlistUUID || !json.description) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editPlaylist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        playlistUUID: MusicPlayerJSONManager.CreateType.playlist(json.playlistUUID)
    }).setDescription(json.description);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set playlist description"); return; }
});

// プレイリストへの曲追加 - addMusic
app.post("/addMusicToPlaylist", async (req, res) => {
    const json: {
        userUUID?: string;
        playlistUUID?: string;
        musicUUID?: string;
        streamNumber?: number;
        type: "music" | "video";
    } = req.body;
    if (!json.userUUID || !json.playlistUUID || !json.musicUUID || !json.streamNumber) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editPlaylist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        playlistUUID: MusicPlayerJSONManager.CreateType.playlist(json.playlistUUID)
    }).addMusic(MusicPlayerJSONManager.CreateType.music(json.musicUUID), json.streamNumber, json.type);
    if (result) { res.status(200).send("Added"); return; }
    else { res.status(500).send("Failed to add music to playlist"); return; }
});
// プレイリストへの曲削除 - removeMusic
app.post("/removeMusicFromPlaylist", async (req, res) => {
    const json: {
        userUUID?: string;
        playlistUUID?: string;
        musicUUID?: string;
        index?: number;
    } = req.body;
    if (!json.userUUID || !json.playlistUUID || !json.musicUUID || !json.index) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editPlaylist({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        playlistUUID: MusicPlayerJSONManager.CreateType.playlist(json.playlistUUID)
    }).removeMusic(json.index);
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove music from playlist"); return; }
});

// ファイルの取得元設定 - setImportSource
app.post("/setFileImportSource", async (req, res) => {
    const json: {
        userUUID?: string;
        fileUUID?: string;
        source?: "onlineVideoService" | "analogRecording" | "onlineMusicService" | "digitalRecording" | "CD" | "downloadFile" | "original" | "other";
    } = req.body;
    if (!json.userUUID || !json.fileUUID || !json.source) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editFile({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        name: MusicPlayerJSONManager.CreateType.file(json.fileUUID)
    }).setImportSource(json.source);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set file import source"); return; }
});

// ファイルの説明設定 - setDescription
app.post("/setFileDescription", async (req, res) => {
    const json: {
        userUUID?: string;
        fileUUID?: string;
        description?: string;
    } = req.body;
    if (!json.userUUID || !json.fileUUID || !json.description) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editFile({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        name: MusicPlayerJSONManager.CreateType.file(json.fileUUID)
    }).setDescription(json.description);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set file description"); return; }
});
// ファイルの説明削除 - deleteDescription
app.post("/deleteFileDescription", async (req, res) => {
    const json: {
        userUUID?: string;
        fileUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.fileUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editFile({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        name: MusicPlayerJSONManager.CreateType.file(json.fileUUID)
    }).deleteDescription();
    if (result) { res.status(200).send("Deleted"); return; }
    else { res.status(500).send("Failed to delete file description"); return; }
});

// ファイルのVideoID設定 - setVideoId
app.post("/setFileVideoId", async (req, res) => {
    const json: {
        userUUID?: string;
        fileUUID?: string;
        videoId?: string;
    } = req.body;
    if (!json.userUUID || !json.fileUUID || !json.videoId) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editFile({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        name: MusicPlayerJSONManager.CreateType.file(json.fileUUID)
    }).setVideoId(json.videoId);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set file VideoID"); return; }
});
// ファイルのVideoID削除 - removeVideoId
app.post("/removeFileVideoId", async (req, res) => {
    const json: {
        userUUID?: string;
        fileUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.fileUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editFile({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        name: MusicPlayerJSONManager.CreateType.file(json.fileUUID)
    }).removeVideoId();
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove file VideoID"); return; }
});

// ファイルのダウンロードリンク設定 - setOriginalURL
app.post("/setFileOriginalURL", async (req, res) => {
    const json: {
        userUUID?: string;
        fileUUID?: string;
        url?: string;
    } = req.body;
    if (!json.userUUID || !json.fileUUID || !json.url) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editFile({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        name: MusicPlayerJSONManager.CreateType.file(json.fileUUID)
    }).setOriginalURL(json.url);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set file download link"); return; }
});
// ファイルのダウンロードリンク削除 - removeOriginalURL
app.post("/removeFileOriginalURL", async (req, res) => {
    const json: {
        userUUID?: string;
        fileUUID?: string;
    } = req.body;
    if (!json.userUUID || !json.fileUUID) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editFile({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        name: MusicPlayerJSONManager.CreateType.file(json.fileUUID)
    }).removeOriginalURL();
    if (result) { res.status(200).send("Removed"); return; }
    else { res.status(500).send("Failed to remove file download link"); return; }
});

// ファイルの音量補正設定 - setVolumeCorrection
app.post("/setFileVolumeCorrection", async (req, res) => {
    const json: {
        userUUID?: string;
        fileUUID?: string;
        volumeCorrection?: number;
    } = req.body;
    if (!json.userUUID || !json.fileUUID || !json.volumeCorrection) { res.status(400).send("Invalid JSON"); return; }
    const result = MusicPlayerJSONManager.editFile({
        userUUID: MusicPlayerJSONManager.CreateType.user(json.userUUID),
        name: MusicPlayerJSONManager.CreateType.file(json.fileUUID)
    }).setVolumeCorrection(json.volumeCorrection);
    if (result) { res.status(200).send("Set"); return; }
    else { res.status(500).send("Failed to set file volume correction"); return; }
});

app.listen(80);
