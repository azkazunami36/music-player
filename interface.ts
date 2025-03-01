import FFmpeg from "fluent-ffmpeg";

/** サーバーとクライアントが通信するときに使うJSON形式 */
export interface POSTData {
    type?: "fileUpload"
    | "fileList"
    | "filePracticalInfo"
    | "fileInfo"
    | "fileDelete"
    | "musicList"
    | "musicSearch"
    | "musicInfo"
    | "musicInfoCreate"
    | "musicInfoEdit"
    | "musicDelete"
    | "artistList"
    | "artistSearch"
    | "artistInfo"
    | "artistInfoCreate"
    | "artistInfoEdit"
    | "artistDelete"
    | "playList"
    | "playlistSearch"
    | "playlistInfo"
    | "playlistInfoCreate"
    | "playlistInfoEdit"
    | "playlistDelete"
    | "albumList"
    | "albumSearch"
    | "albumInfo"
    | "albumInfoCreate"
    | "albumInfoEdit"
    | "albumDelete"
    | "playHistory"
    | "sessionPing";
    /** 何らかの理由でGridFSまたはCollection内に直接アクセスする必要がある場合 */
    _id?: string;
    /** ファイルを指定する */
    fileName?: string;
    /** アルバムを指定する */
    albumuuid?: string;
    /** アルバムを検索する */
    albumname?: string;
    /** アーティストを指定する */
    artistuuid?: string;
    /** アーティストを検索する */
    artistname?: string;
    /** 曲を指定する */
    musicuuid?: string;
    /** 曲を検索する */
    musicname?: string;
    /** プレイリストを指定する */
    playlistuuid?: string;
    /** プレイリストを検索する */
    playlistname?: string;
    /** 年単位で絞る */
    year?: string;
    /** 月単位で絞る */
    month?: string;
    /** 日単位で絞る */
    day?: string;
    /** 時間単位で絞る */
    hour?: string;
    /** 分単位で絞る */
    miniute?: string;
    /** 秒単位で絞る */
    seconds?: string;
    /** 再生状況。play, pauseの２つ */
    playstatus?: string;
    /** 再生している曲の操作前の地点 */
    oldplaytime?: string;
    /** 再生している曲の現在地点 */
    playtime?: string;
    /** 編集を保存するためにJSONを格納する */
    editdata?: string;
    /** 操作を加えられた場合。seek, pause, play, repeat, changeの５つ */
    operating?: string;
    /** クライアントでセッション情報を作成した時間 */
    nowtime?: string;
};

/** クライアントのセッション情報のJSON形式 */
export interface ClientSession {
    /** セッションIDを保持 */
    sessionid?: string;
    /** 再生中の曲 */
    musicuuid?: string;
    /** 再生に使用しているプレイリスト */
    playlistuuid?: string;
    /** 再生中のアルバム */
    albumuuid?: string;
    /** 再生中のアーティスト */
    artistuuid?: string;
    /** 再生状況。play, pauseの２つ */
    playstatus: string;
    /** 再生している曲の操作前の地点 */
    oldplaytime?: string;
    /** 再生している曲の現在地点 */
    playtime: string;
    /** 操作を加えられた場合。seek, pause, play, repeat, change, noの６つ */
    operating: string;
    /** クライアントでセッション情報を作成した時間 */
    nowtime: string;
}

/** セッション情報のJSON形式 */
export interface Session {
    /** セッションIDを保持 */
    sessionid: string;
    /** 再生中の曲 */
    musicuuid?: string;
    /** 再生に使用しているプレイリスト */
    playlistuuid?: string;
    /** 再生中のアルバム */
    albumuuid?: string;
    /** 再生中のアーティスト */
    artistuuid?: string;
    /** 再生開始地点 */
    playtime: number;
    /** セッションPingを送信した時間 */
    lastconnecttime: number;
}

/** 再生履歴のJSON形式 */
export interface PlayHistory {
    sessionid?: string;
    musicuuid?: string;
    playlistuuid?: string;
    albumuuid?: string;
    artistuuid?: string;
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    miniute?: number;
    seconds?: number;
    playtime?: number;
    playlength?: number;
}

export interface FileInfoStream {
    /** GridFSに保存されているファイル名です。 */
    originalfilename?: string;
    /** 非圧縮で変換したものです。 */
    flacfilename?: string;
    /** 圧縮で変換したものです。 */
    aacfilename?: string;
}

