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

        <img src="./images/mountain.jpg" alt="A photo of a mountain" style="width:400px"> 
    </div>

    <h2>My GitHub Stats:</h2>

  
    {#await fetch("https://api.github.com/users/esmitch2")}
      <p>Loading...</p>
    {:then response}
      {#await response.json()}
        <p>Decoding...</p>
      {:then data}
        <section>
          <dl>
            <dt>Followers:</dt>
            <dd>{data.followers}</dd>
            <dt>Following:</dt>
            <dd>{data.following}</dd>
            <dt>Public Repositories:</dt>
            <dd>{data.public_repos}</dd>
          </dl>
        </section>
      {:catch error}
        <p class="error">Something went wrong: {error.message}</p>
      {/await}
    {:catch error}
      <p class="error">Something went wrong: {error.message}</p>
    {/await}
  


    <h2>Recent Work:</h2>
    <div class="projects">
      {#each projects.slice(0, 3) as p}
        <Project data={p} hLevel="3" />
      {/each}
    </div>

</body>

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
</style>