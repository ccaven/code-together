<script lang="ts">
    import * as Y from 'yjs';
    import { yCollab } from 'y-codemirror.next';
    import { WebrtcProvider } from 'y-webrtc';
    import { EditorView, basicSetup } from 'codemirror';
    import { EditorState, Text, Transaction } from "@codemirror/state";
    import { javascript } from '@codemirror/lang-javascript';
    import { indentWithTab } from '@codemirror/commands'
    import { indentUnit } from '@codemirror/language'
    import { onMount, setContext } from 'svelte';
    import { initSandbox } from './sandbox';
    import Examples from './Examples.svelte';
    import { keymap } from '@codemirror/view';
    import { select_multiple_value } from 'svelte/internal';
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

    let reload: (code: string) => void;
    let state: EditorState;
    let view: EditorView;

    let inviteLink: string;

    onMount(async () => {

        const urlSearchParams = new URLSearchParams(location.search);

        // TODO: Make sure room id's don't overlap
        // i.e. seed with millisecond
        let roomId = urlSearchParams.has("id") ? urlSearchParams.get("id") : makeId(6);

        console.log(`${window.location}?id=${roomId}`)
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
                height: "600px"
            },
        })

        state = EditorState.create({
            doc: ytext.toString(),
            extensions: [
                basicSetup,
                javascript(),
                yCollab(ytext, provider.awareness, { undoManager }),
                keymap.of([indentWithTab]),
                indentUnit.of("    "), // 4-spaces
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
    <div id="invite">
        {#if inviteLink}
            Send this link to others to enable the multiplayer editor!
            <button on:click={() => navigator.clipboard.writeText(inviteLink)}>
                Copy Link
            </button>
            <span
                style:background-color="green"
                style:color="white"
                style:padding="5px"
                style:border-radius="0px"
                style:font-family="courier new"
            >
                {inviteLink}
            </span>
            
        {/if}
    </div>
    <div bind:this={editorContainer} id="editor"></div>
    <div bind:this={iFrameContainer} id="result"></div>
    <div id="examples">
        <Examples/>
    </div>
</div>

<style>
    #total-container {
        max-width: 1200px;
        margin: auto;
        margin-top: 2rem;
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: auto 600px auto;
        border: 1px solid lightgray;
    }

    #editor, #result {
        grid-row: 2;
        grid-column: 1 / 3;
    }

    #editor { grid-column: 1; overflow: auto; } 
    #result { grid-column: 2; } 

    #invite {
        grid-row: 1;
        grid-column: 1 / 3;
        padding: 15px;
        border-bottom: 1px solid black;
    }

    #examples { 
        grid-column: 1 / 3; 
        grid-row: 3; 
        padding: 15px;
        border: 1px solid black;
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