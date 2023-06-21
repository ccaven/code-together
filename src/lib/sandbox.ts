import Sandbox from 'websandbox';

const ski0 = /* javascript */`
let CORNER, CENTER, CLOSE, SPACE, LEFT, RIGHT, UP, DOWN, SQUARE, ROUND, 
    PROJECT, MITER, BEVEL, DEGREES, RADIANS, PI, TAU, RGBA, HSL, HEX, 
    LEFT_BUTTON, RIGHT_BUTTON, ESCAPE, TAB, SHIFT, CONTROL, ALT, ENTER, 
    BACKSPACE, fps, skiJSData, mousePressed, mouseReleased, 
    mouseScrolled, mouseClicked, mouseOver, mouseOut, mouseMoved, mouseIsPressed, 
    mouseButton, mouseX, mouseY, pmouseX, pmouseY, keyPressed, keyReleased, 
    keyTyped, key, keyIsPressed, keyCode, width, height;

let background, fill, stroke, image, clear, noStroke, noFill, rect, 
    text, rectMode, ellipseMode, arcMode, imageMode, textAlign, createFont,
    textSize, textFont, textLeading, textWidth, textAscent, textDescent,
    strokeCap, strokeJoin, strokeWeight, pushStyle, popStyle, pushMatrix,
    popMatrix, translate, rotate, scale, beginShape, vertex, curveVertex,
    bezierVertex, endShape, curve, bezier, arc, ellipse, quad, triangle,
    point, line, get, debug, day, month, year, hour, minute, seconds,
    enableContextMenu, cursor, smooth, noSmooth, noLoop, loop, max,
    min, mag, dist, manhattanDistance, chebyshevDistance, exp, norm,
    map, lerp, random, constrain, log, sqrt, sq, pow, abs, trunc, floor,
    ceil, round, sin, cos, tan, acos, asin, atan, atan2, radians, degrees,
    angleMode, bezierPoint, bezierTangent, colorMode, color, lerpColor,
    red, green, blue, alpha, frameRate, millis;

let draw;

let _runMouseMoved, _runMouseReleased, _runMousePressed, _runKeyPressed, _runKeyReleased;
`;

