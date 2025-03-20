<script>
    export let data = {};
    export let hLevel = 2;
</script>

<article>
    <svelte:element this={"h" + hLevel}>{data.title}</svelte:element>
    <img src={data.image} alt="">
    <div>
        <p>{data.description}</p>
        <div class="year">{data.year}</div>
    </div>
</article>

<style>
    article {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3;
    text-wrap: balance;
    }
    
    div.year{
        font-style:italic;
        font-family:Baskerville;
    }
</style>