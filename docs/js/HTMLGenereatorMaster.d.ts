/**
 * さまざまなHTML要素(オブジェクト)を作成するクラスのベースです。
 * このクラスを継承して、さまざまなHTML要素(オブジェクト)を作成します。
 */
export declare class HTMLGenereatorMaster {
    #private;
    /** 初期化します。もし同じCSSファイルがheadに追加されていなかったら追加します。IDで識別します。 */
    constructor(cssFileName: string);
}
