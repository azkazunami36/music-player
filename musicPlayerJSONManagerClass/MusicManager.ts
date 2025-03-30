// MusicManager.ts
import { randomUUID } from "crypto";

import {
  MusicUUID,
  UserUUID,
  ArtistUUID,
  FileName,
  MusicStream,
  VideoStream,
  Lyrics,
  musicplayerJSON
} from "../MusicPlayerJSONManagerClass.js";

export class MusicManager {
  constructor(private manager: any) {}

  create(info: { userUUID: UserUUID; lang: string; title?: string; }): MusicUUID {
    const uuid = randomUUID();
    const date = new Date();
    this.manager.json.musics.push({
      uuid: uuid,
      officialInfo: false,
      infoAuthor: info.userUUID.uuid,
      artist: [],
      featuringArtist: [],
      addedDate: date.getTime(),
      createDate: {},
      musicArtwork: [],
      title: [],
      genre: [],
      lyrics: [],
      music: [],
      video: []
    });
    if (info.title) {
      const music = this.manager.json.musics.find((music: any) => music.uuid === uuid);
      if (music) {
        music.title.push({
          lang: info.lang,
          name: info.title,
          titleReadChar: []
        });
      }
    }
    return {
      type: "music",
      uuid: uuid
    };
  }

  delete(info: { userUUID: UserUUID; musicUUID: MusicUUID; }): boolean {
    const index = this.manager.json.musics.findIndex((music: any) => music.uuid === info.musicUUID.uuid);
    if (index !== -1) {
      this.manager.json.musics.splice(index, 1);
      return true;
    }
    return false;
  }

