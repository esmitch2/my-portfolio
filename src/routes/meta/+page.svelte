<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import{
    computePosition,
    autoPlacement,
    offset,
  } from '@floating-ui/dom';
  import Bar from '$lib/Bar.svelte';

  let width = 1000, height = 600;

  let data = [];
  let commits = [];
  let cursor = {x: 0, y: 0};

  let commitTooltip;
  let tooltipPosition = {x: 0, y: 0};

  let clickedCommits = [];

  async function dotInteraction (index, evt) {
    let hoveredDot = evt.target;
    if (evt.type === "mouseenter") {
      hoveredIndex = index;
      cursor = {x: evt.x, y: evt.y};
      tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
        strategy: "fixed", // because we use position: fixed
        middleware: [
          offset(5), // spacing from tooltip to dot
          autoPlacement() // see https://floating-ui.com/docs/autoplacement
        ],
      });
    }

    else if (evt.type === "mouseleave") {
      hoveredIndex = -1
    }

    else if (evt.type === "click") {
      let commit = commits[index]
      if (!clickedCommits.includes(commit)) {
        // Add the commit to the clickedCommits array
        clickedCommits = [...clickedCommits, commit];
      }
      else {
          // Remove the commit from the array
          clickedCommits = clickedCommits.filter(c => c !== commit);
      }
    }

  }


  $: maxLength = Math.max(...data.map(d => d.length || 0));
  $: avgLength = data.length ? +(data.reduce((sum, d) => sum + d.length, 0) / data.length).toFixed(2) : 0;

  onMount(async () => {
    data = await d3.csv("./loc.csv", row => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + "T00:00" + row.timezone),
      datetime: new Date(row.datetime)
    }));

    commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
      let first = lines[0];
      let {author, date, time, timezone, datetime} = first;
      let ret = {
        id: commit,
        url: "https://github.com/vis-society/lab-7/commit/" + commit,
        author, date, time, timezone, datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length
      };

      // Like ret.lines = lines
      // but non-enumerable so it doesn’t show up in JSON.stringify
      Object.defineProperty(ret, "lines", {
        value: lines,
        configurable: true,
        writable: true,
        enumerable: false,
      });

      return ret;
    });

    // console.log(data)
    console.log(commits)

  });

  $: minDate = d3.min(commits.map(d => d.date));
  $: maxDate = d3.max(commits.map(d => d.date));
  $: maxDatePlusOne = new Date(maxDate);
  $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);

  $: xScale = d3.scaleTime()
                .domain([minDate, maxDatePlusOne])
                .range([usableArea.left, usableArea.right])
                .nice();

  $: yScale = d3.scaleLinear()
                .domain([24, 0])
                .range([usableArea.bottom, usableArea.top]);

  let margin = {top: 10, right: 10, bottom: 30, left: 20};

  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left
  };
  usableArea.width = usableArea.right - usableArea.left;
  usableArea.height = usableArea.bottom - usableArea.top;

  let xAxis, yAxis;
  $: {
    d3.select(xAxis).call(d3.axisBottom(xScale));
    d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
  }

  let yAxisGridlines;
  $: {
	d3.select(yAxisGridlines).call(
		d3.axisLeft(yScale)
		  .tickFormat("")
		  .tickSize(-usableArea.width)
	);
}

let hoveredIndex = -1;
$: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};


$: allTypes = Array.from(new Set(data.map(d => d.type)));
$: selectedLines = (clickedCommits.length > 0 ? clickedCommits : commits).flatMap(d => d.lines);
$: selectedCounts = d3.rollup(
    selectedLines,
    v => v.length,
    d => d.type
);
$: languageBreakdown = allTypes.map(type => [type, selectedCounts.get(type) || 0]);







</script>



<svelte:head>
  <title>Meta</title>
</svelte:head>

<h1>Meta</h1>
<p>This page includes stats about the code of this website.</p>

<h2>Summary Stats:</h2>

<dl class="stats">
	<dt>Total <abbr title="Lines of code">LOC</abbr></dt>
	<dd>{data.length}</dd>

  <dt>Commits</dt>
  <dd>{commits.length}</dd>

  <dt>Longest Line</dt>
  <dd>{maxLength}</dd>

  <dt>Average Line</dt>
  <dd>{avgLength}</dd>

</dl>

<h3>Commits by time of day</h3>
<svg viewBox="0 0 {width} {height}">
  <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
  <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
  <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />


	<g class="dots">
    {#each commits as commit, index }
      <circle
      class:selected={ clickedCommits.includes(commit) }
      on:click={ evt => dotInteraction(index, evt) }
      on:mouseenter={evt => dotInteraction(index, evt)}
      on:mouseleave={evt => dotInteraction(index, evt)}
        cx={ xScale(commit.datetime) }
        cy={ yScale(commit.hourFrac) }
        r="5"
        fill="steelblue"
      />
      
    {/each}
  </g>

    
</svg>

<Bar data={languageBreakdown} width={width} />


<dl class="info tooltip" hidden={hoveredIndex === -1} style="top: {tooltipPosition.y}px; left: {tooltipPosition.x}px" bind:this={commitTooltip}>

  <dt1>Commit</dt1>
	<dd1><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd1>

  <dt1>Author</dt1>
  <dd1>{ hoveredCommit.author }</dd1>

	<dt1>Date</dt1>
	<dd1>{ hoveredCommit.datetime?.toLocaleString("en", {dateStyle: "full"}) }</dd1>

  <dt1>Time</dt1>
  <dd1>{ hoveredCommit.datetime?.toLocaleString("en", {timeStyle: "long"})}</dd1>

  <dt1>Lines</dt1>
  <dd1>{ hoveredCommit.totalLines}</dd1>


	<!-- Add: Time, author, lines edited -->
</dl>




<style>
  dl {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    row-gap: 0px;
    padding-bottom: 10px;
  }

  dt {
    grid-row: 1;
    font: inherit;
    font-size: larger;
    color: grey;
    text-align: left;
  }

  dd {
    grid-row: 2;
    font: inherit;
    font-weight: bold;
    font-size: 150%;
    text-align: left;
    margin:0;
    padding:0;
  }

  svg {
		overflow: visible;
	}

  .gridlines {
    stroke-opacity: .2;
  }









  dl.info {
    display: grid;
    grid-template-columns: auto; /* Two columns: one for dt (auto) and one for dd (1fr) */
    grid-auto-rows: auto; /* Ensures rows expand to fit content */
    row-gap: 0.5em; /* Space between rows */
    column-gap: 0.5em; /* Space between dt and dd */
    margin: 0;

    transition-duration: 500ms;
    transition-property: opacity, visibility;

    &[hidden]:not(:hover, :focus-within) {
      opacity: 0;
      visibility: hidden;
    }
  }

  dl.info dt1 {
    color: gray;
    font-weight: normal;
    text-align: right; /* Align dt to the right */
    margin: 0;
    grid-column: 1;
  }

  dl.info dd1 {
    font-weight: bold;
    margin: 0;
    grid-column: 2;
  }

  .tooltip {
    position: fixed;
    top: 1em;
    left: 1em;
    background: white;
    border: 1px solid #ccc;
    padding: 1em;
    border-radius: 0.5em;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }













  circle {
    transform-origin: center;
    transform-box: fill-box;

    transition: 200ms;

    &:hover {
      transform: scale(1.5);
    }
    
  }

  .selected {
    fill: orange;
    /* fill: var(--color-accent); */
  }



</style>