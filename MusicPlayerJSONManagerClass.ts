import fs from "fs";
import { randomUUID } from "crypto";

/** アートワーク情報です。ファイル名がアートワークであることを証明します。 */
export interface Artwork {
    /** 国 */
    lang: string;
    /** ファイル名(画像または動画。動画の場合はループ再生される。) */
    file: string;
    /** サムネイルとして優先的に使用されるかどうか。同じ国で２つtrueが存在したら、先に見つけた方が使用される。存在しない場合は利用者の国を優先的に一番最初に見つけたものが使用される。 */
    main: boolean;
}

/** 歌詞情報です。 */
export interface Lyrics {
    /** 国 */
    lang: string;
    /** 
     * 独自の歌詞情報。細かな仕様があるため、注意してJSONを構築する必要がある。
     * bodyは行毎に配列を分ける必要がある。１つの配列にまとめると、1行と判断されてしまう。
     */
    body: {
        /** 歌詞の細かな分かれ。配列毎にスペースで区切られる。１部の表示環境では改行され、見やすく表示される場合がある。 */
        phrases: {
            /** 単語毎などの情報。ここには細かな制約はないが、ルビを振るために区切ることができる。１つにまとめても良い。 */
            str: {
                /** 文字列 */
                text: string;
                /** ルビ */
                ruby?: string;
            }[];
            /** 歌詞が強調表示されるタイミングを決める。細かく設定し、カラオケ等でどこまで歌われているかのタイミングを設定する。 */
            timing: {
                /** ms単位でのタイミング */
                time: number;
                /** このタイミングでの歌詞の進んでいる場所を文字数で設定する。文字数より多く超える場合はすべて明るく表示されるだけになる。ルビなどがある場合、小数を利用して表現することができる。 */
                emphasis: number;
            }[];
        }[];
        /** この歌詞を歌っているアーティスト */
        artist?: string;
        /** 歌詞の種類。歌手の歌っている歌詞か、あまり強調されない歌詞かの違い。またはそれ以外であるか。指定がない場合mainとなる。 */
        type?: "main" | "chorus" | "other";
        /** 実際の曲のms単位に併せて、この歌詞がいつ表示されるかを設定できる。ただ、この設定が正しく反映されるとも限らない(string内のタイミングが最優先される)。これがあることにより、歌詞がないタイミングは間奏とみなされる。 */
        timing?: {
            /** この歌詞が表示されるタイミング */
            startTime: number;
            /** この歌詞が非表示になるタイミング */
            endTime: number;
        };
        /** フレーズ番号。これを設定すると歌詞の全体表示時に段落ごとに分けられる。0から始まる。もしtiming情報と一致しない場合、timing情報を優先に分析され、前後のフレーズ番号に近い方に段落が作られる。 */
        phraseNumber: number;
    }[];
    /** 歌詞を作成したアーティスト */
    artist?: string;
};

