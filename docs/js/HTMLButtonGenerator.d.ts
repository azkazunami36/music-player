import { HTMLGenereatorMaster } from "./HTMLGenereatorMaster.js";
/**
 * ボタンを作成します。
 */
export declare class HTMLButtonGenerator extends HTMLGenereatorMaster {
    #private;
    constructor();
    set imageURL(imageURL: string);
    set text(text: string);
    get html(): HTMLButtonElement;
    click(callback: () => void): void;
}
