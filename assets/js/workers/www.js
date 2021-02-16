// Current Version: 1.0.1
// Description: Using Cloudflare Workers to deploy hezhijie0327/hezhijie0327.github.io to www.zhijie.online.

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    let url = request.url.substr(8);
    url = url.substr(url.indexOf("/") + 1);
    var response = await fetch("https://raw.githubusercontent.com/hezhijie0327/hezhijie0327.github.io/main/" + url);
    if (url === "") {
        return Response.redirect("https://www.zhijie.online/index.html", 301);
    } else if (response.status !== 200) {
        var response = await fetch("https://raw.githubusercontent.com/hezhijie0327/hezhijie0327.github.io/main/404.html");
        return new Response(response.body, {
            status: 404,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "content-type": "text/html;charset=UTF-8",
            },
        });
    } else {
        return new Response(response.body, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "content-type": "text/html;charset=UTF-8",
            },
        });
    }
}
