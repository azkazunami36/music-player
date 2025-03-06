import HTMLGeneratorHub from "./js/HTMLGeneratorHub.js";

const button = new HTMLGeneratorHub.HTMLButtonGenerator();

button.text = "テスト";
button.click(() => {
    console.log("クリックされました");
})

document.body.appendChild(button.html);

let status = false;

setInterval(() => {
    status = !status;
    if (status) {
        button.border = false;
    } else button.border = true;
}, 1000);