const ski1 = /* javascript */`
width = 600;
height = 600;

// event handlers
mouseReleased = () => {}
mouseScrolled = () => {}
mouseClicked = () => {}
mouseOut = () => {}
mouseOver = () => {}
mouseMoved = () => {}
keyPressed = () => {}
keyReleased = () => {}
keyTyped = () => {}
mouseIsPressed = false
mouseButton = LEFT_BUTTON
mouseX = 0
mouseY = 0
pmouseX = mouseX
pmouseY = mouseY

BACKSPACE = 8
TAB = 9
ENTER = 13
SHIFT = 16
CONTROL = 17
ALT = 18
ESCAPE = 27
SPACE = 32
LEFT = 37
RIGHT = 39
UP = 38
DOWN = 40
//mostly for drawin' stuff on the canvas
CORNER = 0
CENTER = 1
CLOSE = true
SQUARE = atob("YnV0dA==") //yeah, srsly.
ROUND = "round"
PROJECT = "square"
MITER = "iter"
BEVEL = "bevel"
DEGREES = "deg"
RADIANS = "rad"
PI = Math.PI
TAU = PI * 2
RGBA = "rgba"
HSL = "hsl"
HEX = "hex"
LEFT_BUTTON = 0
RIGHT_BUTTON = 2;

(function () {

    /**
     * sets the background for the canvas
     * @param {...(string|number|Array)} args
     * @see {@link color} for the definition of the arguments
    **/
    background = function (...args) {
        const cache = [ctx.strokeStyle, ctx.fillStyle]
        const matrix = ctx.getTransform()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.strokeStyle = "rgba(0, 0, 0, 0)"
        ctx.fillStyle = color(...args)
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.strokeStyle = cache[0]
        ctx.fillStyle = cache[1]
        ctx.setTransform(matrix)
    }
    /**
     * sets the fill color for the shapes following the call
     * @param {...(string|number|Array)} args
     * @see {@link color} for the definition of the arguments
    **/
    fill = function (...args) {
        ctx.fillStyle = color(...args)
    }
    /**
     * sets the fill color for the shapes following the call
     * @param {...(string|number|Array)} args
     * @see {@link color} for the definition of the arguments
    **/
    stroke = function (...args) {
        ctx.strokeStyle = color(...args)
    }
    /**
     * draws an ImageData object, HTMLCanvasElement, or HTMLImageElement on the canvas
     * @param {(HTMLCanvasElement|ImageData|HTMLImageElement)} img image to be drawn
     * @param {number} x
     * @param {number} y
     * @param {number} [w=img.width] - the width of the image. defaults to the width of the image. i mean what else would it default too lol?
     * @param {number} [h=img.height] - the height of the image. defaults to the height of the image. i mean what else would it default too lol?
     * @example
     * image(img, 0, 0) 
     * //draws the image at (0, 0) with the default width an' height
     * image(img, 0, 0) 
     * //draws the image at (0, 0) with the dimensions 400px by 400px
    **/
    image = function (img, x, y, w = img.width, h = img.height) {
        [x, y] = skiJSData.pos("image", x, y, w, h)
        if(img instanceof ImageData) ctx.putImageData(img, x, y, w, h)
        else ctx.drawImage(img, x, y, w, h)
    }
    /**
     * draws a clear rectangle across the entire canvas
    **/
    clear = function () {
        const matrix = ctx.getTransform()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, width, height)
        ctx.setTransform(matrix)
    }
    /**
     * removes any stroke from the shapes to be drawn after the call = function
    **/
    noStroke = function () {
        ctx.strokeStyle = color(0, 0)
    }
    /**
     * removes any stroke from the shapes to be drawn after the call = function
    **/
    noFill = function () {
        ctx.fillStyle = color(0, 0)
    }

    rect = function (x, y, width, height, ...radius) {
        [x, y] = skiJSData.pos("rect", x, y, width, height)
        if (radius.length > 0) {
            ctx.beginPath()
            ctx.roundRect(x, y, width, height, ...radius)
            ctx.closePath()
            ctx.stroke()
            ctx.fill()
        } else {
            ctx.fillRect(x, y, width, height)
            ctx.strokeRect(x, y, width, height)
        }
    }
    /**
     * i see absolutely no reason why you would document this, .-.
     * it's a helper for = function the [text function]{@link text}.
     * 
     * @param {string} str - a string
     * @param {number} width -  the width of the text
     * 
     * @returns {string} - the string with proper line breaks.
    **/
    wrapText = function (str, width) {
        str = str.split(/[ ]/)
        let i = 0, phrase = "", result = ""
        while(i < str.length){
            const frag = str[i]
            const newLineCharIndex = frag.indexOf("\\\\" + "n")
            if(newLineCharIndex >= 0){
            phrase += frag.slice(0, newLineCharIndex + 1)
            result += phrase
            phrase = frag.slice(newLineCharIndex + 1, frag.length) + " "
            }
            else {
                phrase += frag + " "
                if(textWidth(phrase) > width){
                    result += phrase + "\\\\" + "n"
                    phrase = ""
                }
            }
            i++
        }
        if(phrase.length > 0){
            result += "\\\\" + "n" + phrase
        }
        return result
    }
    /**
     * displays text on the canvas
     * @param {!*} msg the message you want to display can be anythin' but null.
     * @param {number} x
     * @param {number} y
     * @param {number} [w] width
     * @param {number} [h] height - (this doesn't do anythin')
     * @example
     * textAlign(CENTER, CENTER)
     * text("hello there!", width / 2, height / 2) 
     * //draws "hello there!" on the center of the canvas
     * text("hello there!", width / 2, height / 2, 200, 100) 
     * //draws "hello there!" on the center of the canvas with a maximum width of 200px
    **/
    text = function (msg, x, y, w, h) {
        msg = msg?.toString()
        if(w) msg = wrapText(msg, w)
        if (msg.includes("\\\\" + "n")) {
            msg.split("\\\\" + "n").map((p, i) => {
                ctx.fillText(p, x, y + ((i - ((msg.split("\\\\" + "n")).length - 1) / 2) * (skiJSData.height + skiJSData.leading)))
                ctx.strokeText(p, x, y + ((i - ((msg.split("\\\\" + "n")).length - 1) / 2) * (skiJSData.height + skiJSData.leading)))
            })
        } else {
            ctx.fillText(msg, x, y)
            ctx.strokeText(msg, x, y)
        }
    }
    /**
     * sets the positionin' mode for rectangles
     * @param {number} [m=CORNER] - mode; please only use CORNER an' CENTER or 0 an' 1
     * @example
     * rectMode(CORNER)
     * //draws rectangles from the top-left corner
     * rectMode(CENTER)
     * //draws rectangles from their center
    **/
    rectMode = function (m) {
        skiJSData.rect = m
    }
    /**
     * sets the positionin' mode for ellipses
     * @param {number} [m=CENTER] - mode; please only use CORNER an' CENTER or 0 an' 1
     * @example
     * ellipseMode(CORNER)
     * //draws ellipses from the top-left corner
     * ellipseMode(CENTER)
     * //draws ellipses from their center
    **/
    ellipseMode = function (m) {
        skiJSData.ellipse = m
    }
    /**
     * sets the positionin' mode for arcs
     * @param {number} [m=CENTER] - mode; please only use CORNER an' CENTER or 0 an' 1
     * @example
     * arcMode(CORNER)
     * //draws arcs from the top-left corner
     * arcMode(CENTER)
     * //draws arcs from their center
    **/
    arcMode = function (m) {
        skiJSData.arc = m
    }
    /**
     * sets the positionin' mode for images
     * @param {number} [m=CORNER] - mode; please only use CORNER an' CENTER or 0 an' 1
     * @example
     * imageMode(CORNER)
     * //draws rectangles from the top-left corner
     * imageMode(CENTER)
     * //draws rectangles from their center
    **/
    imageMode = function (m) {
        skiJSData.image = m
    }
    /**
     * aligns the text drawn on the canvas
     * @param {number} [horiztonal=CORNER] - horizontal alignment
     * @param {number} [vertical=CORNER] - vertical alignment
     * @example
     * textAlign(CENTER, CENTER)
     * //text will now be drawn from the center
    **/
    textAlign = function (horizontal, vertical) {
        //println(horizontal === CENTER, vertical === CENTER)
        ctx.textAlign = horizontal === CENTER ? "center" : "start"
        ctx.textBaseline = vertical === CENTER ? "middle" : "hanging"
    }
}) ();
`;

