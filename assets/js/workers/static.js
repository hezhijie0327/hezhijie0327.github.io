// Current Version: 1.0.0
// Description: Using Cloudflare Workers to redirect the files from hezhijie0327/hezhijie0327.github.io to jsDelivr.

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    let url = request.url.substr(8);
    url = url.substr(url.indexOf("/") + 1);
    var response_hezhijie0327 = await fetch("https://raw.githubusercontent.com/hezhijie0327/hezhijie0327.github.io/main/" + url);
    var response_jsdelivr_gh = await fetch("https://cdn.jsdelivr.net/gh/" + url);
    var response_jsdelivr_npm = await fetch("https://cdn.jsdelivr.net/npm/" + url);
    if (url == "" || (response_hezhijie0327.status != 200 && response_jsdelivr_gh.status != 200 && response_jsdelivr_npm.status != 200)) {
        var response = await fetch("https://raw.githubusercontent.com/hezhijie0327/hezhijie0327.github.io/main/404.html");
        return new Response(response.body, {
            status: 404,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "content-type": "text/html;charset=UTF-8",
            },
        });
    } else {
        if (response_hezhijie0327.status == 200) {
            return Response.redirect("https://cdn.jsdelivr.net/gh/hezhijie0327/hezhijie0327.github.io@main/" + url, 301);
        } else if (response_jsdelivr_gh.status == 200) {
            return Response.redirect("https://cdn.jsdelivr.net/gh/" + url, 301);
        } else {
            return Response.redirect("https://cdn.jsdelivr.net/npm/" + url, 301);
        }
    }
}
