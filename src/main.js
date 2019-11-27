"use strict"

const btnSubmit = document.getElementById('btn-submit');
const uploader = document.getElementById('uploader');
const resultField = document.getElementById('result-field');
const modeSelect = document.getElementById('select-mode');
const rowNumber = document.getElementById('row-number');
const resultImage = document.getElementById('image-preview');

let fileList = [];
let row = 0;
let mode = 'hl';

uploader.addEventListener('change', (event) => {
    fileList = uploader.files;
})

modeSelect.addEventListener('change', (event) => {
    rowNumber.disabled = (event.target.value == 'cs') ? false : true;
});

btnSubmit.addEventListener('click', async function() {
    resultField.innerHTML = '';
    resultImage.hidden = true;

    let dataURLs = [];
    for (let i = 0; i < fileList.length; i++) {
        let dataURL = await loadImage2(fileList[i]);
        dataURLs.push(dataURL);
    }

    mode = modeSelect.value;
    row = rowNumber.value;

    let dataSend = {
        'status': 'OK',
        'mode': mode,
        'row': row,
        'images': dataURLs
    };

    let response = await fetch('/postdata', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(dataSend)
    });

    if (response.ok) {
        let result = await response.json();

        resultField.innerHTML = result.result_msg;

        console.log(result);

        resultImage.src = result.result;
        resultImage.hidden = false;
    }
});

function loadImage2(src) {
    return new Promise(function(resolve, reject) {
        let fr = new FileReader();

        fr.addEventListener('load', () => {
            resolve(fr.result);
        });
        fr.readAsDataURL(src);
    });
}