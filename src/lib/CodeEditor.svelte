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

    import InviteLink from './InviteLink.svelte';
    import Examples from './Examples.svelte';

    import { initSandbox } from './sandbox';

    import { EditorView, basicSetup } from 'codemirror';
    import { EditorState, Text } from "@codemirror/state";
    import { indentWithTab } from '@codemirror/commands'
    import { indentUnit } from '@codemirror/language'
    import { javascript } from '@codemirror/lang-javascript';
    import { keymap } from '@codemirror/view';

    import * as Y from 'yjs';
    import { yCollab } from 'y-codemirror.next';
    import { WebrtcProvider } from 'y-webrtc';
    import { onMount, setContext } from 'svelte';

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

    let inviteLink: string;
    let isHost: boolean;

    onMount(async () => {

        const urlSearchParams = new URLSearchParams(location.search);

        isHost = !urlSearchParams.has("id");

        // TODO: Make sure room id's don't overlap
        // i.e. seed with millisecond

        let roomId = isHost ? makeId(4) : urlSearchParams.get("id");

        inviteLink = `${window.location}?id=${roomId}`;

        const ydoc = new Y.Doc();
        
        const provider = new WebrtcProvider(`codemirror6-editor-${roomId}`, ydoc, {
            signaling: [
                "wss://signal-us-east-1d.xacer.dev:443"
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
                width: "100%",
                height: "599px",
                backgroundColor: "white"
            },
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

        reload = (await initSandbox(iFrameContainer)).reload;

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


<div id="total-container">
    {#if inviteLink && isHost}
        <InviteLink {inviteLink}/>
    {/if}

    <div bind:this={editorContainer} id="editor"></div>
    <div bind:this={iFrameContainer} id="result"></div>

    <div id="examples">
        <Examples/>
    </div>
</div>

<style>
    :global(body) {
        font-family: Lato, "Noto Sans", Helvetica, Corbel, sans-serif;
    }

    #total-container {
        max-width: 1200px;
        margin: auto;
        margin-top: 2rem;
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: auto 600px auto;
    }

    #editor, #result {
        grid-row: 2;
        grid-column: 1 / 3;
        border-top: 1px solid gray;

        box-shadow: 0px 0px 5px 2px lightgray;
    }

    #editor { grid-column: 1; overflow: auto; border-left: 1px solid gray; } 
    #result { grid-column: 2; } 

    #examples { 
        grid-column: 1 / 3; 
        grid-row: 3; 
        padding: 15px;
        border: none;
        border-top: 1px solid gray;
    }

    :global(.result-iframe) {
        width: 600px;
        height: 600px;
        overflow: hidden;
        padding: 0;
        margin: 0;
        border: none;
        border-right: 1px solid gray;
        border-left: 1px solid gray;
    }
</style>