
<!-- This is a little section under the code editor -->
<script lang="ts">
    import { getContext } from "svelte";

  
    import examples from "./all_examples.json";

    let exampleSetter = getContext<(code: string) => void>("example-setter");

    function onclick({ code }: typeof examples[0]) {
        exampleSetter(code);
    }

</script>

<main id="dropdown">
    
    <h2>Example Gallery</h2>
    

    {#each examples as example}
        <div>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href="javascript:void(0)" on:click={()=>onclick(example)}>{example.title}</a>
        </div>
    {/each}


</main>

<style>
    main {
        width: 100%;
        height: 100%;
    }

    div {
        border: 1px solid black;
        padding: 5px;
        margin: 5px;
        display: inline;
        text-decoration: none;
    }
    a {
        text-decoration: none;
    }

</style>