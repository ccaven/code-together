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

    onMount(async () => {

        const urlSearchParams = new URLSearchParams(location.search);

        isHost = !urlSearchParams.has("id");

        let width = Number.parseInt(urlSearchParams.get("width") ?? "400") ?? 400;

        let roomId = isHost ? makeId(4) : urlSearchParams.get("id");

        inviteLink.set(`${window.location}?id=${roomId}`);

        const ydoc = new Y.Doc();
        
        const provider = new WebrtcProvider(`codemirror6-editor-${roomId}`, ydoc, {
            signaling: [
                "wss://yrs-signal.shuttleapp.rs/signaling"
            ]
        });

        const ytext = ydoc.getText('codemirror');

        const undoManager = new Y.UndoManager(ytext);

        let name = urlSearchParams.get("name") ?? 'Anonymous ' + Math.floor(Math.random() * 100);

        provider.awareness.setLocalStateField('user', {
            name: name,
            color: userColor.color,
            colorLight: userColor.light
        })

        let myTheme = EditorView.theme({
            "&": {
                width: "100%",
                height: `${width-1}px`,
                backgroundColor: "white"
            }            
        })

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

        iFrameContainer.style.width = `${width}px`;

        reload = (await initSandbox(iFrameContainer, width)).reload;

        let resultIFrame = document.getElementsByClassName("result-iframe")[0] as HTMLIFrameElement;

        resultIFrame.style.width = `${width}px`;
        resultIFrame.style.height = `${width}px`;
        resultIFrame.style.border = `none`;
        resultIFrame.style.borderLeft = `1px solid gray`;

        let lastText = "";
        let timeBeforeReload = 0.5;
        let reloaded = false;
        let lastEdit = performance.now();

        function pollLoop() {
            requestAnimationFrame(pollLoop);
            let newText = view.state.doc.toString();

            if (newText != lastText) {
                lastEdit = performance.now();
                lastText = newText;
                reloaded = false;
            }

            if (!reloaded && performance.now() > lastEdit + timeBeforeReload * 1e3) {
                reload(newText);
                reloaded = true;
            }
        }  

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
    <div class="max-w-5xl m-auto flex border-gray-300 border-2">
        <div bind:this={editorContainer} class="flex-initial w-full"></div>
        <div bind:this={iFrameContainer} class="flex-initial w-[400px]"></div>
    </div>
</div>

<style>
    :global(.cm-tooltip-autocomplete) {
        display: none;
    }
</style>