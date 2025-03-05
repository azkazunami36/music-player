export enum AudioImportSourceType {
    /**
     * その他
     */
    Other = "other",
    /**
     * オンライン動画サービスから取得した場合に指定します。(オリジナル度1)
     * 元音源から再エンコードされた場合はこれを指定します。
     */
    OnlineVideoService = "onlineVideoService",
    /**
     * 音源からアナログ録音した場合に指定します。(オリジナル度1)
     */
    AnalogRecording = "analogRecording",
    /**
     * オンライン音楽サービスから取得した場合に指定します。(オリジナル度2)
     */
    OnlineMusicService = "onlineMusicService",
    /**
     * デジタルで音源から録音した場合に指定します。(オリジナル度2)
     */
    DigitalRecording = "digitalRecording",
    /**
     * CDなどの音源から取得した場合に指定します。(オリジナル度3)
     */
    CD = "CD",
    /**
     * SoundCloudやフリー音源サイトなどからダウンロードしたファイルの場合に指定します。(オリジナル度4)
     */
    DownloadFile = "downloadFile",
    /**
     * オリジナルの音源の場合に指定します。(オリジナル度5)
     */
    Original = "original"
}

/**
 * クライアント側のJavaScriptで利用するAPIです。
 */
class MusicPlayerAPI {
    /**
     * アルバムを作成します。
     * @param info ユーザーUUIDと言語を入力します。
     * @returns 作成されたアルバムのUUIDを返します。
     */
    static async createAlbum(info: {
        userUUID: string;
        lang: string;
        title?: string;
    }) {
        const result = await fetch("/createAlbum", {
            method: "POST",
            body: JSON.stringify(info),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (result.ok) {
            return await result.text();
        } else {
            throw new Error(await result.text());
        }
    }
    /**
     * ファイルをアップロードします。
     * @param file ファイルデータを入力します。
     * @param json データを入力します。
     * @returns ファイル名を返します。
     */
    static async addFile(
        file: File,
        json: {
            userUUID: string;
            name: string;
            importSource: AudioImportSourceType;
            originalURL: {
                videoId?: string;
                downloadURL?: string;
            };
        }
    ) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("json", JSON.stringify(json));
        const result = await fetch("/uploadFile", {
            method: "POST",
            body: formData,
        });
        if (result.ok) {
            return await result.text();
        } else {
            throw new Error(await result.text());
        }
    }
}

