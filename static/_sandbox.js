/** @type {HTMLCanvasElement} */
let cachedCanvas;

/** @type {OffscreenCanvas} */
let cachedOffscreenCanvas;

/** @type {Worker} */
let cachedWorker;

let cachedSetInterval;
let pongTimer = 0;

function setupCanvas(canvas, worker) {
    canvas.onmousemove = event => {
        worker.postMessage({
            type: "mousemove",
            mouseX: event.x,
            mouseY: event.y
        });
    };

    window.addEventListener("mousedown", event => {
        worker.postMessage({
            type: "click",
            button: event.button
        });
    });

    window.addEventListener("keydown", event => {
        worker.postMessage({
            type: "keydown",
            key: event.key,
            keyCode: event.keyCode
        });
    });

    window.addEventListener("keyup", event => {
        worker.postMessage({
            type: "keyup",
            key: event.key,
            keyCode: event.keyCode
        });
    });

    window.addEventListener("mouseup", event => {
        worker.postMessage({
            type: "mouseup",
            button: event.button
        });
    });
}

/**
 * 
 * @param {string} code 
 */
async function generateWorker(code, regenerate) {
    if (!regenerate && cachedWorker) {
        cachedWorker.postMessage({ type: "init", code: code });
        return;
    }

    const workerScript = await Websandbox.connection.remote.makeWorkerScript();

    const canvas = document.createElement("canvas");
    canvas.style.width = "600px";
    canvas.style.height = "600px";
    canvas.width = 600;
    canvas.height = 600;
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.position = "fixed";
    document.body.appendChild(canvas);

    const offscreenCanvas = canvas.transferControlToOffscreen();

    // https://gist.github.com/nolanlawson/23eff93d27ad09ff44b7e4d56ffd1d54
    const workerBlob = new Blob(
        [ workerScript.toString() ],
        { type: 'text/javascript' }
    );
    const workerBlobUrl = URL.createObjectURL(workerBlob);
    const worker = new Worker(workerBlobUrl);

    setupCanvas(canvas, worker);

    worker.postMessage({ canvas: offscreenCanvas, type: "init", code: code }, [offscreenCanvas]);

    worker.addEventListener("message", () => {
        pongTimer = 0;
    });

    clearInterval(cachedSetInterval);
    cachedSetInterval = setInterval(() => {
        worker.postMessage({ type: "ping" });

        pongTimer ++;

        if (pongTimer > 10) {
            document.body.removeChild(cachedCanvas);
            cachedWorker.terminate();

            cachedCanvas = null;
            cachedWorker = null;
            
            console.log("Terminated due to infinite loop.");

            pongTimer = 0;

            clearInterval(cachedSetInterval);
        }
    }, 100);

    cachedWorker = worker;
    cachedCanvas = canvas;
    cachedOffscreenCanvas = offscreenCanvas;
}