const ski2 = /* javascript */`
(function() {
    /**
     * sets the font size for any text drawn
     * @param {number} size
     * @example
     * textSize(20) 
     * //text will be drawn at 20px
    **/
    textSize = function (size) {
        skiJSData.height = size
        ctx.font = skiJSData.fontString(skiJSData.font, size)
    }
    /**
     * sets the font for any text drawn
     * @param {string} font - the name of the font
     * @param {number} [size] - the size of the font in px
     * @example
     * textFont("Arial", 12) 
     * //font is arial with size 12px
    **/
    textFont = function (font, size = skiJSData.height) {
        skiJSData.height !== size && (skiJSData.height = size)
        skiJSData.flags = []
        if ((/bold/i).test(font)) {
            skiJSData.flags.push("bold")
            font = font.replace("bold", '')
        }
        if ((/italic/i).test(font)) {
            skiJSData.flags.push("italic")
            font = font.replace("italic", '')
        }
        font = font.trim()
        skiJSData.font = font
        ctx.font = skiJSData.fontString(font, size)
    }
    /**
     * sets the space between text on the y-axis
     * @param {number} val - leading in pix
    **/
    textLeading = function (val) {
        skiJSData.leading = val
    }
    /**
     * find the width of a string given the current font an' font size
     * for strings with line breaks, it finds the largest width
     * @param {string} txt - text
    **/
    textWidth = function (txt) {
        return txt.split("\\\\" + "n").reduce((a, b) => max(a, ctx.measureText(b).width), 0)
    }
    /**
     * i honestly don't know. just ported the concept from PJS.
    **/
    textAscent = function () {
        return ctx.measureText("a").fontBoundingBoxAscent
    }
    /**
     * i honestly don't know. just ported the concept from PJS.
    **/
    textDescent = function () {
        ctx.measureText("a").fontBoundingBoxDescent
    }

    strokeCap = function (mode) {
        ctx.lineCap = mode
    }

    strokeJoin = function (mode) {
        ctx.lineJoin = mode
    }

    strokeWeight = function (weight) {
        ctx.lineWidth = weight
    }
    /**
     * saves the current state of the canvas
    **/
    pushStyle = function () {
        ctx.save()
    }
    /**
     * restores the saved state of the canvas
    **/
    popStyle = function () {
        ctx.restore()
    }
    /**
     * save the current transformation matrix state
    **/
    pushMatrix = function () {
        const { matrices: arr, matrixToArray: convert } = skiJSData
        arr.push(convert(ctx.getTransform()))
    }
    /**
     * restores the saved transformation matrix state
    **/
    popMatrix = function () {
        const arr = new Float32Array(skiJSData.matrices.pop())
        const mat = DOMMatrix.fromFloat32Array(arr)
        ctx.setTransform(mat)
    }
    /**
     * translate given coordinates
     * @param {number} x
     * @param {number} y
    **/
    translate = function (x, y) {
        ctx.transform(1, 0, 0, 1, x, y)
    }
    /**
     * rotate given an angle
     * @param {number} ang - rotation angle
    **/
    rotate = function (ang) {
        if(skiJSData.angle === DEGREES) ang = degrees(ang)
        const cos = Math.cos, sin = Math.sin
        ctx.transform(cos(ang), sin(ang), -sin(ang), cos(ang), 0, 0)
    }
    /**
     * scale given a factor
     * @param {number} w - if only one arg, the scale factor; else the x scale factor.
     * @param {number} [h] - y scale factor
    **/
    scale = function (w, h) {
        ctx.transform(w, 0, 0, h ? h : w, 0, 0)
    }
    /**
     * starts a new shape
    **/
    beginShape = function () {
        skiJSData.path = []
    }
    /**
     * adds a vertex to a shape
     * @param {number} x
     * @param {number} y
    **/
    vertex = function (x, y) {
        skiJSData.path.push([x, y])
    }
    /**
     * adds a curve vertex to a shape
     * a quadratic curve, a singular control point an' an endpoint.
     * @param {number} cx - control x
     * @param {number} cy - control y
     * @param {number} x
     * @param {number} y
    **/
    curveVertex = function (cx, cy, x, y) {
        skiJSData.path.push([cx, cy, x, y])
    }
    /**
     * adds a bezier vertex to a shape
     * a bezier curve, two control points an' one endpoint
     * @param {number} c1x - control x 1
     * @param {number} c1y - control y 1
     * @param {number} c2x - control x 2
     * @param {number} c2y - control y 2
     * @param {number} x
     * @param {number} y
    **/
    bezierVertex = function (c1x, c1y, c2x, c2y, x, y) {
        skiJSData.path.push([c1x, c1y, c2x, c2y, x, y])
    }
    /**
     * ends the shape calls an' draws a shape.
     * this could be abused to draw the same shape again
     * 'cuz i don't clear the path, semi-intentionally.
     * 
     * @param {boolean} [end] - use CLOSE, closes a shape by callin' ctx.closePath
    **/
    endShape = function (end) {
        const paths = skiJSData.path
        if (paths.length < 2 || paths[0].length !== 2) return
        ctx.beginPath()
        paths.forEach((path, index) => {
            if(index === 0){
                ctx.moveTo(...path)
            }
            else {
                if(path.length === 2) ctx.lineTo(...path)
                else if(path.length === 4) ctx.quadraticCurveTo(...path)
                else if(path.length === 6) ctx.bezierCurveTo(...path)
                else return
            }
        })
        if(end) ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
    /**
     * draws a curve given six points.
     * called in this order: vertex -> curveVertex
     * @param {number} sx - start x
     * @param {number} sy - start y
     * @param {number} cx - control x
     * @param {number} cy - control y
     * @param {number} ex - end x
     * @param {number} ey - end y
    **/
    curve = function (sx, sy, cx, cy, ex, ey) {
        if (typeof ey !== "number") return
        beginShape()
        vertex(sx, sy)
        curveVertex(cx, cy, ex, ey)
        endShape()
    }
    /**
     * draws a curve given eight points.
     * called in this order: vertex -> bezierVertex
     * @param {number} sx - start x
     * @param {number} sy - start y
     * @param {number} c1x - control x 1
     * @param {number} c1y - control y 1
     * @param {number} c2x - contorl x 2
     * @param {number} c2y - control y 2
     * @param {number} ex - end x
     * @param {number} ey - end y
    **/
    bezier = function (sx, sy, c1x, c1y, c2x, c2y, ex, ey) {
        if (typeof ey !== "number") return
        beginShape()
        vertex(sx, sy)
        bezierVertex(c1x, c1y, c2x, c2y, ex, ey)
        endShape()
    }
    /**
     * draws an arc.
     * @param {number} x
     * @param {number} y
     * @param {number} w - width
     * @param {number} h - width
     * @param {number} start - start angle
     * @param {number} stop - stop angle
     * @param {boolean} [close=false] - call endShape(CLOSE)
    **/
    arc = function (x, y, w, h, start, stop, close = false) {
        [x, y] = skiJSData.pos("arc", x, y, width, height)
        pushMatrix()
        translate(x, y)
        if(w !== h){
            if(w > h) scale(max(w, h) / min(w, h), 1)
            else scale(1, max(w, h) / min(w, h))
        }
        ctx.beginPath()
        if(ctx.fillStyle !== color(0, 0)) ctx.moveTo(0, 0)
        ctx.arc(0, 0, min(w, h) / 2, degrees(start), degrees(stop))
        if(close) ctx.closePath()
        popMatrix()
        ctx.fill()
        ctx.stroke()
    }
    /**
     * draws an ellipse or circle
     * @param {number} x
     * @param {number} y
     * @param {number} w - width
     * @param {number} h - height
    **/
    ellipse = function (x, y, w, h) {
        ctx.beginPath()
        ctx.ellipse(x, y, w / 2, h / 2, 0, 0, TAU)
        ctx.fill()
        ctx.stroke()
    }
    /**
     * draws a quadrilateral usin' vertex
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} x3
     * @param {number} y3
     * @param {number} x4
     * @param {number} y4
    **/
    quad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
        beginShape()
        vertex(x1, y1)
        vertex(x2, y2)
        vertex(x3, y3)
        vertex(x4, y4)
        endShape(CLOSE)
    }
    /**
     * draws a triangle
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} x3
     * @param {number} y3
    **/
    triangle = function (x1, y1, x2, y2, x3, y3) {
        beginShape()
        vertex(x1, y1)
        vertex(x2, y2)
        vertex(x3, y3)
        endShape(CLOSE)
    }

    point = function (x, y) {
        if (ctx.strokeStyle !== color(0, 0)) {
            const cache = [ctx.strokeStyle, ctx.fillStyle]
            noStroke()
            ctx.fillStyle = cache[0]
            ellipse(x, y, ctx.lineWidth, ctx.lineWidth)
            ctx.strokeStyle = cache[0]
            ctx.fillStyle = cache[1]
        }
    }

    line = function (x1, y1, x2, y2) {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.closePath()
        ctx.stroke()
    }

    get = function (...args) {
        const [x, y, w, h, src] = args
        switch (args.length) {
            case 0:
                return get(0, 0, width, height)
            case 2:
                data = ctx.getImageData(x, y, 1, 1).data
                return color(data[0], data[1], data[2], data[3])
            case 3: {
                const canvas = new OffscreenCanvas(w.width, w.height)
                const ctx = canvas.getContext("2d")
                if (w instanceof HTMLImageElement) {
                    ctx.drawImage(w, 0, 0)
                    data = ctx.getImageData(x, y, 1, 1)
                } else {
                    data = w.getContext("2d").getImageData(x, y, 1, 1).data
                }
                return color(data[0], data[1], data[2], data[3])
            }
            case 4: 
                const imageCanvas = new OffscreenCanvas(w, h)
                const context = imageCanvas.getContext("2d")
                context.putImageData(ctx.getImageData(x, y, w, h), 0, 0)
                return imageCanvas
            case 5: {
                const canvas = new OffscreenCanvas(src.width, src.height)
                const ctx = canvas.getContext("2d")
                ctx.drawImage(src, -x, -y)
                return canvas
            }
        }
    }

    mask = function () {
        ctx.globalCompositeOperation = "source-atop"
    }

    addEventListener("message", event => {
        // TODO: sync with the rest 

        if (event.data.type == "mousemove") {
            mouseX = event.data.mouseX;
            mouseY = event.data.mouseY;
            if (typeof mouseMoved == "function") _runMouseMoved = true;
        }
        else if (event.data.type == "click") {
            mouseIsPressed = true;
            mouseButton = event.data.button;
            if (typeof mousePressed == "function") _runMousePressed = true;
        }
        else if (event.data.type == "keydown") {
            key = event.data.key;
            keyCode = event.data.keyCode;
            keyIsPressed = true;
            if (typeof keyPressed == "function") _runKeyPressed = true;
        }
        else if (event.data.type == "keyup") {
            key = event.data.key;
            keyCode = event.data.keyCode;
            if (typeof keyReleased == "function") _runKeyReleased = true;
        }
        else if (event.data.type == "mouseup") {
            mouseButton = event.data.button;
            mouseIsPressed = false;
            if (typeof mouseReleased == "function") _runMouseReleased = true;
        }
    });

    // data used by ski.js
    skiJSData = {
        //canvas-related
        rect: CORNER,
        ellipse: CENTER,
        arc: CENTER,
        image: CORNER,
        leading: 0,
        height: 12,
        flags: [],
        fontString(font, size) {
            let flags = ""
            if(this.flags.includes("bold")) flags += "bold "
            if(this.flags.includes("italics")) flags += "italics "
            return (flags + (size+"px") + font)
        },
        pos(type, x, y, w, h) {
            return type === "rect" || type === "image" ? this[type] < 1 ? [x, y] : [x - w / 2, y - h / 2] : this[type] < 1 ? [x + w / 2, y + w / 2] : [x, y]
        },
        matrixToArray(matrix) {
            return ["a", "b", "c", "d", "e", "f"].map(el => matrix[el])
        },
        matrices: [],
        path: [],
        //non-canvas related
        rate: 60,
        millis: 0,
        start: 0,
        draw: 0,
        angle: DEGREES,
        color: RGBA,
        raf: -1
    }

    // FPS
    fps = 60

    // miscellaneous
    /**
     * alias for console.debug
     * @param {...*} args
     * 
    **/
    debug = function (...args) {
        console.debug(...args)
    }
    /**
     * alias for console.assert
     * @param {...*} args
    **/
    isEqual = function (...args) {
        console.assert(...args)
    }
    /**
     * returns the day
     * @returns {number} - day
    **/
    day = function () {
        return (new Date).getDate()
    }
    /**
     * returns the month
     * @returns {number} - month
    **/
    month = function () {
        return (new Date).getMonth()
    }
    /**
     * returns the year
     * @returns {number} - year
    **/
    year = function () {
        return (new Date).getYear()
    }
    /**
     * returns the hours
     * @returns {number} - hours
    **/
    hour = function () {
        return (new Date).getHours()
    }
    /**
     * returns the minutes
     * @returns {number} - minutes
    **/
    minute = function () {
        return (new Date).getMinutes()
    }
    /**
     * returns the seconds
     * @returns {number} - seconds
    **/
    seconds = function () {
        return (new Date).getSeconds()
    }
    /**
     * enables the context menu, so you can right-click an' save the canvas as an image.
    **/
    enableContextMenu = function () {
        canvas.oncontextmenu = true
    }
    /**
     * alias for document.body.style.cursor
     * @param {string} name - name of the cursor
    **/
    cursor = function (name) {
        document.body.style.cursor = name
    }

    smooth = function () {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
    }

    noSmooth = function () {
        ctx.imageSmoothingEnabled = false
        ctx.imageSmoothingQuality = "low"
    }
})();
`;

