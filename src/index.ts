import HTMLGeneratorHub from "./js/HTMLGeneratorHub.js";

const button = new HTMLGeneratorHub.HTMLButtonGenerator();

button.text = "テスト";
button.click(() => {
    console.log("クリックされました");
})

document.body.appendChild(button.html);
