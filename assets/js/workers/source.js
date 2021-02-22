// Current Version: 1.0.9
// Description: Using Cloudflare Workers to map and mirror hezhijie0327's repos.

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const mirror = {
        private: [],
        public: ["github.com.cnpmjs.org", "hub.fastgit.org"],
    };
    let url = request.url.substr(8);
    path = url.split("/");
    url = url.substr(url.indexOf("/") + 1);
    var response = "";
    if (url !== "") {
        if (url.startsWith("https://")) {
            return Response.redirect("https://" + path[0] + "/" + url.replace(/^https\:\/\/(((?:codeload)?(?:\.)?github\.com)|(?:raw)?(?:\.)?(githubusercontent\.com))\/hezhijie0327\//gim, ""), 301);
        }
        var response_archive_blob_clone_edit_raw_release = await fetch("https://github.com/hezhijie0327/" + url);
        var response_codeload = await fetch("https://codeload.github.com/hezhijie0327/" + url);
        var response_raw = await fetch("https://raw.githubusercontent.com/hezhijie0327/" + url);
        if (response_archive_blob_clone_edit_raw_release.status === 200) {
            if (path[1].endsWith(".git")) {
                var mirror_url = mirror.private.concat(mirror.public);
                var redirect = mirror_url[Math.floor(Math.random() * mirror_url.length)];
                return Response.redirect("https://" + redirect + "/hezhijie0327/" + url, 302);
            } else {
                if (path[2] === "archive" || (path[2] === "releases" && path[3] === "download")) {
                    response = response_archive_blob_clone_edit_raw_release;
                } else if (path[2] === "blob" || path[2] === "edit" || path[2] === "raw") {
                    for (var i = 0; i < path.length; i++) {
                        if (i === 0) {
                            url = path[i];
                        } else if (i === 2) {
                            url = url;
                        } else {
                            url = url + "/" + path[i];
                        }
                    }
                    return Response.redirect("https://" + url, 301);
                }
            }
        } else if (response_codeload.status === 200) {
            response = response_codeload;
        } else if (response_raw.status === 200) {
            response = response_raw;
        }
    }
    if (response !== "") {
        if (url.includes(".conf") || url.includes(".dockerfile") || url.includes(".txt")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "text/plain;charset=UTF-8",
                },
            });
        } else if (url.includes(".css")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "text/css;charset=UTF-8",
                },
            });
        } else if (url.includes(".dat")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "application/octet-stream;charset=UTF-8",
                },
            });
        } else if (url.includes(".eot")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "application/vnd.ms-fontobject;charset=UTF-8",
                },
            });
        } else if (url.includes(".gz")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "application/gzip;charset=UTF-8",
                },
            });
        } else if (url.includes(".html")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "text/html;charset=UTF-8",
                },
            });
        } else if (url.includes(".jpg")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "image/jpeg;charset=UTF-8",
                },
            });
        } else if (url.includes(".js")) {
            if (url.includes(".json")) {
                return new Response(response.body, {
                    status: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "content-type": "application/json;charset=UTF-8",
                    },
                });
            } else {
                return new Response(response.body, {
                    status: 200,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "content-type": "text/javascript;charset=UTF-8",
                    },
                });
            }
        } else if (url.includes(".png")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "image/png;charset=UTF-8",
                },
            });
        } else if (url.includes(".py")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "text/x-python;charset=UTF-8",
                },
            });
        } else if (url.includes(".sh")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "application/x-sh;charset=UTF-8",
                },
            });
        } else if (url.includes(".svg")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "image/svg+xml;charset=UTF-8",
                },
            });
        } else if (url.includes(".ttf")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "font/ttf;charset=UTF-8",
                },
            });
        } else if (url.includes(".woff")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "font/woff;charset=UTF-8",
                },
            });
        } else if (url.includes(".woff2")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "font/woff2;charset=UTF-8",
                },
            });
        } else if (url.includes(".yaml") || url.includes(".yml")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "application/yaml;charset=UTF-8",
                },
            });
        } else if (url.includes(".zip")) {
            return new Response(response.body, {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "application/zip;charset=UTF-8",
                },
            });
        } else {
            return new Response(response.body, {
                status: response.status,
                headers: response.headers,
            });
        }
    } else {
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
    }
}
