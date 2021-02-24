// Current Version: 1.1.1
// Description: Using Cloudflare Workers to deploy hezhijie0327/hezhijie0327.github.io's static files and redirect the files from jsDelivr.

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    let url = request.url.substr(8);
    url = url.substr(url.indexOf("/") + 1);
    const forced_mirror = false;
    var response_hezhijie0327 = await fetch("https://raw.githubusercontent.com/hezhijie0327/hezhijie0327.github.io/main/" + url);
    var response_jsdelivr_gh = await fetch("https://cdn.jsdelivr.net/gh/" + url);
    var response_jsdelivr_npm = await fetch("https://cdn.jsdelivr.net/npm/" + url);
    if (url === "" || (response_hezhijie0327.status !== 200 && response_jsdelivr_gh.status !== 200 && response_jsdelivr_npm.status !== 200)) {
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
        if (response_hezhijie0327.status === 200) {
            if (url.includes(".html")) {
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
            } else {
                if (forced_mirror === false && response_hezhijie0327.headers.get("Content-Length") <= Math.pow(2, 18)) {
                    if (url.includes(".css")) {
                        return new Response(response_hezhijie0327.body, {
                            status: 200,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "content-type": "text/css;charset=UTF-8",
                            },
                        });
                    } else if (url.includes(".eot")) {
                        return new Response(response_hezhijie0327.body, {
                            status: 200,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "content-type": "application/vnd.ms-fontobject;charset=UTF-8",
                            },
                        });
                    } else if (url.includes(".jpg")) {
                        return new Response(response_hezhijie0327.body, {
                            status: 200,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "content-type": "image/jpeg;charset=UTF-8",
                            },
                        });
                    } else if (url.includes(".js")) {
                        return new Response(response_hezhijie0327.body, {
                            status: 200,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "content-type": "text/javascript;charset=UTF-8",
                            },
                        });
                    } else if (url.includes(".png")) {
                        return new Response(response_hezhijie0327.body, {
                            status: 200,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "content-type": "image/png;charset=UTF-8",
                            },
                        });
                    } else if (url.includes(".svg")) {
                        return new Response(response_hezhijie0327.body, {
                            status: 200,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "content-type": "image/svg+xml;charset=UTF-8",
                            },
                        });
                    } else if (url.includes(".ttf")) {
                        return new Response(response_hezhijie0327.body, {
                            status: 200,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "content-type": "font/ttf;charset=UTF-8",
                            },
                        });
                    } else if (url.includes(".woff")) {
                        return new Response(response_hezhijie0327.body, {
                            status: 200,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "content-type": "font/woff;charset=UTF-8",
                            },
                        });
                    } else if (url.includes(".woff2")) {
                        return new Response(response_hezhijie0327.body, {
                            status: 200,
                            headers: {
                                "Access-Control-Allow-Origin": "*",
                                "content-type": "font/woff2;charset=UTF-8",
                            },
                        });
                    } else {
                        return new Response(response_hezhijie0327.body, {
                            status: response.status,
                            headers: response.headers,
                        });
                    }
                } else {
                    return Response.redirect("https://cdn.jsdelivr.net/gh/hezhijie0327/hezhijie0327.github.io@main/" + url, 301);
                }
            }
        } else if (response_jsdelivr_gh.status === 200) {
            return Response.redirect("https://cdn.jsdelivr.net/gh/" + url, 301);
        } else {
            return Response.redirect("https://cdn.jsdelivr.net/npm/" + url, 301);
        }
    }
}
