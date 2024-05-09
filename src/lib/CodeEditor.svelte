<script lang="ts" context="module">
    function makeId(length: number) {
        let result = '';

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        
        let counter = 0;

        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }

        return result;
    }
</script>

<script lang="ts">

    import { initSandbox } from './sandbox';

    import { EditorView, basicSetup } from 'codemirror';
    import { EditorState, Text } from "@codemirror/state";
    import { indentWithTab } from '@codemirror/commands'
    import { indentUnit } from '@codemirror/language'
    import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';
    import { keymap } from '@codemirror/view';

    import * as Y from 'yjs';
    import { yCollab } from 'y-codemirror.next';
    import { WebrtcProvider } from 'y-webrtc';
    import { onMount, setContext } from 'svelte';
    import { writable } from 'svelte/store';

    let iFrameContainer: HTMLDivElement;
    let editorContainer: HTMLDivElement;
    let totalContainer: HTMLDivElement;

    export const usercolors = [
        { color: '#30bced', light: '#30bced33' },
        { color: '#6eeb83', light: '#6eeb8333' },
        { color: '#ffbc42', light: '#ffbc4233' },
        { color: '#ecd444', light: '#ecd44433' },
        { color: '#ee6352', light: '#ee635233' },
        { color: '#9ac2c9', light: '#9ac2c933' },
        { color: '#8acb88', light: '#8acb8833' },
        { color: '#1be7ff', light: '#1be7ff33' }
    ]

    // select a random color for this user
    export const userColor = usercolors[Math.random() * usercolors.length | 0];

    let reload: (code: string) => void;
    let state: EditorState;
    let view: EditorView;

    let inviteLink = writable("");
    let isHost: boolean;

    let scrubber: HTMLInputElement;

    onMount(async () => {

        const urlSearchParams = new URLSearchParams(location.search);

        isHost = !urlSearchParams.has("id");

        let width = Number.parseInt(urlSearchParams.get("width") ?? "400") ?? 400;

        let noEditor = urlSearchParams.get("editor") == "no";
        console.log(noEditor);

        let roomId = isHost ? makeId(4) : urlSearchParams.get("id");

        inviteLink.set(`${window.location}?id=${roomId}`);

        const ydoc = new Y.Doc();
        
        const provider = new WebrtcProvider(`codemirror6-editor-${roomId}`, ydoc, {
            signaling: [
                "wss://yrs-signal-2.shuttleapp.rs/signaling"
                //"wss://signal.xacer.dev/"
            ]
        });

        const ytext = ydoc.getText('codemirror');

        const undoManager = new Y.UndoManager(ytext);

        let name = urlSearchParams.get("name") ?? 'Anonymous ' + Math.floor(Math.random() * 100);

        provider.awareness.setLocalStateField('user', {
            name: name,
            color: userColor.color,
            colorLight: userColor.light
        });

        let myTheme = EditorView.theme({
            "&": {
                width: noEditor ? "0%" : "100%",
                height: `${width-1}px`,
                backgroundColor: "white",
            }            
        });

        if (noEditor) {
            (totalContainer.children[0] as HTMLDivElement).style.display = "none";
            totalContainer.style.width = `${width+5}px`;
        }

        state = EditorState.create({
            doc: ytext.toString(),
            extensions: [
                basicSetup,
                javascript(),
                yCollab(ytext, provider.awareness, { undoManager }),
                keymap.of([indentWithTab]),
                indentUnit.of(" ".repeat(4)), // 4-spaces
                myTheme
            ],
        });

        view = new EditorView({ 
            state, 
            parent: editorContainer
        });
        

        reload = (await initSandbox(iFrameContainer, width)).reload;
    
        let resultIFrame = document.getElementsByClassName("result-iframe")[0] as HTMLIFrameElement;

        resultIFrame.style.width = `${width}px`;
        resultIFrame.style.height = `${width}px`;
        resultIFrame.style.border = `none`;
        resultIFrame.style.borderLeft = `1px solid gray`;

        let lastText = "";
        let timeBeforeReload = 0.1;
        let reloaded = false;
        let lastEdit = performance.now();

        function pollLoop() {
            requestAnimationFrame(pollLoop);

            if (scrubberActive) return;

            let newText = view ? view.state.doc.toString() : ytext._item?.content.getContent().join("");

            if (!newText) return;
            
            if (newText != lastText) {
                // reload(newText);
                lastEdit = performance.now();
                lastText = newText;
                reloaded = false;
            }

            if (!reloaded && performance.now() > lastEdit + timeBeforeReload * 1e3 ) {
                reload(newText);
                reloaded = true;
                
                console.log("Reloading due to user input.");
            }
        }

        let scrubberActive = false;
        let scrubberAnchorValue = 0;
        let lastScrubberLocalValue = 0;
        let isMouseDown = false;

        function resetNumberScrubber() {
            scrubber.value = "0";
            scrubberActive = false;
        }

        function numberScrubberLoop() {
            requestAnimationFrame(numberScrubberLoop);

            let cursorPosition = view.state.selection.main.head;
            let doc = view.state.doc.toString();
            let character = doc[cursorPosition];

            // Not in a number
            // if (!/\d/.test(character) || !character) {
            //     resetNumberScrubber();
            //     return;
            // }

            // detect whole number
            let backSearchIndex = cursorPosition - 1;
            while (backSearchIndex >= 0 && /\d|\w/.test(doc[backSearchIndex])) {
                character = doc[backSearchIndex] + character;
                backSearchIndex --;
            }
            let forwardSearchIndex = cursorPosition + 1;
            while (forwardSearchIndex < doc.length && /\d|\w/.test(doc[forwardSearchIndex])) {
                character = character + doc[forwardSearchIndex];
                forwardSearchIndex ++;
            }

            // make sure there are only numbers
            if (!(/^\d+$/.test(character))) {
                resetNumberScrubber();
                return;
            }

            if (doc[backSearchIndex] == "-") {
                character = "-" + character;
                backSearchIndex --;
            }

            let curValue = parseInt(character);
            
            // Otherwise:
            // If the scrubber is already active, set the character to the anchor + scrubber value
            let scrubberLocalValue = parseInt(scrubber.value);
            if (scrubberActive) {
                if (scrubberLocalValue != lastScrubberLocalValue) {
                    lastScrubberLocalValue = scrubberLocalValue;

                    let value = scrubberAnchorValue + scrubberLocalValue;

                    let furthestBackSelection = backSearchIndex + 1 + (value < 0 ? 1 : 0);

                    view.dispatch({
                        changes: [
                            {
                                from: backSearchIndex + 1,
                                to: forwardSearchIndex,
                                insert: Text.of([value.toString()])
                            }
                        ],
                        selection: {
                            anchor: furthestBackSelection,
                            head: furthestBackSelection
                        }
                    });

                    console.log("Reloading due to scrubber.");

                    reload(view.state.doc.toString());
                }
            } 
            
            // if the scrubber is not active, set the anchor
            else if (isMouseDown) {
                scrubberActive = true;
                scrubberAnchorValue = curValue;
                lastScrubberLocalValue = parseInt(scrubber.value);
            }
            
        }

        scrubber.addEventListener("focusin", () => {
            isMouseDown = true;
        });

        scrubber.addEventListener("focusout", () => {
            resetNumberScrubber();
            isMouseDown = false;
        });

        // scrubber.addEventListener("mousedown", (event) => {
        //     isMouseDown = true;
        // });

        // addEventListener("mousedown", (event) => {
        //     isMouseDown = true;
        // });

        // addEventListener("mouseup", (event) => {
        //     resetNumberScrubber();
        //     isMouseDown = false;
        // });

        requestAnimationFrame(numberScrubberLoop);
        requestAnimationFrame(pollLoop);

    });

    export function setText(code: string) {
        if (reload && view) {
            if (view.state.doc.length > 0) {
                alert("Editor must be empty to load example.");
                return;
            }
            // Replace editor content
            view.dispatch({
                changes: [
                    {
                        from: 0, 
                        to: view.state.doc.length, 
                        insert: Text.of(code.split("\n")),
                        
                    }
                ],
            });

            reload(code);
        }
    }

    export function getInviteLink() {
        return inviteLink;
    }

    setContext("example-setter", (code: string) => {
        if (reload && view) {
            if (view.state.doc.length > 0) {
                alert("Editor must be empty to load example.");
                return;
            }
            // Replace editor content
            view.dispatch({
                changes: [
                    {
                        from: 0, 
                        to: view.state.doc.length, 
                        insert: Text.of(code.split("\n")),
                        
                    }
                ],
            });

            reload(code);
        }
    });

    // Helper function for adding examples faster
    // @ts-ignore
    window["exportCode"] = function (title: string) {
        if (view) {
            const code = view.state.doc.toString();
            title = title.toString();
            console.log({ title, code });
        }
    };

