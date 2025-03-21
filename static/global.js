console.log("IT’S ALIVE!");

function $$ (selector, context = document) {
	return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");
// let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname)
// if (currentLink) { // or if (currentLink !== undefined)
// 	currentLink.classList.add("current");
// }

// let pages = [
// 	{url: ".", title: "Home"},
// 	{url: "projects", title: "Projects"},
//     {url: "contact", title: "Contact"},
//     {url: "resume", title: "Resume"},
//     {url: "https://github.mit.edu/esmitch/portfolio", title: "GitHub"},
// 	// add the rest of your pages here
// ];

const ARE_WE_HOME = document.documentElement.classList.contains("home");

// let nav = document.createElement("nav");
// document.body.prepend(nav);

for (let p of pages) {
	let url = p.url;
    if (!ARE_WE_HOME && !url.startsWith("http")) {
        url = "../" + url;
    }
    
	let title = p.title;
	// Create link and add it to nav
	let a = document.createElement("a");
    a.href = url;
    a.textContent = title;
    
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add("current");
    }

    if (a.host !==location.host) {
        a.target = "_blank";
    }

    nav.append(a);

}


// document.body.insertAdjacentHTML("afterbegin", `
// 	<label class="color-scheme">
// 		Theme:
// 		<select>
// 			<option value="light dark">Automatic</option>
//             <option value="light">Light</option>
//             <option value="dark">Dark</option>
// 		</select>
// 	</label>`
// );

// let select = document.querySelector("select");

// select.addEventListener("input", function (event) {
// 	console.log("color scheme changed to", event.target.value);
//     document.documentElement.style.setProperty("color-scheme", event.target.value);
//     localStorage.colorScheme = event.target.value;
// });


// if (localStorage.colorScheme) {
// 	document.documentElement.style.setProperty("color-scheme", localStorage.colorScheme);
// 	select.value = localStorage.colorScheme;
// }
