/**
 * さまざまなHTML要素(オブジェクト)を作成するクラスのベースです。
 * このクラスを継承して、さまざまなHTML要素(オブジェクト)を作成します。
 */
export class HTMLGenereatorMaster {
    /** cssフォルダ内のファイル名です。 */
    #cssFileName;
    /** 初期化します。もし同じCSSファイルがheadに追加されていなかったら追加します。IDで識別します。 */
    constructor(cssFileName) {
        this.#cssFileName = cssFileName;
        const id = "css_" + this.#cssFileName;
        if (!document.getElementById(id)) {
            const link = document.createElement("link");
            link.id = id;
            link.rel = "stylesheet";
            link.href = "./css/" + this.#cssFileName;
            document.head.appendChild(link);
        }
    }
}