</script>

<div class="overflow-hidden"></div>

<div>
    <div class="max-w-5xl m-auto flex border-gray-300 border-2" bind:this={totalContainer}>
        <div bind:this={editorContainer} class="flex-initial w-full"></div>
        <div bind:this={iFrameContainer} class="flex-initial w-[400px]"></div>
    </div>

    <!-- Slider -->
    <div class="max-w-5xl m-auto flex border-gray-300 border-2">
        <div class="mx-auto my-2 py-0 w-1/2">
            <input type="range" min="-200" max="200" value="0" class="slider" bind:this={scrubber}/>
        </div>
    </div>
</div>

<style>
    :global(.cm-tooltip-autocomplete) {
        display: none;
    }

    .slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%; /* Full-width */
        height: 10px; /* Specified height */
        border-radius: 5px;
        background: #d3d3d3; /* Grey background */
        outline: none; /* Remove outline */
        opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
        -webkit-transition: .2s; /* 0.2 seconds transition on hover */
        transition: opacity .2s;
    }

    .slider:hover {
        opacity: 1; /* Fully shown on mouse-over */
    }

    /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
    .slider::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        border-radius: 50%;
        background: #04AA6D; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }

    .slider::-moz-range-thumb {
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        border-radius: 50%;
        background: #04AA6D; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }
</style>