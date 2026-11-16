# Grow Through Chess – website

This website is built with [Hugo](https://gohugo.io). All texts are written in
simple text files (Markdown, `.md`). You do **not** need to know HTML to change
them.

When changes are pushed to the `main` branch on GitHub, the website is rebuilt
and published automatically (this takes about a minute).

---

## Where is what?

```
content/                  ← ALL TEXTS OF THE WEBSITE
│
├── _index.nl.md          Home page: big heading + image at the top (Dutch)
├── _index.en.md          Home page: big heading + image at the top (English)
├── homepage/             Home page: the blocks below the big image
│   ├── 1-schaaklessen.nl.md / .en.md
│   └── 2-doelen.nl.md       / .en.md
├── schaaklessen/         "Schaaklessen" page (text + information blocks)
├── about/                "Over ons" page (text + teachers)
├── inschrijven/          "Inschrijven" page (text + Google Form)
└── contact/              "Contact" page (text)

assets/images/            ← ALL IMAGES (photos, logo, backgrounds)
data/contact.yaml         ← Email, address and Facebook link (used everywhere)
config.toml               ← Site name, menu, default Google description
i18n/                     ← Small fixed words ("Adres:", "Pagina niet gevonden", ...)

layouts/, assets/scss/    ← The design (HTML/CSS). Normally no need to touch.
```

Every page exists twice: `.nl.md` is Dutch, `.en.md` is English.
**When you change a text, don't forget the other language.**

---

## How a text file works

Each file has two parts:

```markdown
---
title: "Schaaklessen"
description: "Text that Google shows in the search results."
---

Here comes the normal text of the page.
```

1. **Between the two `---` lines: the settings** (title, image, button, …).
   - Keep the format `name: "value"`. Put text between `"quotes"`.
   - Indentation (spaces at the start of a line) matters: copy the existing
     indentation exactly. Use spaces, never tabs.
   - Lines starting with `#` are comments: they are ignored by the website.
2. **Below the second `---`: the text of the page**, written in Markdown.

### Markdown cheat sheet

| You write                     | You get                         |
| ----------------------------- | ------------------------------- |
| `## Our mission`              | A heading                       |
| `**bold**`                    | **bold**                        |
| `*italic*`                    | *italic*                        |
| `[click here](https://...)`   | A link                          |
| `- item`                      | A bullet list                   |
| An empty line                 | A new paragraph                 |
| `![Description](images/x.jpg)`| An image from `assets/images/`  |

---

## Common changes

### Change a text
Open the right file in `content/`, change the text, save. Done.

### Change the price, duration, location, … (Schaaklessen page)
Open `content/schaaklessen/index.nl.md` (and `index.en.md`). The blocks are
under `info:`. Each block looks like this:

```yaml
  - icon: price
    title: "Prijs?"
    text: "€200 voor 10 lessen voor de eerste 24 deelnemers, daarna €220."
```

To add a block, copy one (all three lines), paste it underneath and change it.
Available icons: `people`, `book`, `clock`, `location`, `price`.

### Change the frequently asked questions (Schaaklessen page)
Under `faq:` in `content/schaaklessen/index.nl.md` (and `.en.md`):

```yaml
  - question: "Hoe groot zijn de groepen?"
    answer: "We geven les in groepjes van zes."
```

Copy both lines to add a question. Links are allowed in the answer, e.g.
`[Inschrijven](/inschrijven/)`. Remove all `faq:` lines to hide the section.

### Add or change a teacher (Over ons page)
Open `content/about/index.nl.md` (and `index.en.md`). Teachers are under `team:`:

```yaml
  - name: "Christilla Rousseau"
    role: "Lesgever groep beginners"
    photo: "images/Christilla.png"
```

Put the photo in `assets/images/` and use its file name. The teachers are shown
in the text where `{{< team >}}` is written.

### Change or replace an image
Put the new image in `assets/images/` and change the file name in the text file
(for example `image: "images/my-new-photo.jpg"`). Images are automatically made
smaller and faster for the website, so you can use large photos.
Tip: avoid spaces in file names.

### Change the email address, address or Facebook link
Edit `data/contact.yaml`. This updates the contact page, the map, the footer
and the information for Google at once.
(The address is also written in the "Locatie?" block on the Schaaklessen page.)

### Change the registration form
In `content/inschrijven/index.nl.md` (and `.en.md`), change the link after `form:`.

### Add a block on the home page
Copy a file in `content/homepage/` (both languages), give it a new name and
change the text. `weight:` decides the order (1 = first).

### Change the menu
The menu items are in `config.toml` under `menu.main`, once per language.

---

## Search engines (Google)

Every page has, in its settings:

- `title` – the heading of the page; also used in the browser tab and Google.
- `description` – the short text Google shows below the link. Keep it around
  120–155 characters and mention what people search for ("schaaklessen Leuven").
- `seoTitle` (optional) – a different title for the browser tab and Google.
- `slug` (optional) – the web address of the page, e.g. `slug: "over-ons"`
  gives `growthroughchess.com/over-ons/`. If you change a slug, add the old
  address to `aliases:` so old links keep working. Links in buttons
  (`buttonLink: "about"`) use the folder name and follow the slug automatically.

The image shown when a page is shared on Facebook/WhatsApp is
`assets/images/share-image.jpg` (1200 × 630 pixels), set in `config.toml`.

---

## Preview the website on your own computer

1. Install [Hugo (extended version)](https://gohugo.io/installation/).
2. Open a terminal in this folder and run `hugo server`.
3. Open <http://localhost:1313> in your browser. The page refreshes
   automatically every time you save a file.

If something is wrong in a file (for example missing quotes), the terminal
shows an error with the file name and line number.
