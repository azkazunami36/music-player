// FileManager.ts
import fs from "fs";
import Stream from "stream";
import { randomUUID } from "crypto";
import { FileName, UserUUID, MusicPlayerJSONManagerClass } from "../MusicPlayerJSONManagerClass.js";

export class FileManager {
  constructor(private manager: MusicPlayerJSONManagerClass) { }

  async add(info: {
    userUUID: UserUUID;
    name: string;
    importSource: "onlineVideoService" | "analogRecording" | "onlineMusicService" | "digitalRecording" | "CD" | "downloadFile" | "original" | "other";
    originalURL: { videoId?: string; downloadURL?: string; };
    readStream: fs.ReadStream | Stream.Readable;
  }): Promise<FileName | false> {
    const date = new Date();
    if (this.manager.json.files.find((f: any) => f.name === info.name)) return false;

    if (!fs.existsSync("cache")) fs.mkdirSync("cache");
    if (fs.existsSync("cache/" + info.name)) fs.unlinkSync("cache/" + info.name);
    const writeStream = fs.createWriteStream("cache/" + info.name);
    info.readStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      const cleanup = () => {
        info.readStream.removeListener("error", onError);
        writeStream.removeListener("error", onError);
        writeStream.removeListener("close", onClose);
      };
      const onError = (err: Error) => { cleanup(); reject(err); };
      const onClose = () => { cleanup(); resolve(true); };
      info.readStream.once("error", onError);
      writeStream.once("error", onError);
      writeStream.once("close", onClose);
    });

    this.manager.json.files.push({
      name: info.name,
      officialInfo: false,
      infoAuthor: info.userUUID.uuid,
      addedDate: date.getTime(),
      ffmpegInfo: {},
      importSource: info.importSource,
      originalURL: info.originalURL
    });

    return { type: "file", name: info.name };
  }

  delete(info: { userUUID: UserUUID; name: FileName }): boolean {
    const index = this.manager.json.files.findIndex((f: any) => f.name === info.name.name);
    if (index !== -1) {
      this.manager.json.files.splice(index, 1);
      return true;
    }
    return false;
  }

  /** ファイルを編集します。 */
  edit(info: {
    userUUID: UserUUID;
    name: FileName;
  }) {
    class EditFile {
      #info: {
        userUUID: UserUUID;
        name: FileName;
      }
      #MusicPlayerJSONManager;
      constructor(info: {
        userUUID: UserUUID;
        name: FileName;
      }, MusicPlayerJSONManager: MusicPlayerJSONManagerClass) {
        this.#info = info;
        this.#MusicPlayerJSONManager = MusicPlayerJSONManager;
      }
      /** 取得元を設定します。 */
      setImportSource(
        /**
         * - onlineVideoService: オンライン動画サービスから(YouTube、niconicoなど) - オリジナル度1 再エンコードされているため、劣化が少し生じる。再エンコードした場合はこの部類となる
         * - analogRecording: 音源からアナログ録音したもの - オリジナル度1 アナログ収録のため、劣化が少し生じる
         * - onlineMusicService: オンライン音楽サービスから(Apple Music、Spotifyなど) - オリジナル度2 音楽サービスとして公開されているため劣化は少ない
         * - digitalRecording: 音源から録音したもの - オリジナル度2 デジタル収録のため、劣化は少ない
         * - CD: CDなどの音源から - オリジナル度3 視聴するための音源であるため、劣化は少ない
         * - downloadFile: ダウンロードしたファイルから(SoundCloudやフリー音源サイトなどの未改変音源) - オリジナル度4 オリジナルに近いため、劣化は少ない
         * - original: オリジナルの音源(自作音源など) - オリジナル度5 オリジナルであるため、劣化はない
         * - other: その他
         */
        source: "onlineVideoService" | "analogRecording" | "onlineMusicService" | "digitalRecording" | "CD" | "downloadFile" | "original" | "other"
      ) {
        const file = this.#MusicPlayerJSONManager.json.files.find(file => file.name === this.#info.name.name);
        if (file) {
          file.importSource = source;
          return true;
        } else {
          return false;
        }
      }
      /** 説明を設定します。 */
      setDescription(description: string) {
        const file = this.#MusicPlayerJSONManager.json.files.find(file => file.name === this.#info.name.name);
        if (file) {
          file.description = description;
          return true;
        } else {
          return false;
        }
      }
      /** 説明を削除します。 */
      deleteDescription() {
        const file = this.#MusicPlayerJSONManager.json.files.find(file => file.name === this.#info.name.name);
        if (file) {
          file.description = undefined;
          return true;
        } else {
          return false;
        }
      }
      /** オリジナルのYouTube VideoIDを設定します。 */
      setVideoId(videoId: string) {
        const file = this.#MusicPlayerJSONManager.json.files.find(file => file.name === this.#info.name.name);
        if (file) {
          file.originalURL.videoId = videoId;
          return true;
        }
        return false;
      }
      /** オリジナルのYouTube VideoIDを削除します。 */
      removeVideoId() {
        const file = this.#MusicPlayerJSONManager.json.files.find(file => file.name === this.#info.name.name);
        if (file) {
          file.originalURL.videoId = undefined;
          return true;
        }
        return false;
      }
      /** オリジナルのダウンロードリンクを設定します。 */
      setOriginalURL(url: string) {
        const file = this.#MusicPlayerJSONManager.json.files.find(file => file.name === this.#info.name.name);
        if (file) {
          file.originalURL.downloadURL = url;
          return true;
        }
        return false;
      }
      /** オリジナルのダウンロードリンクを削除します。 */
      removeOriginalURL() {
        const file = this.#MusicPlayerJSONManager.json.files.find(file => file.name === this.#info.name.name);
        if (file) {
          file.originalURL.downloadURL = undefined;
          return true;
        }
        return false;
      }
      /** 音声の音量を修正します。 */
      setVolumeCorrection(volumeCorrection: number) {
        const file = this.#MusicPlayerJSONManager.json.files.find(file => file.name === this.#info.name.name);
        if (file) {
          file.volumeCorrection = volumeCorrection;
          return true;
        }
        return false;
      }
    }
    return new EditFile(info, this.manager);
  }

}
