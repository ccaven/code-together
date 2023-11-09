<script lang="ts">
    import CodeEditor from "$lib/CodeEditor.svelte";
    import { onMount } from "svelte";
    //import Examples from "$lib/Examples.svelte";
    //import InviteLink from "$lib/InviteLink.svelte";

    let editor: CodeEditor;

    let title: string | null;
    
    onMount(() => {
        title = new URLSearchParams(location.search).get("title");
    });
</script>
<!--
<InviteLink inviteLink={"aaa"}/>
-->

<div class="absolute top-0 bottom-0 left-0 right-0 grid items-center">
    <div>
        {#if title}
        <h1 class="text-3xl text-center mb-5">{title}</h1>
        {/if}
        <CodeEditor/>
    </div>
</div>
