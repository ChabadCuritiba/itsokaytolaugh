# It's okay to laugh. Seriously.

*Joy is a serious practice.*

A static site (plain HTML, CSS, and JavaScript, no build step) hosted on Firebase Hosting.

## Pages

| URL | File |
| --- | --- |
| `/` | `public/index.html`: hero, manifesto marquee, Big Question, essays, practices, about, CTA |
| `/essays` | `public/essays.html`: all essays with filters |
| `/essays/<slug>` | `public/essays/<slug>.html`: single essay template |
| `/about` | `public/about.html`: The Quest |
| `/practices` | `public/practices.html`: interactive laugh reset, No-Complain experiment, joy journal |

## Deploy to Firebase

1. Install the CLI: `npm install -g firebase-tools`
2. Log in: `firebase login`
3. Put your project ID in `.firebaserc` (or run `firebase use --add`)
4. Preview locally: `firebase emulators:start --only hosting` (or `firebase serve`)
5. Deploy: `firebase deploy --only hosting`

## Editing

- **Header, footer, and the newsletter CTA** are injected by `public/assets/js/main.js`, so you edit them in one place.
- **Essay cards** (home, essays page, "keep reading") come from the `ESSAYS` array in `main.js`.
- **Adding an essay:** copy any file in `public/essays/`, change its text, and add an entry to `ESSAYS`.
- **Hebrew terms:** wrap a term like this:
  `<span class="heb">galut<span class="tip"><span class="he">גלות</span>Exile.</span></span>`
- **Pull quotes:** `<div class="pullquote"><p><span>Your line.</span></p></div>`
- **Scripture:** `<blockquote class="scripture">"…"<cite>Psalms 126:2</cite></blockquote>`
- **About photo:** add `public/assets/img/about.jpg` and swap the placeholder in `index.html` and `about.html` (marked with a comment).
- **Newsletter:** set `SIGNUP_ENDPOINT` at the top of `main.js` (Formspree, Mailchimp, ConvertKit, or a Firebase Function). It POSTs JSON `{ email }`. Until you set it, the form says sign-ups aren't connected yet.

## Design tokens

Cream `#FFF8EC` · Ink `#1A1A1A` · Joy Yellow `#FFC93C` · Redemption Blue `#4A7CFF` · Soft Coral `#FF6B6B`
Headlines: Fraunces. Body: Inter. Both load from Google Fonts.
