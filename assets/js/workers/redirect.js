// Current Version: 1.0.0
// Description: Using Cloudflare Workers to redirect zhijie.online to www.zhijie.online.

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    return Response.redirect("https://www.zhijie.online", 301);
}
