<script>

    import { page } from "$app/stores";

    let pages = [
        { url: "./", title: "Home" },
        { url: "./projects", title: "Projects" },
        { url: "./contact", title: "Contact" },
        { url: "https://github.mit.edu/esmitch/portfolio", title: "GitHub" }
        // add the rest of your pages here
    ];

    let localStorage = globalThis.localStorage ?? {};

    let colorScheme = localStorage.colorScheme ?? "light dark";
    let root = globalThis?.document?.documentElement;
    $: root?.style.setProperty("color-scheme", colorScheme);

    $: localStorage.colorScheme = colorScheme;



</script>

<nav>
    {#each pages as p}
    <a href={p.url} 
    class:current={"." + $page.route.id === p.url}
    target={p.url.startsWith("http") ? "_blank" : null}
    >
        {p.title}
    </a>

    {/each}
</nav>

<label class="color-scheme">
    Theme:
    <select bind:value={ colorScheme }>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
</label>



<slot />

<style>
    nav {
    display: flex;
    margin-bottom: 2%;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    --border-color: oklch(50% 10% 200 / 40%);
    border-bottom-color: var(--border-color);
    }

    nav a {
    flex: 15;
    text-decoration: none;
    color: inherit;
    text-align: center;
    padding: 0.5em;
    }

    nav a:hover {
    border-bottom-width: 0.4em;
    border-bottom-style: solid;
    border-bottom-color: var(--color-accent);
    /*background-color: oklch(from var(--color-accent) 95% 5% h)*/
    background-color: color-mix(in oklch, var(--color-accent), canvas 85%);
    }

    nav form {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1em;
    font: inherit;
    }

    nav label {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    font: inherit;
    }

    nav button {
    grid-column: 1 / -1;
    font: inherit;
    }

    nav input{
    font: inherit;
    }

    nav textarea{
    font: inherit;
    }

    .color-scheme{
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: inline-flex;
    gap: 4px;
    font-size:80%;
    font: inherit;
    }

</style>