
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
    
    <h2>Load Example</h2>
    
    <ul>
        {#each examples as example}
            <li>
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a href="javascript:void(0)" on:click={()=>onclick(example)}>{example.title}</a>
            </li>
        {/each}
    </ul>

</main>

<style>
    main {
        border: 1px solid red;
        width: 100%;
        height: 100%;
    }

</style>