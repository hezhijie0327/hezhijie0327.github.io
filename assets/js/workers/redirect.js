// Current Version: 1.0.1
// Description: Using Cloudflare Workers to redirect zhijie.online to www.zhijie.online.

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    let url = request.url.substr(8);
    url = url.substr(url.indexOf("/") + 1);
    return Response.redirect("https://www.zhijie.online/" + url, 301);
}
