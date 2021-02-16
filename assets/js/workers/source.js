// Current Version: 1.0.1
// Description: Using Cloudflare Workers to map and mirror hezhijie0327's repos.

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    let url = request.url.substr(8);
    path = url.split("/");
    url = url.substr(url.indexOf("/") + 1);
    var response = "";
    var response_archive_release = await fetch("https://github.com/hezhijie0327/" + url);
    var response_raw = await fetch("https://raw.githubusercontent.com/hezhijie0327/" + url);
    if (response_archive_release.status === 200) {
        if (path[2] === "archive" || (path[2] === "releases" && path[3] === "download")) {
            response = response_archive_release;
        }
    } else if (response_raw.status === 200) {
        response = response_raw;
    }
    if (response !== "") {
        return new Response(response.body, {
            status: 200,
            headers: response.headers,
        });
    } else {
        var response = await fetch("https://raw.githubusercontent.com/hezhijie0327/hezhijie0327.github.io/main/404.html");
        return new Response(response.body, {
            status: 404,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "content-type": "text/html;charset=UTF-8",
            },
        });
    }
}
