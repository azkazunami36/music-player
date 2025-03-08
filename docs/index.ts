import HTMLGeneratorHub from "./js/HTMLGeneratorHub.js";

const button = new HTMLGeneratorHub.HTMLButtonGenerator();

button.text = "テスト";
button.imageURL = "IMG_4712.png";
button.click(() => { button.border = !button.border; });

document.body.appendChild(button.html);