export interface InfoInArtist {
    type?: "artist" | "composer";
    artistuuid?: string;
}

/** アルバム・ミュージック共通の情報JSON形式 */
export interface BaseInfo {
    releasetime?: {
        date?: Date;
        year?: number;
        month?: number;
        day?: number;
    };
    copyright?: string;
}

/** ファイル毎に記録できる情報のJSON形式 */
export interface FileInfo {
    /** ユーザーに表示されるファイル名です。実際のGridFSに保存されているファイル名ではありません。 */
    filename?: string;
    /** GridFSに保存されているファイル名です。かつ、ユーザーから受け取り、何も変更を加えられていないファイルです。 */
    originalfilename?: string;
    info?: {};
    /** 変更を加える前に取得したFFmpeg情報です。 */
    ffmpeginfo?: FFmpeg.FfprobeStream[];
    /** このファイルの主なファイル分類です。あくまで参考程度です。 */
    type?: "video" | "audio" | "image" | "other";
    /** このファイルのグローバルなメタデータです。 */
    ffmpegmetadata?: {
        [metaname: string]: string;
    };
    /** このファイルのストリーム・チャプター毎のメタデータです。 */
    ffmpegsectionmetadata?: {
        [metaname: string]: string;
    }[];
    /** 変更を加える前に取得したメタデータの生情報です。 */
    ffmpegmetadataoriginal?: string;
    /** ストリーム毎の情報です。 */
    streams?: FileInfoStream[];
    ffmpegdetection?: "no" | "yes";
}

/** ミュージック情報のJSON形式 */
export interface MusicInfo extends BaseInfo {
    /** 曲を識別するUUID */
    musicuuid?: string;
    /** アーティスト一覧 */
    artists?: InfoInArtist[];
    /** リミックス元の曲のUUID */
    remixoriginaluuid?: string;
    /** カバー元の曲のUUID */
    coveroriginaluuid?: string;
    /** ミュージック写真 */
    musicpictures?: {
        languagetype?: string;
        filename?: string;
        main?: boolean;
    }[];
    /** ミュージック情報 */
    infos?: {
        languagetype?: string;
        musicname?: string;
        musicnamereadchar?: {
            languagetype?: string;
        }[];
    }[];
    /** 音声 */
    sounds?: {
        languagetype?: string;
        /** ファイルのデフォルトストリーム */
        defaultstream?: number;
        /** ファイルリスト */
        filelist?: {
            /** ファイル名 */
            filename?: string;
            /** ファイルタイプ */
            filetype?: "default" | "instrumental" | "vocalonly";
            /** 遅延 */
            timediff?: number;
        }[];
        lyrics?: {
            text?: string;
            startTime?: number;
            endTime?: number;
            timepertext?: {
                length?: number;
                time?: number;
            }[];
        };
    }[];
    /** デフォルトの音声 */
    defaultsound?: number;
    /** 作成日 */
    createdate?: string;
    /** 編集日 */
    updatedate?: string;
}

/** 再生リスト情報のJSON形式 */
export interface PlayListInfo {
    playlistuuid?: string;
    musics?: {
        musicuuid?: string;
        filesNumber?: number;
        streamNumber?: number;
    }[];
    playlistname?: string;
    description?: string;
}

/** アーティスト情報のJSON形式 */
export interface ArtistInfo {
    /** アーティストを識別するUUID */
    artistuuid?: string;
    /** アーティストのキャラクターボイスを担当するアーティストUUID */
    charactervoiceuuid?: string[];
    /** アーティスト名 */
    artistname?: string;
    /** アーティスト画像 */
    artistpictures?: {
        languagetype?: string;
        filename?: string;
        main?: boolean;
    }[];
}

/** アルバム情報のJSON形式 */
export interface AlbumInfo extends BaseInfo {
    /** アルバムを識別するUUID */
    albumuuid?: string;
    /** アルバム作成を担当した、またはアルバム内の主なアーティスト一覧 */
    artists?: InfoInArtist[];
    /** アルバムに登録されている曲一覧 */
    musicsuuid?: string[];
    /** アルバム名 */
    albumname?: string;
    /** アルバム写真 */
    albumpictures?: {
        languagetype?: string;
        filename?: string;
        main?: boolean;
    }[];
}
