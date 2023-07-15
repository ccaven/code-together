<script lang='ts'>
    import CodeEditor from "$lib/CodeEditor.svelte";
</script>
<!--
<CodeEditor/>
-->

<div id="background" class="absolute w-full h-full"></div>

<CodeEditor/>


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
</style>