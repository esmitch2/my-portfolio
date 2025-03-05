<svelte:head>
  <title>Contact</title>
</svelte:head>

<h1>Contact</h1>

<form action="mailto:esmitch@mit.edu" method="GET">
    <label>Email:
        <input name="email" type="email">
    </label>
    <label>Subject:
        <input name="subject">
    </label>
    <label>Body:
        <textarea name="body"></textarea>
    </label>
    <button type="submit">Submit</button>
</form>