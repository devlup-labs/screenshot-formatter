var ctx;
var canvas;
var canvas_width;
var canvas_height;
const aspect_ratio = 16/9;
const display_width_ = "90%";
const display_height_ = "0%";
var display_width;
var display_height;
const actual_width = 1920;
const actual_height = 1080;
const centerX = actual_width/2;
const centerY = actual_height/2;
var scaleX;
var scaleY;

var colorPicker1;
var colorPicker2;

var IMG;
var filename;
var filetype;

function init() {
    canvas = document.getElementById("screen");
    canvas.style.width = display_width_;
    canvas.style.height = canvas.style.width/aspect_ratio;
    canvas.width = actual_width;
    canvas.height = actual_height;
    const bgPicker = document.getElementById("bg");
    bgPicker.addEventListener("change", () => {
        let option = bgPicker.value;
        if(option==="upload-images"){
            let option_ = document.getElementById("bg-code");
            option_.style.display = "none";

            option_ = document.getElementById("bg-code");
            option_.style.display = "none";

            option_ = document.getElementById("bg-image");
            option_.style.display = "block";
        }
        else if(option==="css-options") {
            let option_ = document.getElementById("bg-code");
            option_.style.display = "block";

            option_ = document.getElementById("bg-code");
            option_.style.display = "none";

            option_ = document.getElementById("bg-image");
            option_.style.display = "none";
        }

        else if(option==="own-code") {
            let option_ = document.getElementById("bg-code");
            option_.style.display = "block";

            option_ = document.getElementById("bg-code");
            option_.style.display = "none";

            option_ = document.getElementById("bg-image");
            option_.style.display = "none";
        }
    });

    display_width = canvas.offsetWidth;
    display_height = canvas.offsetHeight;

    scaleX = display_width/actual_width;
    scaleY = display_height/actual_height;

    ctx = canvas.getContext("2d");
    ctx.scale(scaleX, scaleY);
    
    colorPicker1 = document.getElementById("color-1");
    colorPicker2 = document.getElementById("color-2");

    document.querySelector(".color-picker").children[1].style.background = `linear-gradient(90deg, ${colorPicker1.value} 0%, ${colorPicker2.value} 100%)`;
    colorPicker1.addEventListener("input", previewLinGrad1, false);  // 1st child is the first color picker
    colorPicker2.addEventListener("input", previewLinGrad2, false);  // 3rd child is the second color picker

}

function previewLinGrad1(event) {
    let colorPicker = document.querySelector(".color-picker");
    let color1 = event.target.value;
    let color2 = colorPicker2.value;
    //2nd element is the preview for linear gradient
    colorPicker.children[1].style.background = `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`;    
}

function previewLinGrad2(event) {
    let colorPicker = document.querySelector(".color-picker");
    let color2 = event.target.value;
    let color1 = colorPicker1.value;
    //2nd element is the preview for linear gradient
    colorPicker.children[1].style.background = `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`;    
}

function readURL(event) {
    let file = event.target.files[0];
    filetype = (file.type.slice(6))
    filename = file.name.replace("."+filetype, "");
    // console.log(filename, filetype);

    let url = URL.createObjectURL(file);
    let img = document.createElement("img");
    img.src = url;
    img.id = url;    
    IMG = img;
    img.onload = function() {
        __drawImage(ctx, img)
    };

    document.getElementById("download").value = "Download!";
}

function readBG(event) {
    canvas.style.background = "none";
    let file = event.target.files[0];

    let url = URL.createObjectURL(file);
    let img = new Image();
    img.src = url;
    img.onload = function() {
        canvas.style.background = "url("+this.src+")";
    }
    // canvas.style.backgroundSize = "cover";
}


function __drawImage(ctx, img) {
    let h = img.naturalHeight;
    let w = img.naturalWidth;

    if (w>actual_width || h>actual_height) {
        let obj = adjustDimensions(w,h);
        w = obj[0];
        h = obj[1];
    }
    ctx.drawImage(img, Math.floor((centerX-w/2)/scaleX), Math.floor((centerY-h/2)/scaleY), Math.floor(w/scaleX), Math.floor(h/scaleY));
    // ctx.beginPath();
    // ctx.strokeStyle = "black";
    // ctx.lineWidth =30;
    // ctx.strokeRect(Math.floor((centerX-w/2)/scaleX), Math.floor((centerY-h/2)/scaleY), Math.floor(w/scaleX), Math.floor(h/scaleY));
    // ctx.closePath();
}

function addBG() {
    let color1 = document.getElementById("color-1").value;
    let color2 = document.getElementById("color-2").value;
    let grad = ctx.createLinearGradient(0,centerY,actual_width/scaleX, centerY);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,actual_width/scaleX,actual_height/scaleY);
    // console.log(IMG);
    __drawImage(ctx, IMG);
}

function adjustDimensions(w,h) {
    if (w>h) {
        let s = actual_width/w;
        w*=s;
        h*=s;
    }
    else {
        let s = actual_height/h;
        w*=s;
        h*=s;
    }
    return [w,h];
}

async function downloadCanvas() {
    if (filename!=null) {
        if(window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(canvas.msToBlob(), `Formatted_${filename}.png`);
        }
        else{
            const imageURL = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.href = imageURL;
            a.download = `Formatted_${filename}.png`;
            a.click()
            document.body.removeChild(a);
        }
    }
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }