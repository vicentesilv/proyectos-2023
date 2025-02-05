// Configura el trabajador de PDF.js necesario para procesar los PDFs
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
    
// Selección de elementos del DOM
let pdfinput = document.querySelector(".selectpdf");
let upload = document.querySelector(".upload");
let algo = document.querySelector(".algo");
let afterupload = document.querySelector(".afterupload");
let select = document.querySelector("select");
let pdftext = document.querySelector(".pdftext");

let alltext = [];
let mensaje;

// Manejador de evento para el botón de carga
upload.addEventListener('click', () => {
    let file = pdfinput.files[0];
    if (file != undefined && file.type == "application/pdf") {
        let fr = new FileReader();
        fr.readAsDataURL(file);
        console.log(fr);
        fr.onload = () => {
            let res = fr.result;
            
            pdftext.setAttribute('src', res);
            
            
            
            
            console.log(res);
            // Llama a extractText con o sin contraseña
            extractText(res, false);
          
        }
    } else {
        alert("Selecciona un archivo PDF válido");
    }
});

// Función para extraer texto del PDF
async function extractText(url, pass) {
    try {
        let pdf;
        if (pass) {
            pdf = await pdfjsLib.getDocument({ url: url, password: pwd.value }).promise;
        } else {
            pdf = await pdfjsLib.getDocument(url).promise;
        }
        let pages = pdf.numPages;
        for (let i = 1; i <= pages; i++) {
            let page = await pdf.getPage(i);
            let txt = await page.getTextContent();
            let text = txt.items.map((s) => s.str).join("");
            alltext.push(text);
        }
        alltext.map((e, i) => {
            select.innerHTML += `<option value="${i+1}">${i+1}</option>`;
        });
        afterProcess();
    } catch (err) {
        alert(err.message);
    }
}

// Función que se llama después de procesar el PDF
function afterProcess() {
    afterupload.style.display = "flex";
    algo.style.display = "none";
    
    
    
    
}
function inicio() {
    mensaje = new SpeechSynthesisUtterance(alltext[select.value - 1]);
    mensaje.lang = "es-ES";
    mensaje.rate = 1;
    mensaje.pitch = 1;
    window.speechSynthesis.speak(mensaje);

}
// Funciones para pausar y reanudar la lectura de voz
function pauseSpeech() {
    window.speechSynthesis.pause();
}

function resumeSpeech() {
    window.speechSynthesis.resume();
}
function detener() {
    window.speechSynthesis.cancel();
}