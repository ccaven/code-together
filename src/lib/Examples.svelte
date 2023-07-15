
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
    <section>
        {#each examples as example}
            <div on:click={()=>onclick(example)} on:keydown={()=>{}}>
                <p>{example.title}</p>
            </div>
        {/each}
    </section> 
</main>

<style>
    main {
        width: 100%;
        height: 100%;
        text-align: center;
        background-color: rgba(255, 255, 255, 0.5);
    }

    section {
        margin: auto;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }

    div {
        border: 1px solid black;
        border-radius: 10px;
        text-decoration: none;
        padding: 5px 15px;
        margin: 5px 15px;
        display: flex;
        cursor: pointer;
        transition: 0.5s ease;
        background-color: white;
    }

    div:hover {
        background-color: rgb(250, 250, 250);
        font-size: large;
    }

    p {
        text-decoration: none;
        margin: auto;
    }

    h2 {
        background-color: white;
        border-radius: 10px;
        width: fit-content;
        margin: auto;
        font-size: 1.5em;
    }

</style>