# Downloadable PDF briefing

1. Put the final approved PDF file in this folder.
2. Name it `gemstone-briefing.pdf`, or use another clear name ending in `.pdf`.
3. Open `src/content/site-manifest.ts` and set `briefingPdf` to the file path. Example:

   ```ts
   briefingPdf: "/documents/gemstone-briefing.pdf",
   ```

4. Run `npm run build`.

The website will use the same-site PDF for both viewing and downloading. The Download Briefing link downloads the file directly instead of sending the visitor to an external viewer.

Leave `briefingPdf` blank until the approved PDF exists in this folder. This prevents a broken or locked download.
