<script lang='ts'>
    export let inviteLink: string;
</script>

<section>
    <div>
        <span
            style:color="black"
            style:padding="5px"
            style:border-radius="0px"
        >
            Send this link to others to enable the multiplayer editor!
        </span>
    </div>
    <div style:margin-right="5px">
        <!-- <a href="https://www.flaticon.com/free-icons/copy" title="copy icons">Copy icons created by Freepik - Flaticon</a> -->
        <img 
            src="copy.png" 
            width="30px" 
            alt="" 
            on:click={() => navigator.clipboard.writeText(inviteLink)}
            on:keydown={()=>{}}
        />
    </div>
    <div
        style:border="1px solid black"
    >
        <span
            style:color="black"
            style:padding="5px"
            style:border-radius="0px"
            style:font-family="courier new"
        >
            {inviteLink}
        </span>
    </div>
        
</section>

<style>
    section {
        grid-row: 1;
        grid-column: 1 / 3;
        padding: 15px;
        border-bottom: 1px solid black;
        display: flex;
        flex-flow: row wrap;
        border: 1px solid gray;
        justify-content: center;
        font-size: medium;
    }

    div {
        margin: 0px 15px 0px 0px;
        display: flex;
        justify-content: center;
    }

    img {
        cursor: pointer;
    }
</style>