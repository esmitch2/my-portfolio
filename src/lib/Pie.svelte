<script>
    import * as d3 from 'd3';
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    // let arc = arcGenerator({
    //     startAngle: 0,
    //     endAngle: 2 * Math.PI
    // });

    // let data = [
    //     { value: 1, label: "apples" },
    //     { value: 2, label: "oranges" },
    //     { value: 3, label: "mangos" },
    //     { value: 4, label: "pears" },
    //     { value: 5, label: "limes" },
    //     { value: 5, label: "cherries" }
    // ];

    export let data = [];

    let sliceGenerator = d3.pie().value(d => d.value);

    // Define arcData and arcs outside the reactive block
    let arcData;
    let arcs;

        $: {
            // Reactively calculate arcData and arcs the same way we did before with sliceGenerator and arcGenerator
            arcData = sliceGenerator(data);
            arcs = arcData.map(d => arcGenerator(d));
        }

    // let arcData = sliceGenerator(data);
    // let arcs = arcData.map(d => arcGenerator(d));

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    export let selectedIndex = -1;

</script>

<div class="container">

    <svg viewBox="-50 -50 100 100">
        {#each arcs as arc, index}
            <path d={arc} fill={ colors(index) }
                class:selected={selectedIndex === index}
                on:click={e => selectedIndex = selectedIndex === index ? -1 : index} />
        {/each}
    </svg>

    <ul class="legend">
        {#each data as d, index}
            <li style="--color: { colors(index) }" class:selected={selectedIndex === index}>
                <span class="swatch"></span>
                {d.label} <em>({d.value})</em>
            </li>
        {/each}
    </ul>

</div>

<style>

/* Container styling */
div.container {
    display: flex;
    gap: 2em; /* Space between SVG and legend */
    align-items: center; /* Align items at the top */
}

/* SVG styling */
svg {
    max-width: 20em;
    margin-block: 2em;
    overflow: visible;
}

/* Swatch box styling */
span.swatch {
    display: inline-block;
    background-color: var(--color);
    width: 20px;
    height: 20px;
    vertical-align: middle;
    border-radius: 10%;
}

/* Legend styling */
ul.legend {
    display: grid; /* Use grid layout for the legend */
    grid-template-columns: repeat(auto-fill, minmax(8em, 1fr)); /* Automatically adjust columns */
    gap: 0.5em; /* Reduce spacing between rows and columns */
    list-style: none;
    padding: 5px; /* Remove any extra padding */
    margin: 0; /* Remove extra margin around the list */
    border: solid 1px lightgrey;
    flex: 1 1 auto; /* Allow the legend to expand but not stretch vertically */
    min-width: 200px; /* Minimum width to avoid collapsing too much */
}

/* List item (li) styling */
ul.legend li {
    margin: 0; /* Remove extra margin from the list items */
    display: flex;
    align-items: center; /* Align the swatch and text */
    gap: 0.5em; /* Space between the swatch and the text */
    padding: 0; /* Remove padding from individual items */
}

/* Optional: Style the <em> tag to adjust font style */
ul.legend li em {
    font-style: normal; /* Adjust if you need different styling */
}

svg:has(path:hover) path:not(:hover) {
	opacity: 50%;
}

path {
	transition: 300ms;
}

/* When a path is selected, make all non-selected paths 50% opacity */
svg:has(.selected) path:not(.selected) {
   opacity: 50%;
}

.selected {
	--color: oklch(60% 45% 0) !important;
	
	&:is(path) {
		fill: var(--color) !important;
	}
	
	&:is(li) {
		color: var(--color);
	}
}

ul:has(.selected) li:not(.selected) {
	color: gray;
}

path:hover {
	opacity: 100% !important;
}



</style>

