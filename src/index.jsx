import { renderToReadableStream } from "react-dom/server"

import Header from './header'
import Footer from './footer'
import Home from './home'

const pages = {
    home: { head: () => <link rel="stylesheet" href="/css/home.css"/>, body: Home }
}

async function renderPage(page) {
    return new Response(
    await renderToReadableStream(
    <html>
        <head>
            <title>KAP Archive</title>
            <link rel="stylesheet" href="/css/index.css"/>
            <page.head />
        </head>
        <body>
            <Header />
            <page.body />
            <Footer />
        </body>
    </html>,
    ),
    );
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
                // return pages.home();
                return renderPage(pages.home)
            } else if (pathname.match(/assets\/[a-z0-9-_]+\.(svg|png|jpeg|ico)/i) || pathname.match(/css\/[a-z0-9-_]+\.css/i)) {
                return new Response(Bun.file(pathname.slice(1)))
            }
        }
        return new Response('404 not found', { status: 404})
    },
}