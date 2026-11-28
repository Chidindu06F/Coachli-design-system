# Images

## Never an empty box

Until someone uploads their own image, Coachli shows a default:

| Missing | Default | Component |
| --- | --- | --- |
| Offering or event cover, product image, banner | The Coachli pattern placeholder | `Image placeholder` (Figma) / `<ImagePlaceholder>` (React) |
| Thumbnail under about 80px | The small pattern or the small logo | `Image placeholder` Ratio = Small pattern or Small logo |
| Profile photo (coach or customer) | Their initials on a tinted circle | `Avatar` Type = Initials |
| A person with no name (guest, empty seat) | A person icon | `Avatar` Type = Icon |

## Image placeholder

- Pick the ratio closest to the slot: **16:9** for covers and banners, **4:3** or **1:1** for cards and thumbnails.
- Never stretch it. Switch to the closest ratio instead.
- The slot's corner radius clips it; the placeholder itself is square.
- Don't put text, badges or buttons on the pattern, and don't use it as a background for real content.
- Replace it as soon as a real image is uploaded.

## Covers

- Every offering except sessions needs a cover, so lists and cards show the real cover. Only sessions can have no cover; they show the placeholder.
- In tables and lists, offerings show the cover as a rounded thumbnail before the name: 36px in tables, 40px in lists, 8px radius.
- Covers can come from an upload, Unsplash or a Canva template.

## Profile photos

- Coaches have a photo. People who are only customers show their initials. Customers who also have a coach account show their photo.
- Give the same person the same avatar colour every time.

## Sample images in designs

- Use the ready-made faces in `Avatar image` and the library's illustrations. No random stock photos pasted into screens.
- Empty states use the library's `Illustrations`.

## Logos and icons

- Icons are Phosphor, **Regular** weight, from the library's Icons page. Not Fill, unless a component already uses it.
- A brand logo used as an icon needs padding: about a 16px logo in a 24px slot. Solid logos look bigger than line icons.
- The Coachli logo comes from the library's Coachli logo component. The logo mark (the word) is always black; only the logo icon takes colour, and it always sits on its background.
