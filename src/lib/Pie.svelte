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

    // let colors = d3.scaleOrdinal(d3.schemeTableau10);
    $: colors = d3.scaleOrdinal()
        .domain(data.map((_, i) => i))
        .range(d3.quantize(d3.interpolateBlues, data.length));



    export let selectedIndex = -1;

    let liveText = "";

    function toggleWedge (index, event) {
        if (!event.key || event.key === "Enter") {
            selectedIndex = selectedIndex === index ? -1 : index;
            const d = data[index];
            liveText = `${d.label}: ${d.value} projects selected.`;
        }
    }

    $: description = `A pie chart showing project counts by year. ${data.map(d => `${d.label}: ${d.value} projects`).join(', ')}.`;
    
    let showChart = true;

    function toggleView() {
        showChart = !showChart;
        liveText = showChart ? "Pie chart view shown." : "Table view shown.";
    }




</script>

<button 
  on:click={toggleView}
  aria-pressed={!showChart}
  aria-label="Toggle between pie chart and table view"
  class="toggle-button">
    {showChart ? 'Show Table' : 'Show Chart'}
</button>


{#if showChart}
<div class="container">

    <svg 
        viewBox="-50 -50 100 100"
        role="img"
        aria-labelledby="pie-title pie-desc">
        <title id="pie-title">Projects by Year</title>
        <desc id="pie=desc">{description}</desc>

        <circle class="pie-outline" r="50"/>

        {#each arcs as arc, index}
            <path d={arc} fill={ colors(index) }
                class:selected={selectedIndex === index}
                tabindex="0"
                role="button"
                aria-label={`Pie chart segment: ${data[index]?.label ?? index}`}
                on:click={e => toggleWedge(index, e)}
                on:keyup={e => toggleWedge(index, e)}
                />
        {/each}
        <!-- aria-label="wedge segment {data[index].label}" -->

    </svg>

    <p aria-live="polite" class="sr-only">{liveText}</p>

    <ul class="legend">
        {#each data as d, index}
            <li style="--color: { colors(index) }" class:selected={selectedIndex === index}>
                <span class="swatch"></span>
                {d.label} <em>({d.value})</em>
            </li>
        {/each}
    </ul>

</div>

{:else}

<table aria-label="Table showing project counts by year" class="data-table">
    <caption>Projects by Year</caption>
    <thead>
        <tr>
          <th id="year-header" scope="col">Year</th>
          <th id="projects-header" scope="col">Projects</th>
        </tr>
    </thead>      
    <tbody>
        {#each data as d, i}
          <tr>
            <th id="row-{i}" scope="row">{d.label}</th>
            <td aria-labelledby="row-{i} projects-header">{d.value}</td>
          </tr>
        {/each}
    </tbody>
</table>

{/if}

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
    outline: none;
}

svg:has(path:focus-visible) path:not(:focus-visible){
    opacity: 50%;
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

.sr-only {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.data-table {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-collapse: collapse;
  width: 100%;
  max-width: 30em;
}

.data-table caption {
  font-weight: bold;
  margin-bottom: 0.5em;
  text-align: left;
}

.data-table th,
.data-table td {
  border: 1px solid #ccc;
  padding: 0.5em;
  text-align: left;
}

.data-table th {
  background-color: #f0f0f0;
}

button{
    font: inherit;
}

.pie-outline {
    stroke: black;
    fill: none;
    stroke-width: 1;
}

path:focus-visible {
  stroke: white;
  stroke-width: 2px;
  stroke-dasharray: 4; /* Adjust the dash length as needed */
}



</style>
