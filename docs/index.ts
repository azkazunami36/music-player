import HTMLGeneratorHub from "./js/HTMLGeneratorHub.js";

const button = new HTMLGeneratorHub.HTMLButtonGenerator();

button.text = "テスト";
button.click(() => {
    button.border = !button.border;
})

document.body.appendChild(button.html);
