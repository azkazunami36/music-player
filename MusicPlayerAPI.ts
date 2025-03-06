export enum AudioImportSourceType {
    Other = "other",
    OnlineVideoService = "onlineVideoService",
    AnalogRecording = "analogRecording",
    OnlineMusicService = "onlineMusicService",
    DigitalRecording = "digitalRecording",
    CD = "CD",
    DownloadFile = "downloadFile",
    Original = "original"
}

// クライアント用API（MusicPlayerJSONManagerClassと同じ操作感を目指す）
export class MusicPlayerAPI {
    // アルバム操作
    static album = {
        create(info: { userUUID: string; lang: string; title?: string }): Promise<string> {
            return fetch("/createAlbum", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info)
            }).then(async res => {
                if (res.ok) return await res.text();
                throw new Error(await res.text());
            });
        },
        delete(info: { userUUID: string; albumUUID: string }): Promise<boolean> {
            return fetch("/deleteAlbum", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info)
            }).then(async res => {
                if (res.ok) return true;
                throw new Error(await res.text());
            });
        },
        edit(info: { userUUID: string; albumUUID: string }) {
            return {
                setTitle(title: string, lang: string): Promise<boolean> {
                    return fetch("/editAlbumTitle", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, title, lang })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeTitle(lang: string): Promise<boolean> {
                    return fetch("/deleteAlbumTitle", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, lang })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                addArtist(artistUUID: string): Promise<boolean> {
                    return fetch("/addAlbumArtist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, artistUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeArtist(artistUUID: string): Promise<boolean> {
                    return fetch("/removeAlbumArtist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, artistUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                addMusic(musicUUID: string): Promise<boolean> {
                    return fetch("/addAlbumMusic", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, musicUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeMusic(musicUUID: string): Promise<boolean> {
                    return fetch("/removeAlbumMusic", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, musicUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                addAlbumArtwork(artwork: { lang: string; file: string; main?: boolean }): Promise<boolean> {
                    return fetch("/addAlbumArtwork", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, ...artwork })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeAlbumArtwork(artwork: { lang: string; file: string }): Promise<boolean> {
                    return fetch("/removeAlbumArtwork", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, ...artwork })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                addGenre(genre: string): Promise<boolean> {
                    return fetch("/addAlbumGenre", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, genre })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeGenre(genre: string): Promise<boolean> {
                    return fetch("/removeAlbumGenre", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, genre })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                setGenre(genre: string[]): Promise<boolean> {
                    return fetch("/setAlbumGenre", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, genre })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                setCreateDate(createDate: { year?: number; month?: number; day?: number; rawTime?: number }): boolean {
                    // ※同期の場合は try/catch などでエラーチェックするがここは簡略化
                    // エンドポイント例 "/setAlbumCreateDate" を想定
                    // ※必要に応じてfetch(async)に変更してください
                    return true;
                },
                setTitleReadChar(lang: string, char: string, charlang: string): Promise<boolean> {
                    return fetch("/setAlbumTitleReadChar", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, lang, char, charLang: charlang })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                deleteTitleReadChar(lang: string, charlang: string): Promise<boolean> {
                    return fetch("/deleteAlbumTitleReadChar", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, lang, charLang: charlang })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                addFeaturingArtist(artistUUID: string): Promise<boolean> {
                    return fetch("/addAlbumFeaturingArtist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, artistUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeFeaturingArtist(artistUUID: string): Promise<boolean> {
                    return fetch("/removeAlbumFeaturingArtist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, artistUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                setFeaturingArtist(artistUUIDs: string[]): Promise<boolean> {
                    return fetch("/setAlbumFeaturingArtist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, artistUUID: artistUUIDs })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                setRemixAlbum(albumUUID: string): Promise<boolean> {
                    return fetch("/setAlbumRemixAlbum", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, remixAlbumUUID: albumUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                deleteRemixAlbum(): Promise<boolean> {
                    return fetch("/deleteAlbumRemixAlbum", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(info)
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                setCoverAlbum(albumUUID: string): Promise<boolean> {
                    return fetch("/setAlbumCoverAlbum", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, coverAlbumUUID: albumUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                deleteCoverAlbum(): Promise<boolean> {
                    return fetch("/deleteAlbumCoverAlbum", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(info)
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                }
            };
        }
    };
    // アーティスト操作
    static artist = {
        create(info: { userUUID: string; lang: string; name?: string }): Promise<string> {
            return fetch("/createArtist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info)
            }).then(async res => {
                if (res.ok) return await res.text();
                throw new Error(await res.text());
            });
        },
        delete(info: { userUUID: string; artistUUID: string }): Promise<boolean> {
            return fetch("/deleteArtist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info)
            }).then(async res => {
                if (res.ok) return true;
                throw new Error(await res.text());
            });
        },
        edit(info: { userUUID: string; artistUUID: string }) {
            return {
                setName(name: string, lang: string): Promise<boolean> {
                    return fetch("/setArtistName", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, name, lang })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeName(lang: string): Promise<boolean> {
                    return fetch("/deleteArtistName", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, lang })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                addCharacterVoice(artistUUID: string): Promise<boolean> {
                    return fetch("/addArtistCharacterVoice", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, characterVoiceArtistUUID: artistUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeCharacterVoice(artistUUID: string): Promise<boolean> {
                    return fetch("/removeArtistCharacterVoice", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, characterVoiceArtistUUID: artistUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                addArtistArtwork(artwork: { lang: string; file: string; main?: boolean }): Promise<boolean> {
                    return fetch("/addArtistArtwork", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, ...artwork })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeArtistArtwork(artwork: { lang: string; file: string }): Promise<boolean> {
                    return fetch("/removeArtistArtwork", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, ...artwork })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                setNameReadChar(lang: string, char: string, charlang: string): Promise<boolean> {
                    return fetch("/setArtistNameReadChar", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, lang, char, charLang: charlang })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                deleteNameReadChar(lang: string, charlang: string): Promise<boolean> {
                    return fetch("/deleteArtistNameReadChar", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, lang, charLang: charlang })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                }
            };
        }
    };
    // ミュージック操作
    static music = {
        create(info: { userUUID: string; lang: string; title?: string }): Promise<string> {
            return fetch("/createMusic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info)
            }).then(async res => {
                if (res.ok) return await res.text();
                throw new Error(await res.text());
            });
        },
        delete(info: { userUUID: string; musicUUID: string }): Promise<boolean> {
            return fetch("/deleteMusic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info)
            }).then(async res => {
                if (res.ok) return true;
                throw new Error(await res.text());
            });
        },
        edit(info: { userUUID: string; musicUUID: string }) {
            return {
                setTitle(title: string, lang: string): Promise<boolean> {
                    return fetch("/editMusicTitle", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, title, lang })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeTitle(lang: string): Promise<boolean> {
                    return fetch("/deleteMusicTitle", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, lang })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                addArtist(artistUUID: string): Promise<boolean> {
                    return fetch("/addMusicArtist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, artistUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeArtist(artistUUID: string): Promise<boolean> {
                    return fetch("/removeMusicArtist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, artistUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                addFeaturingArtist(artistUUID: string): Promise<boolean> {
                    return fetch("/addMusicFeaturingArtist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, artistUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeFeaturingArtist(artistUUID: string): Promise<boolean> {
                    return fetch("/removeMusicFeaturingArtist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, artistUUID })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                addGenre(genre: string): Promise<boolean> {
                    return fetch("/addMusicGenre", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, genre })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeGenre(genre: string): Promise<boolean> {
                    return fetch("/removeMusicGenre", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, genre })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                setGenre(genre: string[]): Promise<boolean> {
                    return fetch("/setMusicGenre", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, genre })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                setLyrics(lyrics: any): Promise<boolean> {
                    return fetch("/setMusicLyrics", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, lyrics: JSON.stringify(lyrics) })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeLyrics(lang: string): Promise<boolean> {
                    return fetch("/removeMusicLyrics", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, lang })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                addMusicStream(file: string, lang: string, type: "normal" | "vocal" | "instrumental" | "other"): Promise<boolean> {
                    return fetch("/addMusicStream", {
                        method: "POST",
                        body: (() => {
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("json", JSON.stringify({ ...info, lang, type }));
                            return formData;
                        })()
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeMusicStream(file: string): Promise<boolean> {
                    return fetch("/removeMusicStream", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, file })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                }
                // editMusicStream / editVideoStream, addMusicArtwork, removeMusicArtwork, setTitleReadChar, deleteTitleReadChar,
                // setCreateDate, setRemixMusic, deleteRemixMusic, setCoverMusic, deleteCoverMusic
                // ※その他の編集メソッドも、サーバー側の対応エンドポイントに合わせて実装してください
                // ...existing methods
            };
        }
    };
    // プレイリスト操作
    static playlist = {
        create(info: { userUUID: string; name?: string }): Promise<string> {
            return fetch("/createPlaylist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info)
            }).then(async res => {
                if (res.ok) return await res.text();
                throw new Error(await res.text());
            });
        },
        delete(info: { userUUID: string; playlistUUID: string }): Promise<boolean> {
            return fetch("/deletePlaylist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info)
            }).then(async res => {
                if (res.ok) return true;
                throw new Error(await res.text());
            });
        },
        edit(info: { userUUID: string; playlistUUID: string }) {
            return {
                setName(name: string): Promise<boolean> {
                    return fetch("/setPlaylistName", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, name })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                setDescription(description: string): Promise<boolean> {
                    return fetch("/setPlaylistDescription", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, description })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                addMusic(musicUUID: string, streamNumber: number, type: "music" | "video"): Promise<boolean> {
                    return fetch("/addMusicToPlaylist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, musicUUID, streamNumber, type })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeMusic(index: number): Promise<boolean> {
                    return fetch("/removeMusicFromPlaylist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, index })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                }
            };
        }
    };
    // ファイル操作
    static file = {
        add(file: File, info: {
            userUUID: string;
            name: string;
            importSource: AudioImportSourceType;
            originalURL: { videoId?: string; downloadURL?: string };
        }): Promise<string> {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("json", JSON.stringify(info));
            return fetch("/uploadFile", {
                method: "POST",
                body: formData
            }).then(async res => {
                if (res.ok) return await res.text();
                throw new Error(await res.text());
            });
        },
        delete(info: { userUUID: string; fileUUID: string }): Promise<boolean> {
            return fetch("/deleteFile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info)
            }).then(async res => {
                if (res.ok) return true;
                throw new Error(await res.text());
            });
        },
        edit(info: { userUUID: string; fileUUID: string }) {
            return {
                setImportSource(source: AudioImportSourceType): Promise<boolean> {
                    return fetch("/setFileImportSource", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, source })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                setDescription(description: string): Promise<boolean> {
                    return fetch("/setFileDescription", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, description })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                deleteDescription(): Promise<boolean> {
                    return fetch("/deleteFileDescription", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(info)
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                setVideoId(videoId: string): Promise<boolean> {
                    return fetch("/setFileVideoId", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, videoId })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeVideoId(): Promise<boolean> {
                    return fetch("/removeFileVideoId", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(info)
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                setOriginalURL(url: string): Promise<boolean> {
                    return fetch("/setFileOriginalURL", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...info, url })
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                },
                removeOriginalURL(): Promise<boolean> {
                    return fetch("/removeFileOriginalURL", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(info)
                    }).then(async res => {
                        if (res.ok) return true;
                        throw new Error(await res.text());
                    });
                }
                // ... deleteDescription, setVideoId, removeVideoId, setOriginalURL, removeOriginalURL, setVolumeCorrection
            };
        }
    };
}