/** ミュージックプレイヤーのベース情報です。JSONで記録されます。 */
export interface musicplayerJSON {
    /** アルバムリスト */
    albums: {
        /** 識別UUID */
        uuid: string;
        /** 公式情報であるかどうか。これはサーバー管理主またはプログラム実行主が決める。これがtrueである場合、生情報を直接ほかのユーザーが変更することが出来なくなり、ユーザーが変更を試みるとユーザー毎の差分情報が作成される。 */
        officialInfo: boolean;
        /** 情報の作成主のUUID。この情報の持ち主であり管理主となる。officialInfoがtrueの場合は自動的に管理者の所有物となる。 */
        infoAuthor: string;
        /** アルバムに関連付ける曲 */
        musics: string[];
        /** アルバムに携わるアーティストUUID(複数可) */
        artist: string[];
        /** 「feat.」のアーティスト、つまり出演者またはゲスト、客演しているアーティストのUUID(複数可) */
        featuringArtist: string[];
        /** リミックス元のアルバムのUUID(アルバム自体の構造が似通っている場合にのみ設定) */
        remixAlbum?: string;
        /** カバー元の曲のUUID(アルバム自体の構造が似通っている場合にのみ設定) */
        coverAlbum?: string;
        /** このミュージックプレイヤーに追加した時間(JavaScriptのUTCタイムスタンプ) */
        addedDate: number;
        /** このアルバムが作成・公開された時間 */
        createDate: {
            /** 年 */
            year?: number;
            /** 月 */
            month?: number;
            /** 日 */
            day?: number;
            /** JavaScriptのUTCタイムスタンプ */
            rawTime?: number;
        }
        /** アルバムのアートワーク(地域毎) */
        albumArtwork: Artwork[];
        /** アルバムのタイトル(地域毎) */
        title: {
            /** 国 */
            lang: string;
            /** タイトル名 */
            name: string;
            /** 読み仮名(地域毎) */
            titleReadChar: {
                /** 国 */
                lang?: string;
                /** 読み */
                char?: string;
            }[];
        }[];
        /** アルバムのジャンル */
        genre: string[];
    }[];
    /** アーティストリスト */
    artists: {
        /** 識別UUID */
        uuid: string;
        /** 公式情報であるかどうか。これはサーバー管理主またはプログラム実行主が決める。これがtrueである場合、生情報を直接ほかのユーザーが変更することが出来なくなり、ユーザーが変更を試みるとユーザー毎の差分情報が作成される。 */
        officialInfo: boolean;
        /** 情報の作成主のUUID。この情報の持ち主であり管理主となる。officialInfoがtrueの場合は自動的に管理者の所有物となる。 */
        infoAuthor: string;
        /** このミュージックプレイヤーに追加した時間(JavaScriptのUTCタイムスタンプ) */
        addedDate: number;
        /** アーティストに関連付けるアルバム */
        albums: string[];
        /** アーティストのキャラクターボイスアーティストのUUID(通常一人だが、必要に応じて複数可) */
        characterVoice: string[];
        /** アーティストのアートワーク(地域毎) */
        artistArtwork: Artwork[];
        /** アーティストの名前(地域毎) */
        name: {
            /** 国 */
            lang: string;
            /** 名前 */
            name: string;
            /** 読み仮名(地域毎) */
            nameReadChar: {
                /** 国 */
                lang?: string;
                /** 読み */
                char?: string;
            }[];
        }[];
    }[];
    /** ミュージックリスト */
    musics: {
        /** 識別UUID */
        uuid: string;
        /** 公式情報であるかどうか。これはサーバー管理主またはプログラム実行主が決める。これがtrueである場合、生情報を直接ほかのユーザーが変更することが出来なくなり、ユーザーが変更を試みるとユーザー毎の差分情報が作成される。 */
        officialInfo: boolean;
        /** 情報の作成主のUUID。この情報の持ち主であり管理主となる。officialInfoがtrueの場合は自動的に管理者の所有物となる。 */
        infoAuthor: string;
        /** ミュージックに携わるアーティストUUID(複数可)(指定がない場合アルバムに統一される) */
        artist: string[];
        /** 「feat.」のアーティスト、つまり出演者またはゲスト、客演しているアーティストのUUID(複数可) */
        featuringArtist: string[];
        /** リミックス元の曲のUUID */
        remixMusic?: string;
        /** カバー元の曲のUUID */
        coverMusic?: string;
        /** このミュージックプレイヤーに追加した時間(JavaScriptのUTCタイムスタンプ) */
        addedDate: number;
        /** この曲が作成・公開された時間(設定されていない場合アルバムに統一される) */
        createDate: {
            /** 年 */
            year?: number;
            /** 月 */
            month?: number;
            /** 日 */
            day?: number;
            /** JavaScriptのUTCタイムスタンプ */
            rawTime?: number;
        }
        /** ミュージック毎のアートワーク(地域毎) */
        musicArtwork: Artwork[];
        /** ミュージックのタイトル(地域毎) */
        title: {
            /** 国 */
            lang: string;
            /** タイトル名 */
            name: string;
            /** 読み仮名(地域毎) */
            titleReadChar: {
                /** 国 */
                lang?: string;
                /** 読み */
                char?: string;
            }[];
        }[];
        /** ミュージックのジャンル(指定がない場合アルバムに統一される) */
        genre: string[];
        /** ミュージックの歌詞 */
        lyrics: Lyrics[];
        music: {
            /** ファイル名(曲である必要がある。) */
            file: string;
            /** 国 */
            lang: string;
            /** その曲に登場するアーティスト。わからない場合は空にする。 */
            artist: string[];
            /** 音声の種類 */
            type: "normal" | "vocal" | "instrumental" | "other";
            /** マスター音源であるかどうか。マスター音源を基準に曲の開始や終了を決める。複数がtrueの場合、配列の最初に近いものがマスターとなる。存在しない場合は必然的に最初のオブジェクトがマスターになる。 */
            master: boolean;
            /** 
             * 音声のタイミングをマスター音源と合わせるためのもの。マスター音源の場合にこの設定をした場合、音声の末尾の無駄な無音をトリミングしたりするのに使うことができる。
             * マスター音源ではない場合、スタート時間のみの設定でずれを補正し、音源の終了時間をマスター音源に合わせることができる。
             */
            delayCorrection: {
                /** 音源再生開始のずれ補正。負の値も可能。 */
                startTime?: number;
                /** マスター音源の場合のみ適用可能設定。曲の終了時間を調整できる。マスター音源ではない場合、この設定は無視される。 */
                endTime?: number;
            };
        }[];
        video: {
            /** ファイル名(動画である必要がある。) */
            file: string;
            /** 国 */
            lang: string;
            /** その曲に登場するアーティスト。わからない場合は空にする。 */
            artist: string[];
            /** 動画の種類 */
            type: "musicvideo" | "movie" | "other";
            /** マスター動画であるかどうか。マスター動画を基準に曲の開始や終了を決める。複数がtrueの場合、配列の最初に近いものがマスターとなる。存在しない場合は必然的に最初のオブジェクトがマスターになる。 */
            master: boolean;
            /** 
             * 動画のタイミングをマスター動画と合わせるためのもの。マスター動画の場合にこの設定をした場合、動画の末尾の無駄な無音をトリミングしたりするのに使うことができる。そして、音声と動画のずれを補正することができる。
             * マスター動画ではない場合、スタート時間のみの設定でずれを補正し、動画の終了時間をマスター動画に合わせることができる。
             */
            delayCorrection: {
                /** 動画再生開始のずれ補正。負の値も可能。 */
                startTime?: number;
                /** マスター動画の場合のみ適用可能設定。曲の終了時間を調整できる。マスター動画ではない場合、この設定は無視される。 */
                endTime?: number;
            };
        }[];
    }[];
    /** プレイリストリスト */
    playlists: {
        /** 識別UUID */
        uuid: string;
        /** 公式情報であるかどうか。これはサーバー管理主またはプログラム実行主が決める。これがtrueである場合、生情報を直接ほかのユーザーが変更することが出来なくなり、ユーザーが変更を試みるとユーザー毎の差分情報が作成される。 */
        officialInfo: boolean;
        /** 情報の作成主のUUID。この情報の持ち主であり管理主となる。officialInfoがtrueの場合は自動的に管理者の所有物となる。 */
        infoAuthor: string;
        /** このミュージックプレイヤーに追加した時間(JavaScriptのUTCタイムスタンプ) */
        addedDate: number;
        /** プレイリスト名 */
        name?: string;
        /** 説明 */
        description?: string;
        /** プレイリストの曲 */
        musics: {
            uuid: string;
            type: "music" | "video";
            number: number;
        }[];
    }[];
    /** ファイルリスト */
    files: {
        /** 識別名(ファイル名) */
        name: string;
        /** 説明 */
        description?: string;
        /** 公式情報であるかどうか。これはサーバー管理主またはプログラム実行主が決める。これがtrueである場合、生情報を直接ほかのユーザーが変更することが出来なくなり、ユーザーが変更を試みるとユーザー毎の差分情報が作成される。 */
        officialInfo: boolean;
        /** 情報の作成主のUUID。この情報の持ち主であり管理主となる。officialInfoがtrueの場合は自動的に管理者の所有物となる。 */
        infoAuthor: string;
        /** このミュージックプレイヤーに追加した時間(JavaScriptのUTCタイムスタンプ) */
        addedDate: number;
        ffmpegInfo?: {

        }
        /**
         * 取得元です。正しく取得している場合劣化は少ないですが、オリジナル度が低い場合、最悪のケースだと劣化が激しいです。
         * onlineVideoService: オンライン動画サービスから(YouTube、niconicoなど) - オリジナル度1 再エンコードされているため、劣化が少し生じる。再エンコードした場合はこの部類となる
         * analogRecording: 音源からアナログ録音したもの - オリジナル度1 アナログ収録のため、劣化が少し生じる
         * onlineMusicService: オンライン音楽サービスから(Apple Music、Spotifyなど) - オリジナル度2 音楽サービスとして公開されているため劣化は少ない
         * digitalRecording: 音源から録音したもの - オリジナル度2 デジタル収録のため、劣化は少ない
         * CD: CDなどの音源から - オリジナル度3 視聴するための音源であるため、劣化は少ない
         * downloadFile: ダウンロードしたファイルから(SoundCloudやフリー音源サイトなどの未改変音源) - オリジナル度4 オリジナルに近いため、劣化は少ない
         * original: オリジナルの音源(自作音源など) - オリジナル度5 オリジナルであるため、劣化はない
         * other: その他
         */
        importSource: "onlineVideoService" | "analogRecording" | "onlineMusicService" | "digitalRecording" | "CD" | "downloadFile" | "original" | "other";
        /** ダウンロード元のURL */
        originalURL: {
            /** YouTubeの場合、VideoIDを入力 */
            videoId?: string;
            /** YouTube以外からの場合はURLを入力 */
            downloadURL?: string;
        }
    }[];
    /** ユーザーリスト */
    users: {
        /** 識別UUID */
        uuid: string;
        /** ユーザー名 */
        name: string;
        /** ユーザーが見ることのできるアルバムUUID(権限) */
        viewAlbums: string[];
        /** ユーザーが見ることのできるアーティストUUID(権限) */
        viewArtists: string[];
        /** ユーザーが見ることのできるミュージックUUID(権限) */
        viewMusics: string[];
        /** ユーザーが見ることのできるプレイリストUUID(権限) */
        viewPlaylists: string[];
        /** ユーザーが見ることのできるファイル名(権限) */
        viewFiles: string[];
    }[];
}

