import { HTMLGenereatorMaster } from "./HTMLGenereatorMaster.js";

/**
 * ボタンを作成します。
 */
export class HTMLButtonGenerator extends HTMLGenereatorMaster {
    #buttonHtml: HTMLButtonElement;
    #mainButtonHtml: HTMLDivElement;
    #iconHtml: HTMLDivElement;
    #textHtml: HTMLDivElement;
    constructor() {
        super("Button1.css");
        // ボタンのマスター要素
        this.#buttonHtml = document.createElement("button");
        this.#buttonHtml.classList.add("Button1");
        /** ボタンの表示される要素 */
        const mainButton = document.createElement("div");
        mainButton.classList.add("Button1Main");
        this.#buttonHtml.appendChild(mainButton);
        this.#mainButtonHtml = mainButton;
        /** ボタンのアイコン */
        const icon = document.createElement("div");
        icon.classList.add("Button1Icon");
        mainButton.appendChild(icon);
        this.#iconHtml = icon;
        /** ボタンのテキスト */
        const text = document.createElement("div");
        text.classList.add("Button1Text");
        mainButton.appendChild(text);
        this.#textHtml = text;
    }
    set imageURL(imageURL: string) {
        this.#iconHtml.style.backgroundImage = `url(${imageURL})`;
    }
    set text(text: string) {
        this.#textHtml.textContent = text;
    }
    get html() {
        return this.#buttonHtml;
    }
    click(callback: () => void) {   
        this.#mainButtonHtml.onclick = callback;
    }
    set border(boolean: boolean) {
        if (this.#mainButtonHtml.classList.contains("border") === boolean) return;
        this.#mainButtonHtml.classList.toggle("border");
    }
    get border() {
        return this.#mainButtonHtml.classList.contains("border");
    }
}