  edit(info: { userUUID: UserUUID; musicUUID: MusicUUID; }) {
    class EditMusic {
      #info: { userUUID: UserUUID; musicUUID: MusicUUID; };
      #manager: any;
      constructor(info: { userUUID: UserUUID; musicUUID: MusicUUID; }, manager: any) {
        this.#info = info;
        this.#manager = manager;
      }
      setTitle(name: string, lang: string) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const titleObj = music.title.find((title: any) => title.lang === lang);
          if (titleObj) {
            titleObj.name = name;
          } else {
            music.title.push({
              lang: lang,
              name: name,
              titleReadChar: []
            });
          }
          return true;
        }
        return false;
      }
      removeTitle(lang: string) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const index = music.title.findIndex((title: any) => title.lang === lang);
          if (index !== -1) {
            music.title.splice(index, 1);
            return true;
          }
        }
        return false;
      }
      addArtist(artistUUID: ArtistUUID) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          music.artist.push(artistUUID.uuid);
          return true;
        }
        return false;
      }
      removeArtist(artistUUID: ArtistUUID) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const index = music.artist.findIndex((artist: any) => artist === artistUUID.uuid);
          if (index !== -1) {
            music.artist.splice(index, 1);
            return true;
          }
        }
        return false;
      }
      addFeaturingArtist(artistUUID: ArtistUUID) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          music.featuringArtist.push(artistUUID.uuid);
          return true;
        }
        return false;
      }
      removeFeaturingArtist(artistUUID: ArtistUUID) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const index = music.featuringArtist.findIndex((artist: any) => artist === artistUUID.uuid);
          if (index !== -1) {
            music.featuringArtist.splice(index, 1);
            return true;
          }
        }
        return false;
      }
      addGenre(genre: string) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          music.genre.push(genre);
          return true;
        }
        return false;
      }
      removeGenre(genre: string) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const index = music.genre.findIndex((g: any) => g === genre);
          if (index !== -1) {
            music.genre.splice(index, 1);
            return true;
          }
        }
        return false;
      }
      setGenre(genre: string[]) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          music.genre = genre;
          return true;
        }
        return false;
      }
      setLyrics(lyrics: Lyrics) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const index = music.lyrics.findIndex((lyric: any) => lyric.lang === lyrics.lang);
          if (index !== -1) {
            music.lyrics[index] = lyrics;
          } else {
            music.lyrics.push(lyrics);
          }
          return true;
        }
        return false;
      }
      removeLyrics(lang: string) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const index = music.lyrics.findIndex((lyric: any) => lyric.lang === lang);
          if (index !== -1) {
            music.lyrics.splice(index, 1);
            return true;
          }
        }
        return false;
      }
      addMusicStream(file: FileName, lang: string, type: "normal" | "vocal" | "instrumental" | "other"): MusicStream | false {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const index = music.music.findIndex((stream: any) => stream.file === file.name);
          if (index !== -1) {
            music.music[index] = {
              file: file.name,
              lang: lang,
              artist: [],
              type: type,
              master: false,
              delayCorrection: {}
            };
            return {
              type: "musicStream",
              number: index,
              musicUUID: this.#info.musicUUID
            };
          } else {
            music.music.push({
              file: file.name,
              lang: lang,
              artist: [],
              type: type,
              master: false,
              delayCorrection: {}
            });
            const newIndex = music.music.findIndex((stream: any) => stream.file === file.name);
            return {
              type: "musicStream",
              number: newIndex,
              musicUUID: this.#info.musicUUID
            };
          }
        }
        return false;
      }
      removeMusicStream(file: FileName) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const index = music.music.findIndex((stream: any) => stream.file === file.name);
          if (index !== -1) {
            music.music.splice(index, 1);
            return true;
          }
        }
        return false;
      }
      addVideoStream(file: FileName, lang: string, type: "other" | "musicvideo" | "movie"): VideoStream | false {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const index = music.video.findIndex((stream: any) => stream.file === file.name);
          if (index !== -1) {
            music.video[index] = {
              file: file.name,
              lang: lang,
              artist: [],
              type: type,
              master: false,
              delayCorrection: {}
            };
            return {
              type: "videoStream",
              number: index,
              musicUUID: this.#info.musicUUID
            };
          } else {
            music.video.push({
              file: file.name,
              lang: lang,
              artist: [],
              type: type,
              master: false,
              delayCorrection: {}
            });
            const newIndex = music.video.findIndex((stream: any) => stream.file === file.name);
            return {
              type: "videoStream",
              number: newIndex,
              musicUUID: this.#info.musicUUID
            };
          }
        }
        return false;
      }
      removeVideoStream(file: FileName) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const index = music.video.findIndex((stream: any) => stream.file === file.name);
          if (index !== -1) {
            music.video.splice(index, 1);
            return true;
          }
        }
        return false;
      }
      editMusicStream(musicStream: MusicStream) {
        class EditMusicStream {
          #info: { musicUUID: MusicUUID; number: number; };
          #manager: any;
          constructor(info: { musicUUID: MusicUUID; number: number; }, manager: any) {
            this.#info = info;
            this.#manager = manager;
          }
          changeFile(file: FileName) {
            const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
            if (music) {
              music.music[this.#info.number].file = file.name;
              return true;
            }
            return false;
          }
          changeLang(lang: string) {
            const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
            if (music) {
              music.music[this.#info.number].lang = lang;
              return true;
            }
            return false;
          }
          addArtist(artistUUID: ArtistUUID) {
            const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
            if (music) {
              music.music[this.#info.number].artist.push(artistUUID.uuid);
              return true;
            }
            return false;
          }
          removeArtist(artistUUID: ArtistUUID) {
            const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
            if (music) {
              const index = music.music[this.#info.number].artist.findIndex((artist: any) => artist === artistUUID.uuid);
              if (index !== -1) {
                music.music[this.#info.number].artist.splice(index, 1);
                return true;
              }
            }
            return false;
          }
          changeType(type: "normal" | "vocal" | "instrumental" | "other") {
            const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
            if (music) {
              music.music[this.#info.number].type = type;
              return true;
            }
            return false;
          }
          setDelayCorrection(delayCorrection: { startTime?: number; endTime?: number; }) {
            const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
            if (music) {
              if (delayCorrection.startTime !== undefined) music.music[this.#info.number].delayCorrection.startTime = delayCorrection.startTime;
              if (delayCorrection.endTime !== undefined) music.music[this.#info.number].delayCorrection.endTime = delayCorrection.endTime;
              return true;
            }
            return false;
          }
        }
        return new EditMusicStream(musicStream, this.#manager);
      }
      editVideoStream(videoStream: VideoStream) {
        class EditVideoStream {
          #info: { musicUUID: MusicUUID; number: number; };
          #manager: any;
          constructor(info: { musicUUID: MusicUUID; number: number; }, manager: any) {
            this.#info = info;
            this.#manager = manager;
          }
          changeFile(file: FileName) {
            const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
            if (music) {
              music.video[this.#info.number].file = file.name;
              return true;
            }
            return false;
          }
          changeLang(lang: string) {
            const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
            if (music) {
              music.video[this.#info.number].lang = lang;
              return true;
            }
            return false;
          }
          addArtist(artistUUID: ArtistUUID) {
            const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
            if (music) {
              music.video[this.#info.number].artist.push(artistUUID.uuid);
              return true;
            }
            return false;
          }
          removeArtist(artistUUID: ArtistUUID) {
            const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
            if (music) {
              const index = music.video[this.#info.number].artist.findIndex((artist: any) => artist === artistUUID.uuid);
              if (index !== -1) {
                music.video[this.#info.number].artist.splice(index, 1);
                return true;
              }
            }
            return false;
          }
          changeType(type: "other" | "musicvideo" | "movie") {
            const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
            if (music) {
              music.video[this.#info.number].type = type;
              return true;
            }
            return false;
          }
          setDelayCorrection(delayCorrection: { startTime?: number; endTime?: number; }) {
            const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
            if (music) {
              if (delayCorrection.startTime !== undefined) music.video[this.#info.number].delayCorrection.startTime = delayCorrection.startTime;
              if (delayCorrection.endTime !== undefined) music.video[this.#info.number].delayCorrection.endTime = delayCorrection.endTime;
              return true;
            }
            return false;
          }
        }
        return new EditVideoStream(videoStream, this.#manager);
      }
      addMusicArtwork(artwork: any) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          music.musicArtwork.push(artwork);
          return true;
        }
        return false;
      }
      removeMusicArtwork(artwork: any) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const index = music.musicArtwork.findIndex((art: any) => art.file === artwork.file);
          if (index !== -1) {
            music.musicArtwork.splice(index, 1);
            return true;
          }
        }
        return false;
      }
      setTitleReadChar(lang: string, char: string, charlang: string) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const title = music.title.find((title: any) => title.lang === lang);
          if (title) {
            title.titleReadChar.push({
              lang: charlang,
              char: char
            });
          } else {
            music.title.push({
              lang: lang,
              name: "",
              titleReadChar: [{
                lang: charlang,
                char: char
              }]
            });
          }
          return true;
        }
        return false;
      }
      deleteTitleReadChar(lang: string, charlang: string) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          const title = music.title.find((title: any) => title.lang === lang);
          if (title) {
            const index = title.titleReadChar.findIndex((char: any) => char.lang === charlang);
            if (index !== -1) {
              title.titleReadChar.splice(index, 1);
              return true;
            }
          }
        }
        return false;
      }
      setCreateDate(createDate: { year?: number; month?: number; day?: number; rawTime?: number; }) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          if (createDate.year) music.createDate.year = createDate.year;
          if (createDate.month) music.createDate.month = createDate.month;
          if (createDate.day) music.createDate.day = createDate.day;
          if (createDate.rawTime) music.createDate.rawTime = createDate.rawTime;
          return true;
        }
        return false;
      }
      setRemixMusic(musicUUID: any) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          music.remixMusic = musicUUID.uuid;
          return true;
        }
        return false;
      }
      deleteRemixMusic() {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          music.remixMusic = undefined;
          return true;
        }
        return false;
      }
      setCoverMusic(musicUUID: any) {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          music.coverMusic = musicUUID.uuid;
          return true;
        }
        return false;
      }
      deleteCoverMusic() {
        const music = this.#manager.json.musics.find((music: any) => music.uuid === this.#info.musicUUID.uuid);
        if (music) {
          music.coverMusic = undefined;
          return true;
        }
        return false;
      }
    }
    return new EditMusic(info, this.manager);
  }
}