const ski3 = /* javascript */`
(function () {
    max = function (a, b) {
        return a > b ? a : b
    }

    min = function (a, b) {
        return a < b ? a : b
    }

    mag = function (a, b) {
        return Math.sqrt((a ** 2) + (b ** 2))
    }

    dist = function (x1, y1, x2, y2) {
        return mag(x2 - x1, y2 - y1)
    }

    manhattanDistance = function (x1, y1, x2, y2) {
        return abs(x1 - x2) + abs(y1 - y2)
    }

    chebyshevDistance = function (x1, y1, x2, y2) {
        return max(abs(x1 - x2), abs(y1 - y2))
    }

    exp = function (n) {
        return Math.E ** n
    }

    norm = function (val, low, high) {
        return (val - low) / (high - low)
    }

    map = function (val, a, b, c, d) {
        return c + (d - c) * norm(val, a, b)
    }

    lerp = function (val, targ, amt) {
        return ((targ - val) * amt) + val
    }

    random = function (min, max) {
        if(max) return Math.random() * (max - min) + min
        else if(min) return Math.random() * min
        else return Math.random()
    }

    constrain = function (val, low, high) {
        return min(max(val, low), high)
    }

    log = function (n){
        return Math.log(n)
    }

    sqrt = function (n) {
        return Math.sqrt(n)
    }

    sq = function (n) {
        return n ** 2
    }

    pow = function (a, b) {
        return a ** b
    }

    abs = function (n) {
        return n < 0 ? -n : n
    }

    trunc = function (n) {
        return n | 0
    }

    floor = function (n) {
        return n < 0 ? (n | 0) - 1 : n | 0
    }

    ceil = function (n) {
        return floor(n) + 1
    }

    round = function (n) {
        return n - floor(n) < 0.5 ? floor(n) : ceil(n)
    }

    sin = function (ang) {
        if(skiJSData.angle === DEGREES) ang = degrees(ang)
        return Math.sin(ang)
    }

    cos = function (ang) {
        if(skiJSData.angle === DEGREES) ang = degrees(ang)
        return Math.cos(ang)
    }

    tan = function (ang) {
        if(skiJSData.angle === DEGREES) ang = degrees(ang)
        return Math.tan(ang)
    }

    acos = function (ang) {
        if(skiJSData.angle === DEGREES) ang = degrees(ang)
        return Math.acos(ang)
    }

    asin = function (ang) {
        if(skiJSData.angle === DEGREES) ang = degrees(ang)
        return Math.asin(ang)
    }

    atan = function (ang) {
        ang = Math.atan(ang)
        if(skiJSData.angle === DEGREES) ang = radians(ang)
        return ang
    }

    atan2 = function (y, x) {
        let ang = Math.atan2(y, x)
        if(skiJSData.angle === DEGREES) ang = radians(ang)
        return ang
    }

    radians = function (ang) {
        return ang * (180 / PI)
    }

    degrees = function (ang) {
        return ang * (PI / 180)
    }

    angleMode = function (mode) {
        skiJSData.angle = mode
    }

    bezierPoint = function (a, b, c, d, t) {
        return (1 - t) * (1 - t) * (1 - t) * a + 3 * (1 - t) * (1 - t) * t * b + 3 * (1 - t) * t * t * c + t * t * t * d
    }

    bezierTangent = function (a, b, c, d, t) {
        return (3 * t * t * (-a + 3 * b - 3 * c + d) + 6 * t * (a - 2 * b + c) + 3 * (-a + b))
    }

    colorMode = function (mode) {
        return skiJSData.color = mode
    }

    color = function (...args) {
        if (typeof args[0] === "string" && args.length <= 1 && (/(#|rgb|hsl|rgba)/).test(args[0])) return args[0]
        args[0] instanceof Array && (args = args[0])
        if (typeof args[1] === "number" && (/rgb|rgba/).test(args[0])) {
            let cache = args[0].match(/[0-9\.]+(?=(,|\\)))/g)
            args = [cache[0], cache[1], cache[2], args[1]]
        }
        switch (skiJSData.color) {
            case RGBA:
                const [r, g, b, a] = args.length > 4 ? Object.assign(args, {
                    length: 4
                }) : args
                switch (args.length) {
                    case 1:
                        return "rgba(" + r + "," + r + "," + r + ", 1)";
                        break
                    case 2:
                        return "rgba(" + r + "," + r + "," + r + "," + (g / 255) + ")";
                        break
                    case 3:
                        return "rgba(" + r + "," + g + "," + b + ",1)";
                        break
                    case 4:
                        return "rgba(" + r + "," + g + "," + b + "," + (a/255) + ")";
                }
                break
            case HSL:
                return "hsl(" + args[0] + "," + args[1] + "," + args[2] + ")";
            case HEX:
                return args[0]
        }
    }

    lerpColor = function (color1, color2, amt) {
        if (typeof color1 !== "string" || typeof color2 !== "string" || skiJSData.color !== RGBA)
            return
        const [r1, g1, b1, a1] = color1.match(/\d{1,3}/g)
        const [r2, g2, b2, a2] = color2.match(/\d{1,3}/g)
        const [r, g, b, a] = [
            lerp(+r1, +r2, amt),
            lerp(+g1, +g2, amt),
            lerp(+b1, +b2, amt),
            lerp(+a1, +a2, amt)
        ];
        return "rgba("+r+","+g+","+b+","+a+")";
    }

    red = function (...args) {
        if(skiJSData.color !== RGBA) return
        const col = color(...args)
        return +col.match(/\d+(\.|)\d*/)
    }

    green = function (...args) {
        if(skiJSData.color !== RGBA) return
        const col = color(...args)
        return +col.match(/\d+(\.|)\d*/g)[1]
    }

    blue = function (...args) {
        if(skiJSData.color !== RGBA) return
        const col = color(...args)
        return +col.match(/\d+(\.|)\d*/g)[2]
    }

    alpha = function (...args) {
        if(skiJSData.color !== RGBA) return
        const col = color(...args)
        return trunc(col.match(/\d+(\.|)\d*/g)[3] * 255)
    }

    getImage = function (src, width, height) {
        return new Promise((resolve, reject) => {
            let img = loadImage(src, width, height)
            //resolve or reject
            img.onload = () => resolve(img)
            img.onerror = () => reject("invalid or unaccessible image source")
        })
    }

    loadImage = function (src, width, height) {
        let img
        //dimensions
        if(width) img = new Image(width, height)
        else img = new Image
        //source
        img.src = src
        if(!(/khanacademy/).test(src)) img.crossOrigin = "anonymous"
        return img
    }

    frameRate = function (rate) {
        skiJSData.rate = rate
    }

    millis = function () {
        return skiJSData.millis
    }
}) ();
`;

