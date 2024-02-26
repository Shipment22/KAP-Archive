# kap-archive

## About

[The KAP Archive](https://kap-archive.bhavjit.com/) is an archival site that focuses on preserving program's from [Khan Academy](https://khanacademy.org/)'s KACP section;
This project is in no way offiliated with or endoresed by Khan Academy.
The project exists to preserve code from hidden/deleted programs and banned users on KACP.

### Why?

This archive was created due to many KACP users being banned with all their programs hidden or deleted, many of these were works which I believe should be preserved. 
There has also been many programs removed from public view or entirely deleted of which I believe should also be preserved; For example Karlson 3D which was removed for alleged violence, in my opinion it was a display of skill in 3D game development on a platform that had previously seen virtually none.
Many programs have been removed that in my opinion should not have been, which has spawned this project.

## How you can help

The easiest way to help would be to use [the KAP Archive site](https://kap-archive.bhavjit.com/) and give feedback on your user experience. If you have the code to programs which have already been deleted you should check out the [Request Hidden/Deleted Program form](https://kap-archive.bhavjit.com/request_by_code). Telling KACP users about this project would also be a great help. If you want to discuss archival, development or UX you can contact `@shipment22` on Discord.


## Development

This project uses Bun, React (for server-side rendering), SCSS and `bun:sqlite`.


### Useful info for newcomers

I try to comment code and keep it readable, but here's some info that might help out more with development:

- Database initialization is in [src/init.jsx](https://github.com/Shipment22/KAP-Archive/blob/main/src/init.jsx)
- Main file with all server code in [src/index.jsx](https://github.com/Shipment22/KAP-Archive/blob/main/src/index.jsx)
- Site pages are in [src/pages](https://github.com/Shipment22/KAP-Archive/tree/main/src/pages) using JSX to be rendered on the server; If you're new to JSX it's JS with HTML embeded and fairly easy to get a handle on.
- Components (cards, forms etc) are in [src/components](https://github.com/Shipment22/KAP-Archive/tree/main/src/components)
- Assets including images and the webmanifest are in [src/assets](https://github.com/Shipment22/KAP-Archive/tree/main/src/assets)
- Common bits of code which could be considered library functionality are stored in [src/libs](https://github.com/Shipment22/KAP-Archive/tree/main/src/libs)
- Client side Javascript is stored in [src/js](https://github.com/Shipment22/KAP-Archive/tree/main/src/js)
- All SCSS is stored in [src/scss](https://github.com/Shipment22/KAP-Archive/tree/main/src/scss) and ends up in `src/css` when compiled; If you haven't worked with SCSS, it's CSS syntax with Sass features, someone who's familiar with CSS should be able to adapt quickly.

  
To install dependencies:

```bash
bun install
```

To develop:

```bash
bun dev
```

To just build the CSS:

```bash
bun css
```

To run:

```bash
bun run index.jsx
```

This project was created using bun. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
