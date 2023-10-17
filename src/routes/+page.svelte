<script lang='ts'>
    import CodeEditor from "$lib/CodeEditor.svelte";
    import Examples from "$lib/Examples.svelte";
    import InviteLink from "$lib/InviteLink.svelte";

    let codeEditor: CodeEditor;
</script>
<!--
<CodeEditor/>
-->

<div id="background" class="absolute w-full h-full"></div>
<div id="background-2" class="absolute w-full h-full"></div>
<div id="background-3" class="absolute w-full h-full"></div>

<InviteLink {codeEditor}/>

<div class="m-8">
    <CodeEditor bind:this={codeEditor}/>
</div>
<div class="px-16">
    <Examples {codeEditor}/>
</div>


<style>
    #background {
        background: white;
        background-image: radial-gradient(lightgray 1px, transparent 0);
        background-size: 20px 20px;
        background-position: -19px -19px;
        transform: rotate(30deg) scale(2);
        z-index: -100;
        position: fixed
    }

    #background-2 {
        background-image: radial-gradient(lightgray 0.5px, transparent 0);
        background-size: 20px 20px;
        background-position: -29px -19px;
        transform: rotate(30deg) scale(2);
        z-index: -100;
        position: fixed
    }

    #background-3 {
        background-image: radial-gradient(lightgray 0.5px, transparent 0);
        background-size: 20px 20px;
        background-position: -19px -29px;
        transform: rotate(30deg) scale(2);
        z-index: -100;
        position: fixed
    }
</style>