const ski = `
${ski0}
${ski1}
${ski2}
${ski3}
`;

function makeWorkerScript(code: string) {
    return /* javascript */`
        self.addEventListener("message", function (event) {
            if (event.data.type != "init") { return; }
            const canvas = event.data.canvas;
            const ctx = canvas.getContext("2d");

            console.log(ctx);

            ${ski}

            background(255, 255, 255);

            ${code}

            frameCount = 0;
            delta = 1000 / 60;
            then = performance.now();
            skiJSData.start = performance.now();
            
            {
                function loop(time) {
                    requestAnimationFrame(loop);

                    delta = time - then
                    let ms = 1000 / skiJSData.rate
                    if (delta < ms) return
                    let overflow = delta % ms
                    then = time - overflow
                    delta -= overflow

                    // TODO: Fix this so keyPressed and keyReleased work

                    if (_runMouseMoved && mouseMoved && typeof mouseMoved == "function") mouseMoved();
                    if (mouseIsPressed && mousePressed && typeof mousePressed == "function") mousePressed();
                    if (_runMouseReleased && mouseReleased && typeof mouseReleased == "function") mouseReleased();
                    if (keyIsPressed && keyPressed && typeof keyPressed == "function") keyPressed();
                    if (_runKeyReleased && keyReleased && typeof keyReleased == "function") keyReleased();

                    _runMouseMoved = false;
                    _runMouseReleased = false;
                    _runKeyPressed = false;
                    _runKeyReleased = false;

                    if (draw) draw();

                    pmouseX = mouseX;
                    pmouseY = mouseY;

                    frameCount += 1
                    skiJSData.millis = performance.now() - skiJSData.start
                    fps = 1000 / delta
                }

                requestAnimationFrame(loop);
            }
            
        });
    `;
}

