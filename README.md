# gatsby-theme-codex

A Gatsby theme to bootstrap your own digital codex.

- [Motivation](#motivation)
  - [Why build stock anyway?](#why-build-stock-anyway)
  - [Why call it a codex?](#why-call-it-a-codex)
  - [Other solutions](#other-solutions)
- [Getting started](#getting-started)
  - [Folder structure](#folder-structure)
  - [Configuration options](#configuration-options)

**_Note_**: _Gatsby themes are an experimental feature. Proceed with caution!_ ⚠️

## Motivation

I created `gatsby-theme-codex` after reading a very influential post from [Tom Critchlow](https://tomcritchlow.com/2019/02/17/building-digital-garden/) called [Building a digital garden](https://tomcritchlow.com/2019/02/17/building-digital-garden/). This led me to other great pieces of writing, including Robin Sloan's [Stock vs Flow](http://snarkmarket.com/2010/4890).

> _Stock is the durable stuff. It’s the content you produce that’s as interesting in two months (or two years) as it is today. It’s what people discover via search. It’s what spreads slowly but surely, building fans over time._

`gatsby-theme-codex` is a place to build your stock.

### Why build stock anyway?

_Before taking my word for it, I highly recommend reading the above blog posts._

I take a lot of notes on just about everything. You might do the same, whether it be in a digital notebook or a physical one. The idea of the codex is to share these notes with the world. Publish them in the open. Evolve them over time and watch them grow.

### Why call it a codex?

This is just my name choice for a digital garden. It's inspired by Leonardo Da Vinci, who was esteemed for his detailed notebooks.

### Other solutions

[John Otander](https://github.com/johno) is building a project called [gatsby-theme-digital-garden](https://github.com/johno/digital-garden) that I highly recommend you check out if you are at all interested in this concept. [His livestream with Jason Lengstorf](https://www.youtube.com/watch?v=PS2784YfPpw) on Gatsby themes was super helpful, and he's building a much more robust version of a digital garden than this project. I decided to roll my own for learning purposes / less requirements / quicker turnaround.

## Getting started

```
yarn add gatsby-theme-codex gatsby react react-dom

# or

npm install gatsby-theme-codex gatsby react react-dom
```

Add the following to your `gatsby-config.js` file:

```js
// gatsby-config.js

module.exports = {
  __experimentalThemes: ['gatsby-theme-codex']
}
```

Finally, create a `codex` directory at the root of your project:

```
codex/
gatsby-config.js
package.json
```

### Folder structure

The codex has the following structure:

```
codex/
├── topic-name/
    └── entry-name-1.md
    └── entry-name-2.mdx
```

`gatsby-theme-codex` supports entries as `.md` or `.mdx` files.

### Configuration options

#### `src`

You can optionally tell `gatsby-theme-codex` where your entries are by adding a `src` option. This is helpful if you don't want to have a `codex` directory at the root of your project, or if you want to name it something different:

```
src/
├── notes/
gatsby-config.js
package.json
```

```js
// gatsby-config.js

module.exports = {
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-codex',
      options: {
        src: 'src/notes'
      }
    }
  ]
}
```

#### `codexPath`

By default, `gatsby-theme-codex` will render your codex at `www.yoursite.com/codex/:topic/:entry`. You can change the codex path by passing a `codexPath` option inside of `gatsby-config.js`:

```js
// gatsby-config.js

module.exports = {
  __experimentalThemes: [
    {
      resolve: 'gatsby-theme-codex',
      options: {
        codexPath: '/custom-path'
      }
    }
  ]
}
```

The example above would render your content at `www.yoursite.com/custom-path/:topic/:entry`.
