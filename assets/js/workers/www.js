// Current Version: 1.0.5
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
        var response = await fetch("https://raw.githubusercontent.com/hezhijie0327/hezhijie0327.github.io/main/status.html");
        response = await response.text();
        return new Response(
            response
                .replace(/\$\{COMMIT\}/gim, "哎呀！网页走丢啦～")
                .replace(/\$\{DETAIL\}/gim, "您无法访问：" + '<script type="text/javascript">document.write(window.location.href);</script>')
                .replace(/\$\{STATUS\}/gim, "404"),
            {
                status: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "text/html;charset=UTF-8",
                },
            }
        );
    } else {
        if (url.includes(".html")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "text/html;charset=UTF-8",
                },
            });
        } else {
            var response = await fetch("https://raw.githubusercontent.com/hezhijie0327/hezhijie0327.github.io/main/status.html");
            response = await response.text();
            return new Response(
                response
                    .replace(/\$\{COMMIT\}/gim, "哎呀！请在此处止步哟～")
                    .replace(/\$\{DETAIL\}/gim, "您无权访问：" + '<script type="text/javascript">document.write(window.location.href);</script>')
                    .replace(/\$\{STATUS\}/gim, "403"),
                {
                    status: 403,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "content-type": "text/html;charset=UTF-8",
                    },
                }
            );
        }
    }
}