function init() {


    const sandboxScript = /* javascript */`

    let cachedCanvas;
    let cachedWorker;

    function setupCanvas(canvas, worker) {
        canvas.onmousemove = event => {
            worker.postMessage({
                type: "mousemove",
                mouseX: event.x,
                mouseY: event.y
            });
        };

        canvas.onclick = event => {
            worker.postMessage({
                type: "click",
                button: event.button
            });
        };

        canvas.onkeydown = event => {
            console.log(event);
            worker.postMessage({
                type: "keydown",
                key: event.key,
                keyCode: event.keyCode
            });
        };

        canvas.onkeyup = event => {
            worker.postMessage({
                type: "keydown",
                key: event.key,
                keyCode: event.keyCode
            });
        };

        canvas.onmouseup = event => {
            console.log("mouseup");
            worker.postMessage({
                type: "mouseup",
                button: event.button
            });
        };
    }

    async function generateWorker(code) {
        if (cachedCanvas) document.body.removeChild(cachedCanvas);
        if (cachedWorker) cachedWorker.terminate();

        const workerScript = await Websandbox.connection.remote.makeWorkerScript(code);

        const canvas = document.createElement("canvas");
        canvas.style.width = "600px";
        canvas.style.height = "600px";
        canvas.width = 600;
        canvas.height = 600;
        canvas.style.top = "0px";
        canvas.style.left = "0px";
        canvas.style.position = "absolute";
        document.body.appendChild(canvas);

        const offscreenCanvas = canvas.transferControlToOffscreen();

        // TODO: Add user code to worker script
        const blob = new Blob([workerScript], { type: 'text/javascipt' });
        const worker = new Worker(window.URL.createObjectURL(blob));

        setupCanvas(canvas, worker);

        worker.postMessage({ canvas: offscreenCanvas, type: "init" }, [offscreenCanvas]);

        cachedWorker = worker;
        cachedCanvas = canvas;
    }
    `;

    return sandboxScript;
}

export async function initSandbox(frameContainer: HTMLDivElement) {
    const sandbox = await Sandbox.create({
        makeWorkerScript: async(c: string) => makeWorkerScript(c)
    }, {
        frameContainer,
        frameClassName: "result-iframe"
    }).promise;

    await sandbox.run(init());

    return {
        reload(code: string) {
            sandbox.run(`

            generateWorker(${"`" + code + "`"});
            `);
        }
    };
}

