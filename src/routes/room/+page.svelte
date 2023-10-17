<script lang="ts">
    import CodeEditor from "$lib/CodeEditor.svelte";
    //import Examples from "$lib/Examples.svelte";
    //import InviteLink from "$lib/InviteLink.svelte";

    let editor: CodeEditor;

</script>
<!--
<InviteLink inviteLink={"aaa"}/>
-->

<div class="absolute top-0 bottom-0 left-0 right-0 grid itmes-center">
    <CodeEditor bind:this={editor}/>
</div>


<!--
<Examples codeEditor={editor}/>
-->