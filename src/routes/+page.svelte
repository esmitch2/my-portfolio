<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
</script>

<svelte:head>
  <title>Home: Erin Mitchell</title>
</svelte:head>

<body>
    <div class="home">
        <h1>Erin Mitchell</h1>

        <p>Hi! My name is Erin Mitchell, I'm a student at MIT in the Master's of Transportation program. I like to travel and take pictures, and I took the photo below in Iceland.</p>

        <img src="/images/mountain.jpeg" alt="A photo of a sunset over water" style="width:400px"> 
    </div>

    <h2>Recent Work:</h2>
    <div class="projects">
      {#each projects.slice(0, 3) as p}
        <Project data={p} hLevel="3" />
      {/each}
    </div>

</body>