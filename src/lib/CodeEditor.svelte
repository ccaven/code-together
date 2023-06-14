<script lang="ts">
    import * as Y from 'yjs';
    import { yCollab } from 'y-codemirror.next';
    import { WebrtcProvider } from 'y-webrtc';
    import { EditorView, basicSetup } from 'codemirror';
    import { EditorState } from "@codemirror/state";
    import { javascript } from '@codemirror/lang-javascript';
    import { onMount } from 'svelte';

    import Sandbox, { type PluginInstance } from 'websandbox';

    let iFrameContainer: HTMLDivElement;
    let editorContainer: HTMLDivElement;
    let sandbox: PluginInstance;

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
    console.log(userColor);

    function makeId(length: number) {
        let result = '';

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        
        let counter = 0;

        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }

        return result;
    }

    onMount(async () => {

        const urlSearchParams = new URLSearchParams(location.search);

        // TODO: Make sure room id's don't overlap
        // i.e. seed with millisecond
        let roomId = urlSearchParams.has("join-id") ? urlSearchParams.get("join-id") : makeId(6);

        console.log(`${window.location}?join-id=${roomId}`)

        const ydoc = new Y.Doc();
        
        const provider = new WebrtcProvider(`codemirror6-editor-${roomId}`, ydoc, {
            signaling: [
                'ws://localhost:4444'
            ]
        });

        const ytext = ydoc.getText('codemirror');

        const undoManager = new Y.UndoManager(ytext);

        provider.awareness.setLocalStateField('user', {
            name: 'Anonymous ' + Math.floor(Math.random() * 100),
            color: userColor.color,
            colorLight: userColor.light
        })

        let myTheme = EditorView.theme({
            "&": {
                width: "800px",
            },
        })

        const state = EditorState.create({
            doc: ytext.toString(),
            extensions: [
                basicSetup,
                javascript(),
                yCollab(ytext, provider.awareness, { undoManager }),
                myTheme
            ]
        })

        const view = new EditorView({ 
            state, 
            parent: editorContainer
        });

        sandbox = await Sandbox.create({}, { frameContainer: iFrameContainer, frameClassName: "result-iframe" }).promise;

        sandbox.run(`
            let canvas = document.createElement("canvas");
            canvas.style.backgroundColor = "white";
            canvas.style.top = "0px";
            canvas.style.left = "0px";
            canvas.style.position = "absolute";
            canvas.width = 600;
            canvas.height = 600;
            document.body.appendChild(canvas);

            let raf;
            let ctx = canvas.getContext("2d");
            let frameCount = 0;

            let draw = function () {};
            let timeoutId = -1;

            /* import Processing library here */
        `);

        function runEditor(code: string) {
            sandbox.run(`(() => {
                cancelAnimationFrame(raf);

                ${code}

                if (draw) {
                    function loop() {
                        draw();
                        raf = requestAnimationFrame(loop);
                    }
                    raf = requestAnimationFrame(loop);
                }
            })()`);
        }

        let pollMs = 1000;
        let lastText = "";
        setInterval(() => {
            let newText = view.state.doc.toString();
            if (newText != lastText) {
                console.log("Re-running editor");
                runEditor(newText);
                lastText = newText;
            }
        }, pollMs);

    });

</script>

<div>
    <div bind:this={editorContainer} id="editor"></div>
    <div bind:this={iFrameContainer} id="result"></div>
    
</div>

<style>
    div {
        display: grid;
        grid-template-columns: auto 1fr;
        border: 1px solid red;
    }

    :global(.result-iframe) {
        width: 600px;
        height: 600px;
        border: 1px solid black;
    }
</style>

