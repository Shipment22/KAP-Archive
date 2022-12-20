import { renderToReadableStream } from "react-dom/server";

const pages = {
    home: async () => {
        return new Response(
        await renderToReadableStream(
        <html>
            <head>
                <title>Home | KAP Archive</title>
                <link rel="stylesheet" href="/css/index.css"/>
            </head>
            <body>
                <h1>Home</h1>
            </body>
        </html>,
        ),
        );
    },
}

export default {
    fetch(request) {
        // Get Url and method from request.
        const { url, method } = request;
        // Get Pathname form url.
        const { pathname } = new URL(url);
        // Get archive index html with file method.
        if (method === "GET") {
            if (pathname === "/") {
                return pages.home();
            } else if (pathname.match(/assets\/[a-z0-9-_]+\.(svg|png|jpeg|ico)/i) || pathname.match(/css\/[a-z0-9-_]+\.css/i)) {
                return new Response(Bun.file(pathname.slice(1)))
            }
        }
        return new Response('404 not found', { status: 404})
    },
}