/** 変数がアルバムのUUIDであることを証明します。 */
export interface AlbumUUID {
    type: "album";
    uuid: string;
}

/** 変数がアーティストのUUIDであることを証明します。 */
export interface ArtistUUID {
    type: "artist";
    uuid: string;
}

/** 変数がミュージックのUUIDであることを証明します。 */
export interface MusicUUID {
    type: "music";
    uuid: string;
}

/** 変数がプレイリストのUUIDであることを証明します。 */
export interface PlaylistUUID {
    type: "playlist";
    uuid: string;
}

/** 変数がファイル名であることを証明します。 */
export interface FileName {
    type: "file";
    name: string;
}

/** 変数がユーザーのUUIDであることを証明します。 */
export interface UserUUID {
    type: "user";
    uuid: string;
}

/** 変数が曲のストリームにアクセスする情報であることを証明します。 */
export interface MusicStream {
    type: "musicStream";
    number: number;
    musicUUID: MusicUUID;
}

/** 変数が動画のストリームにアクセスする情報であることを証明します。 */
export interface VideoStream {
    type: "videoStream";
    number: number;
    musicUUID: MusicUUID;
}

/** ミュージックプレイヤーJSONを正しく管理するAPIです。JSON内の型定義の乱れや整合性に欠けている状態であってもエラーを回避します。必要に応じて修復することも可能です。 */
export class MusicPlayerJSONManagerClass {
    json: musicplayerJSON;
    constructor() {
        this.json = fs.existsSync("musicplayer.json") ? JSON.parse(String(fs.readFileSync("musicplayer.json"))) : {
            albums: [],
            artists: [],
            musics: [],
            playlists: [],
            files: [],
            users: []
        };
    }
    /** JSONを保存します。 */
    save() {
        fs.writeFileSync("musicplayer.json", JSON.stringify(this.json));
    }
    /** アルバムを作成します。 */
    createAlbum(info: {
        userUUID: UserUUID;
        lang: string;
        title?: string;
    }): AlbumUUID {
        const uuid = randomUUID();
        const date = new Date();
        this.json.albums.push({
            uuid: uuid,
            officialInfo: false,
            infoAuthor: info.userUUID.uuid,
            musics: [],
            artist: [],
            featuringArtist: [],
            addedDate: date.getTime(),
            createDate: {},
            albumArtwork: [],
            title: [],
            genre: []
        });
        if (info.title) this.json.albums.find((album) => album.uuid === uuid)?.title.push({
            lang: info.lang,
            name: info.title,
            titleReadChar: []
        });
        return {
            type: "album",
            uuid: uuid
        };
    }
    /** アーティストを作成します。 */
    createArtist(info: {
        userUUID: UserUUID;
        lang: string;
        name?: string;
    }): ArtistUUID {
        const uuid = randomUUID();
        const date = new Date();
        this.json.artists.push({
            uuid: uuid,
            officialInfo: false,
            infoAuthor: info.userUUID.uuid,
            addedDate: date.getTime(),
            albums: [],
            characterVoice: [],
            artistArtwork: [],
            name: [],
        });
        if (info.name) this.json.artists.find((artist) => artist.uuid === uuid)?.name.push({
            lang: info.lang,
            name: info.name,
            nameReadChar: []
        });
        return {
            type: "artist",
            uuid: uuid
        };
    }
    /** ミュージックを作成します。 */
    createMusic(info: {
        userUUID: UserUUID;
        lang: string;
        title?: string;
    }): MusicUUID {
        const uuid = randomUUID();
        const date = new Date();
        this.json.musics.push({
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
        if (info.title) this.json.musics.find((music) => music.uuid === uuid)?.title.push({
            lang: info.lang,
            name: info.title,
            titleReadChar: []
        });
        return {
            type: "music",
            uuid: uuid
        };
    }
    /** プレイリストを作成します。 */
    createPlaylist(info: {
        userUUID: UserUUID;
        name?: string;
    }): PlaylistUUID {
        const uuid = randomUUID();
        const date = new Date();
        this.json.playlists.push({
            uuid: uuid,
            officialInfo: false,
            infoAuthor: info.userUUID.uuid,
            addedDate: date.getTime(),
            name: info.name,
            description: "",
            musics: []
        });
        return {
            type: "playlist",
            uuid: uuid
        };
    }
    /** ファイルを追加します。 */
    addFile(info: {
        userUUID: UserUUID;
        name: string;
        importSource: "onlineVideoService" | "analogRecording" | "onlineMusicService" | "digitalRecording" | "CD" | "downloadFile" | "original" | "other";
        originalURL: {
            videoId?: string;
            downloadURL?: string;
        }
    }): FileName {
        const date = new Date();
        this.json.files.push({
            name: info.name,
            officialInfo: false,
            infoAuthor: info.userUUID.uuid,
            addedDate: date.getTime(),
            ffmpegInfo: {},
            importSource: info.importSource,
            originalURL: info.originalURL
        });
        return {
            type: "file",
            name: info.name
        };
    }
    /** アルバムを削除します。 */
    deleteAlbum(info: {
        userUUID: UserUUID;
        albumUUID: AlbumUUID;
    }) {
        const index = this.json.albums.findIndex(album => album.uuid === info.albumUUID.uuid);
        if (index !== -1) { this.json.albums.splice(index, 1); }
        return true;
    }
    /** アーティストを削除します。 */
    deleteArtist(info: {
        userUUID: UserUUID;
        artistUUID: ArtistUUID;
    }) {
        const index = this.json.artists.findIndex(artist => artist.uuid === info.artistUUID.uuid);
        if (index !== -1) { this.json.artists.splice(index, 1); }
        return true;
    }
    /** ミュージックを削除します。 */
    deleteMusic(info: {
        userUUID: UserUUID;
        musicUUID: MusicUUID;
    }) {
        const index = this.json.musics.findIndex(music => music.uuid === info.musicUUID.uuid);
        if (index !== -1) { this.json.musics.splice(index, 1); }
        return true;
    }
    /** プレイリストを削除します。 */
    deletePlaylist(info: {
        userUUID: UserUUID;
        playlistUUID: PlaylistUUID;
    }) {
        const index = this.json.playlists.findIndex(playlist => playlist.uuid === info.playlistUUID.uuid);
        if (index !== -1) { this.json.playlists.splice(index, 1); }
        return true;
    }
    /** ファイルを削除します。 */
    deleteFile(info: {
        userUUID: UserUUID;
        name: FileName;
    }) {
        const index = this.json.files.findIndex(file => file.name === info.name.name);
        if (index !== -1) { this.json.files.splice(index, 1); }
        return true;
    }
    /** アルバムを編集します。 */
    editAlbum(info: {
        userUUID: UserUUID;
        albumUUID: AlbumUUID;
    }) {
        class EditAlbum {
            #info: {
                userUUID: UserUUID;
                albumUUID: AlbumUUID;
            }
            #MusicPlayerJSONManager;
            constructor(info: {
                userUUID: UserUUID;
                albumUUID: AlbumUUID;
            }, MusicPlayerJSONManager: MusicPlayerJSONManagerClass) {
                this.#info = info;
                this.#MusicPlayerJSONManager = MusicPlayerJSONManager;
            }
            /** タイトルをセットします。言語ごとに設定します。 */
            setTitle(name: string, lang: string) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    if (album.title.find(title => title.lang === lang)) {
                        album.title.find(title => title.lang === lang)!.name = name;
                    } else {
                        album.title.push({
                            lang: lang,
                            name: name,
                            titleReadChar: []
                        });
                    }
                    return true;
                } else {
                    return false;
                }
            }
            /** タイトルを削除します。 */
            removeTitle(lang: string) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    const index = album.title.findIndex(title => title.lang === lang);
                    if (index !== -1) { album.title.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** アーティストを追加します。 */
            addArtist(artistUUID: ArtistUUID) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    album.artist.push(artistUUID.uuid);
                    return true;
                } else {
                    return false;
                }
            }
            /** アーティストを削除します。 */
            removeArtist(artistUUID: ArtistUUID) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    const index = album.artist.findIndex(artist => artist === artistUUID.uuid);
                    if (index !== -1) { album.artist.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** 曲を追加します。 */
            addMusic(musicUUID: MusicUUID) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    album.musics.push(musicUUID.uuid);
                    return true;
                } else {
                    return false;
                }
            }
            /** 曲を削除します。 */
            removeMusic(musicUUID: MusicUUID) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    const index = album.musics.findIndex(music => music === musicUUID.uuid);
                    if (index !== -1) { album.musics.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** アルバムアートワークを追加します。 */
            addAlbumArtwork(artwork: Artwork) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    album.albumArtwork.push(artwork);
                    return true;
                } else {
                    return false;
                }
            }
            /** アルバムアートワークを削除します。 */
            removeAlbumArtwork(artwork: Artwork) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    const index = album.albumArtwork.findIndex(art => art.file === artwork.file);
                    if (index !== -1) { album.albumArtwork.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** ジャンルを追加します。 */
            addGenre(genre: string) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    album.genre.push(genre);
                    return true;
                } else {
                    return false;
                }
            }
            /** ジャンルを削除します。 */
            removeGenre(genre: string) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    const index = album.genre.findIndex(g => g === genre);
                    if (index !== -1) { album.genre.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** ジャンルを設定します。addと違い置き換えます。 */
            setGenre(genre: string[]) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    album.genre = genre;
                    return true;
                } else {
                    return false;
                }
            }
            /** 作成日時を設定します。 */
            setCreateDate(createDate: {
                year?: number;
                month?: number;
                day?: number;
                rawTime?: number;
            }) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    if (createDate.year) album.createDate.year = createDate.year;
                    if (createDate.month) album.createDate.month = createDate.month;
                    if (createDate.day) album.createDate.day = createDate.day;
                    if (createDate.rawTime) album.createDate.rawTime = createDate.rawTime;
                    return true;
                } else {
                    return false;
                }
            }
            /** タイトルの読み仮名を設定します。タイトルの言語を指定したのちcharlangで読み仮名の言語を入力し、設定します。 */
            setTitleReadChar(lang: string, char: string, charlang: string) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    if (album.title.find(title => title.lang === lang)) {
                        album.title.find(title => title.lang === lang)!.titleReadChar.push({
                            lang: charlang,
                            char: char
                        });
                    } else {
                        album.title.push({
                            lang: lang,
                            name: "",
                            titleReadChar: [{
                                lang: charlang,
                                char: char
                            }]
                        });
                    }
                    return true;
                } else {
                    return false;
                }
            }
            /** タイトルの読み仮名を削除します。 */
            deleteTitleReadChar(lang: string, charlang: string) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    const title = album.title.find(title => title.lang === lang);
                    if (title) {
                        const index = title.titleReadChar.findIndex(char => char.lang === charlang);
                        if (index !== -1) { title.titleReadChar.splice(index, 1); }
                    } else {
                        return false;
                    }
                    return true;
                } else {
                    return false;
                }
            }
            /** 「feat.」のアーティスト、つまり出演者またはゲスト、客演しているアーティストを追加します。 */
            addFeaturingArtist(artistUUID: ArtistUUID) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    album.featuringArtist.push(artistUUID.uuid);
                    return true;
                } else {
                    return false;
                }
            }
            /** 「feat.」のアーティスト、つまり出演者またはゲスト、客演しているアーティストを削除します。 */
            removeFeaturingArtist(artistUUID: ArtistUUID) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    const index = album.featuringArtist.findIndex(artist => artist === artistUUID.uuid);
                    if (index !== -1) { album.featuringArtist.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** 「feat.」のアーティスト、つまり出演者またはゲスト、客演しているアーティストを設定します。addと違い置き換えます。 */
            setFeaturingArtist(artistUUID: ArtistUUID[]) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    album.featuringArtist = artistUUID.map(artist => artist.uuid);
                    return true;
                } else {
                    return false;
                }
            }
            /** リミックス元のアルバムを設定します。 */
            setRemixAlbum(albumUUID: AlbumUUID) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    album.remixAlbum = albumUUID.uuid;
                    return true;
                } else {
                    return false;
                }
            }
            /** リミックス元のアルバムを削除します。 */
            deleteRemixAlbum() {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    album.remixAlbum = undefined;
                    return true;
                } else {
                    return false;
                }
            }
            /** カバー元のアルバムを設定します。 */
            setCoverAlbum(albumUUID: AlbumUUID) {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    album.coverAlbum = albumUUID.uuid;
                    return true;
                } else {
                    return false;
                }
            }
            /** カバー元のアルバムを削除します。 */
            deleteCoverAlbum() {
                const album = this.#MusicPlayerJSONManager.json.albums.find(album => album.uuid === this.#info.albumUUID.uuid);
                if (album) {
                    album.coverAlbum = undefined;
                    return true;
                } else {
                    return false;
                }
            }
        }
        return new EditAlbum(info, this);
    }
    /** アーティストを編集します。 */
    editArtist(info: {
        userUUID: UserUUID;
        artistUUID: ArtistUUID;
    }) {
        class EditArtist {
            #info: {
                userUUID: UserUUID;
                artistUUID: ArtistUUID;
            }
            #MusicPlayerJSONManager;
            constructor(info: {
                userUUID: UserUUID;
                artistUUID: ArtistUUID;
            }, MusicPlayerJSONManager: MusicPlayerJSONManagerClass) {
                this.#info = info;
                this.#MusicPlayerJSONManager = MusicPlayerJSONManager;
            }
            /** アーティスト名をセットします。言語ごとに設定します。 */
            setName(name: string, lang: string) {
                const artist = this.#MusicPlayerJSONManager.json.artists.find(artist => artist.uuid === this.#info.artistUUID.uuid);
                if (artist) {
                    if (artist.name.find(name => name.lang === lang)) {
                        artist.name.find(name => name.lang === lang)!.name = name;
                    } else {
                        artist.name.push({
                            lang: lang,
                            name: name,
                            nameReadChar: []
                        });
                    }
                    return true;
                } else {
                    return false;
                }
            }
            /** アーティスト名を削除します。 */
            removeName(lang: string) {
                const artist = this.#MusicPlayerJSONManager.json.artists.find(artist => artist.uuid === this.#info.artistUUID.uuid);
                if (artist) {
                    const index = artist.name.findIndex(name => name.lang === lang);
                    if (index !== -1) { artist.name.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** キャラクターボイスを追加します。 */
            addCharacterVoice(artistUUID: ArtistUUID) {
                const artist = this.#MusicPlayerJSONManager.json.artists.find(artist => artist.uuid === this.#info.artistUUID.uuid);
                if (artist) {
                    artist.characterVoice.push(artistUUID.uuid);
                    return true;
                } else {
                    return false;
                }
            }
            /** キャラクターボイスを削除します。 */
            removeCharacterVoice(artistUUID: ArtistUUID) {
                const artist = this.#MusicPlayerJSONManager.json.artists.find(artist => artist.uuid === this.#info.artistUUID.uuid);
                if (artist) {
                    const index = artist.characterVoice.findIndex(voice => voice === artistUUID.uuid);
                    if (index !== -1) { artist.characterVoice.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** アーティストアートワークを追加します。 */
            addArtistArtwork(artwork: Artwork) {
                const artist = this.#MusicPlayerJSONManager.json.artists.find(artist => artist.uuid === this.#info.artistUUID.uuid);
                if (artist) {
                    artist.artistArtwork.push(artwork);
                    return true;
                } else {
                    return false;
                }
            }
            /** アーティストアートワークを削除します。 */
            removeArtistArtwork(artwork: Artwork) {
                const artist = this.#MusicPlayerJSONManager.json.artists.find(artist => artist.uuid === this.#info.artistUUID.uuid);
                if (artist) {
                    const index = artist.artistArtwork.findIndex(art => art.file === artwork.file);
                    if (index !== -1) { artist.artistArtwork.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** 名前の読み仮名を設定します。名前の言語を指定したのちcharlangで読み仮名の言語を入力し、設定します。 */
            setNameReadChar(lang: string, char: string, charlang: string) {
                const artist = this.#MusicPlayerJSONManager.json.artists.find(artist => artist.uuid === this.#info.artistUUID.uuid);
                if (artist) {
                    if (artist.name.find(name => name.lang === lang)) {
                        artist.name.find(name => name.lang === lang)!.nameReadChar.push({
                            lang: charlang,
                            char: char
                        });
                    } else {
                        artist.name.push({
                            lang: lang,
                            name: "",
                            nameReadChar: [{
                                lang: charlang,
                                char: char
                            }]
                        });
                    }
                    return true;
                } else {
                    return false;
                }
            }
            /** 名前の読み仮名を削除します。 */
            deleteNameReadChar(lang: string, charlang: string) {
                const artist = this.#MusicPlayerJSONManager.json.artists.find(artist => artist.uuid === this.#info.artistUUID.uuid);
                if (artist) {
                    const name = artist.name.find(name => name.lang === lang);
                    if (name) {
                        const index = name.nameReadChar.findIndex(char => char.lang === charlang);
                        if (index !== -1) { name.nameReadChar.splice(index, 1); }
                    } else {
                        return false;
                    }
                    return true;
                } else {
                    return false;
                }
            }
        }
        return new EditArtist(info, this);
    }
    /** ミュージックを編集します。 */
    editMusic(info: {
        userUUID: UserUUID;
        musicUUID: MusicUUID;
    }) {
        class EditMusic {
            #info: {
                userUUID: UserUUID;
                musicUUID: MusicUUID;
            }
            #MusicPlayerJSONManager;
            constructor(info: {
                userUUID: UserUUID;
                musicUUID: MusicUUID;
            }, MusicPlayerJSONManager: MusicPlayerJSONManagerClass) {
                this.#info = info;
                this.#MusicPlayerJSONManager = MusicPlayerJSONManager;
            }
            /** タイトルをセットします。言語ごとに設定します。 */
            setTitle(name: string, lang: string) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    if (music.title.find(title => title.lang === lang)) {
                        music.title.find(title => title.lang === lang)!.name = name;
                    } else {
                        music.title.push({
                            lang: lang,
                            name: name,
                            titleReadChar: []
                        });
                    }
                    return true;
                } else {
                    return false;
                }
            }
            /** タイトルを削除します。 */
            removeTitle(lang: string) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    const index = music.title.findIndex(title => title.lang === lang);
                    if (index !== -1) { music.title.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** アーティストを追加します。 */
            addArtist(artistUUID: ArtistUUID) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    music.artist.push(artistUUID.uuid);
                    return true;
                } else {
                    return false;
                }
            }
            /** アーティストを削除します。 */
            removeArtist(artistUUID: ArtistUUID) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    const index = music.artist.findIndex(artist => artist === artistUUID.uuid);
                    if (index !== -1) { music.artist.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** 「feat.」のアーティスト、つまり出演者またはゲスト、客演しているアーティストを追加します。 */
            addFeaturingArtist(artistUUID: ArtistUUID) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    music.featuringArtist.push(artistUUID.uuid);
                    return true;
                } else {
                    return false;
                }
            }
            /** 「feat.」のアーティスト、つまり出演者またはゲスト、客演しているアーティストを削除します。 */
            removeFeaturingArtist(artistUUID: ArtistUUID) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    const index = music.featuringArtist.findIndex(artist => artist === artistUUID.uuid);
                    if (index !== -1) { music.featuringArtist.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** ジャンルを追加します。 */
            addGenre(genre: string) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    music.genre.push(genre);
                    return true;
                } else {
                    return false;
                }
            }
            /** ジャンルを削除します。 */
            removeGenre(genre: string) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    const index = music.genre.findIndex(g => g === genre);
                    if (index !== -1) { music.genre.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** ジャンルを設定します。addと違い置き換えます。 */
            setGenre(genre: string[]) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    music.genre = genre;
                    return true;
                } else {
                    return false;
                }
            }
            /** 歌詞を設定します。 */
            setLyrics(lyrics: Lyrics) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    const index = music.lyrics.findIndex(lyric => lyric.lang === lyrics.lang);
                    if (index !== -1) { music.lyrics[index] = lyrics; }
                    else { music.lyrics.push(lyrics); }
                    return true;
                } else {
                    return false;
                }
            }
            /** 歌詞を削除します。 */
            removeLyrics(lang: string) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    const index = music.lyrics.findIndex(lyric => lyric.lang === lang);
                    if (index !== -1) { music.lyrics.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** 音楽ファイルを追加します。 */
            addMusicStream(file: FileName, lang: string, type: "normal" | "vocal" | "instrumental" | "other"): MusicStream | false {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    const index = music.music.findIndex(stream => stream.file === file.name);
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
                        return {
                            type: "musicStream",
                            number: music.music.findIndex(stream => stream.file === file.name),
                            musicUUID: this.#info.musicUUID
                        };
                    }
                } else {
                    return false;
                }
            }
            /** 音楽ファイルを削除します。 */
            removeMusicStream(file: FileName) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    const index = music.music.findIndex(stream => stream.file === file.name);
                    if (index !== -1) { music.music.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** ビデオファイルを追加します。 */
            addVideoStream(file: FileName, lang: string, type: "other" | "musicvideo" | "movie"): VideoStream | false {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    const index = music.video.findIndex(stream => stream.file === file.name);
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
                        return {
                            type: "videoStream",
                            number: music.video.findIndex(stream => stream.file === file.name),
                            musicUUID: this.#info.musicUUID
                        };
                    }
                } else {
                    return false;
                }
            }
            /** ビデオファイルを削除します。 */
            removeVideoStream(file: FileName) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    const index = music.video.findIndex(stream => stream.file === file.name);
                    if (index !== -1) { music.video.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** 音楽アートワークを追加します。 */
            addMusicArtwork(artwork: Artwork) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    music.musicArtwork.push(artwork);
                    return true;
                } else {
                    return false;
                }
            }
            /** 音楽アートワークを削除します。 */
            removeMusicArtwork(artwork: Artwork) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    const index = music.musicArtwork.findIndex(art => art.file === artwork.file);
                    if (index !== -1) { music.musicArtwork.splice(index, 1); }
                    return true;
                } else {
                    return false;
                }
            }
            /** タイトルの読み仮名を設定します。タイトルの言語を指定したのちcharlangで読み仮名の言語を入力し、設定します。 */
            setTitleReadChar(lang: string, char: string, charlang: string) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    if (music.title.find(title => title.lang === lang)) {
                        music.title.find(title => title.lang === lang)!.titleReadChar.push({
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
                } else {
                    return false;
                }
            }
            /** タイトルの読み仮名を削除します。 */
            deleteTitleReadChar(lang: string, charlang: string) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    const title = music.title.find(title => title.lang === lang);
                    if (title) {
                        const index = title.titleReadChar.findIndex(char => char.lang === charlang);
                        if (index !== -1) { title.titleReadChar.splice(index, 1); }
                    } else {
                        return false;
                    }
                    return true;
                } else {
                    return false;
                }
            }
            /** 作成日時を設定します。 */
            setCreateDate(createDate: {
                year?: number;
                month?: number;
                day?: number;
                rawTime?: number;
            }) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    if (createDate.year) music.createDate.year = createDate.year;
                    if (createDate.month) music.createDate.month = createDate.month;
                    if (createDate.day) music.createDate.day = createDate.day;
                    if (createDate.rawTime) music.createDate.rawTime = createDate.rawTime;
                    return true;
                } else {
                    return false;
                }
            }
            /** リミックス元の曲を設定します。 */
            setRemixMusic(musicUUID: MusicUUID) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    music.remixMusic = musicUUID.uuid;
                    return true;
                } else {
                    return false;
                }
            }
            /** リミックス元の曲を削除します。 */
            deleteRemixMusic() {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    music.remixMusic = undefined;
                    return true;
                } else {
                    return false;
                }
            }
            /** カバー元の曲を設定します。 */
            setCoverMusic(musicUUID: MusicUUID) {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    music.coverMusic = musicUUID.uuid;
                    return true;
                } else {
                    return false;
                }
            }
            /** カバー元の曲を削除します。 */
            deleteCoverMusic() {
                const music = this.#MusicPlayerJSONManager.json.musics.find(music => music.uuid === this.#info.musicUUID.uuid);
                if (music) {
                    music.coverMusic = undefined;
                    return true;
                } else {
                    return false;
                }
            }
        }
        return new EditMusic(info, this);
    }
    /** プレイリストを編集します。 */
    editPlaylist(info: {
        userUUID: UserUUID;
        playlistUUID: PlaylistUUID;
    }) {
        class EditPlaylist {
            #info: {
                userUUID: UserUUID;
                playlistUUID: PlaylistUUID;
            }
            #MusicPlayerJSONManager;
            constructor(info: {
                userUUID: UserUUID;
                playlistUUID: PlaylistUUID;
            }, MusicPlayerJSONManager: MusicPlayerJSONManagerClass) {
                this.#info = info;
                this.#MusicPlayerJSONManager = MusicPlayerJSONManager;
            }
            /** プレイリスト名をセットします。 */
            setName(name: string) {
                const playlist = this.#MusicPlayerJSONManager.json.playlists.find(playlist => playlist.uuid === this.#info.playlistUUID.uuid);
                if (playlist) {
                    playlist.name = name;
                    return true;
                } else {
                    return false;
                }
            }
            /** 説明を設定します。 */
            setDescription(description: string) {
                const playlist = this.#MusicPlayerJSONManager.json.playlists.find(playlist => playlist.uuid === this.#info.playlistUUID.uuid);
                if (playlist) {
                    playlist.description = description;
                    return true;
                } else {
                    return false;
                }
            }
            /** 曲を追加します。 */
            addMusic(musicUUID: MusicUUID, streamNumber: number, type: "music" | "video") {
                const playlist = this.#MusicPlayerJSONManager.json.playlists.find(playlist => playlist.uuid === this.#info.playlistUUID.uuid);
                if (playlist) {
                    playlist.musics.push({
                        uuid: musicUUID.uuid,
                        number: streamNumber,
                        type: type
                    });
                    return true;
                } else {
                    return false;
                }
            }
            /** 曲を削除します。 */
            removeMusic(index: number) {
                const playlist = this.#MusicPlayerJSONManager.json.playlists.find(playlist => playlist.uuid === this.#info.playlistUUID.uuid);
                if (playlist) {
                    if (playlist.musics[index]) {
                        playlist.musics.splice(index, 1);
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
        return new EditPlaylist(info, this);
    }
    /** ファイルを編集します。 */
    editFile(info: {
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
        }
        return new EditFile(info, this);
    }
}
