# MEME DISTRICT

A responsive, single-page internet-culture showcase built with semantic HTML, CSS, and vanilla JavaScript modules. MEME DISTRICT is a Kenes Labs product, credited in the site footer with a restrained “Powered by Kenes Labs” wordmark treatment.

## Run locally

This project has no npm dependencies or build step.

1. Open the `meme-district` folder in Visual Studio Code.
2. Start a local server from the project root:
   - Python: `py -m http.server 5500`
   - Or use the VS Code Live Server extension.
3. Visit `http://localhost:5500`.

Serve the page over HTTP. Browser ES modules may not work when opening `index.html` directly with `file://`.

## Brand relationship

MEME DISTRICT remains the customer-facing product identity. Kenes Labs is credited as the parent studio through a restrained footer lockup: a small “POWERED BY” label, a typographic KENES LABS wordmark, and the studio tagline. The endorsement is intentionally secondary to the product brand and uses no improvised monogram or duplicate initial.

## Included experience

- Responsive hero, trending strip, editorial masonry feed, manifesto, and footer.
- 22 content entries: 18 meme cards (including 7 photo-led original caption memes), 2 short video cards, and 2 original audio cards. Includes a local-only mood check and a client-side meme creator that exports PNG.
- Search by words and category filters for memes, videos, and audio.
- Surprise-me spotlight, likes, share/fallback copy, and native preview dialog.
- Mobile navigation, keyboard search shortcut (`/`), Escape-to-clear search, and Escape-to-close mobile navigation.
- Native HTML5 audio/video controls. Only one media element plays at a time.
- Reduced-motion support and semantic landmarks/labels.

## Project structure

- `index.html` — page structure and accessibility landmarks.
- `css/style.css` — visual system and components.
- `css/responsive.css` — tablet and mobile layout rules.
- `css/animations.css` — motion and reduced-motion support.
- `js/content.js` — editable content data.
- `js/main.js` — rendering and app initialization.
- `js/filters.js` — search and category filtering.
- `js/interactions.js` — likes, preview, sharing, navigation, keyboard shortcuts, mood check, meme creator, and media lifecycle.
- `assets/audio/` — two locally stored original WAV sound effects.

## Media sources and attribution

The two video clips stream from Pexels and require an internet connection:

1. “Playful Cats in Sunlit Room Interaction” — video by Muhammad Khawar Nazir: https://www.pexels.com/video/playful-cats-in-sunlit-room-interaction-30074573/
2. “Colleagues Laughing while Working” — video by RDNE Stock project: https://www.pexels.com/video/colleagues-laughing-while-working-7414119/

Pexels states that its photos and videos are free to use, modification is allowed, and attribution is appreciated but not required. Its restrictions still apply. Review the current license before publishing: https://www.pexels.com/license/.

Both audio clips in `assets/audio/` are original synthesized sound effects created for this project. They are not samples from commercial recordings.


### Photo meme sources

The seven photo-led meme cards use Pexels photographs with original MEME DISTRICT captions. The photos are linked to their source pages and photographer credits appear on each card:

- Calico cat portrait — T. Zhuravel: https://www.pexels.com/photo/calico-cat-staring-at-camera-outdoors-33445317/
- Sleeping dog — Lisa Fotios: https://www.pexels.com/photo/sleeping-dog-1753144/
- Messy desk — Rachel Claire: https://www.pexels.com/photo/messy-desk-with-laptop-camera-films-and-cup-with-coffee-4997819/
- Student study desk — Tony Schnagl: https://www.pexels.com/photo/student-studying-on-a-wooden-table-5588404/
- Study papers and sticky notes — cottonbro studio: https://www.pexels.com/photo/crumpled-papers-and-sticky-notes-5185074/
- Tired golden retriever — Ryutaro Tsukata: https://www.pexels.com/photo/tired-cute-purebred-dog-resting-on-comfortable-sofa-5746274/
- Dog under sofa — Sidde: https://www.pexels.com/photo/dog-lying-under-sofa-18948630/

Pexels states that photos and videos may be used for free and modified, and attribution is appreciated. Its restrictions still apply: https://www.pexels.com/license/ and https://www.pexels.com/terms-of-service/. The photo URLs are remote CDN resources, so the photos require an internet connection.

Pinterest and meme roundups were consulted for general format inspiration (student procrastination, animal reactions and “five-minute break” jokes). Their images were not copied because public visibility does not establish reuse permission: https://www.pinterest.com/pin/gifs--184155072241507655/ ; https://parade.com/living/school-memes ; https://cheezburger.com/40449541/papers-purrcrastination-and-panic-20-cat-memes-to-claw-through-finals ; https://imgflip.com/meme/230197698/cat-sleep-keyboard-notebook.

## Important notes

- No backend, authentication, analytics, or account system is included; the brief does not require them.
- Likes are UI/session interactions and are not stored on a server.
- Video playback streams from Pexels; it will not work offline. If the competition requires a fully self-contained archive, obtain and include permitted local video copies and keep the full folder below 30 MB.
- The Google Fonts stylesheet uses an online font service. System fallback fonts remain available if the font service cannot be reached.
- Review all content and confirm the competition's permitted-assistance and third-party-media rules before submission. This package is AI-assisted; do not represent it as wholly unaided work.

## Final checks before submission

- Test at 360 px, 390 px, 430 px, tablet, and desktop widths.
- Test every filter and search query, clear filters, likes, share, preview dialog, and mobile menu.
- Play both WAV files and verify both Pexels video streams on the target network.
- Check the browser console for failed requests and JavaScript errors.
- Confirm the entire submission folder is below 30 MB.
- Confirm the public GitHub repository URL is accessible before submitting it to the competition portal.


## Kenes Labs brand endorsement

MEME DISTRICT retains its independent product identity. The footer uses a restrained, typographic “Powered by Kenes Labs” lockup: the parent-brand name is treated as a wordmark, separated from the descriptor by a fine rule. On narrow screens the endorsement remains on one line and the secondary tagline is hidden to avoid an awkward wrap.
