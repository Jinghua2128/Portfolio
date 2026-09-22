# Phone photo uploads — owner setup

The Blog and Projects editors on both site variants support choosing a phone/computer photo, previewing it, and uploading it into the existing Firebase Storage bucket. Existing image URLs and local paths still work. No live Storage configuration, billing, rules deployment, upload or Firestore write was performed during implementation.

## One-time Firebase setup

1. In your existing Firebase project's console, open **Build → Storage**. Confirm that the bucket matches `storageBucket` in your existing browser config. A config value alone does not prove the bucket is provisioned.
2. Confirm the project is on Blaze and review billing/budget alerts before enabling Storage. Firebase requires Blaze for Storage access; this is not a guarantee of free service. Do not enable billing unless you accept its terms and costs. [Official billing requirements](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024).
3. Back up your current Storage rules. Review `storage.rules.example`, confirm its admin UID matches your real Firebase Authentication user, and merge only its `portfolio-media` path into your existing rules. Do not replace unrelated rules blindly. A broader existing `allow write` can still grant access: restrictive rules do not override another matching allow. [Rules conditions](https://firebase.google.com/docs/storage/security/rules-conditions).
4. Test the rules in the Firebase console or Emulator Suite before publishing: signed-out and non-admin writes denied; another UID folder denied; oversized/non-image upload denied; admin can create an image in their own project/post folder; overwrite/delete/list denied. MIME checks alone do not prove file contents; client code re-encodes the chosen image, and the rules restrict uploads to the owner.
5. Deploy the static website separately to your current hosting service. This upload ZIP does not apply Storage rules or change billing. Do not deploy the workspace root or run a broad Firebase deploy for this task.

## Using your phone

1. Open Blog or Projects on your phone and sign in with your configured admin account.
2. Create or edit the item. Under its image field, tap **Choose File** and pick a photo. The operating system controls whether Photos, Files or Camera is offered; the site does not force camera capture.
3. Review the preview, then tap **Upload photo**. For Blog, choose a cover photo and/or add body photos one at a time. Existing body-image URLs are preserved.
4. When the URL is filled automatically, save/publish the post or project as usual. Uploading a photo does not save the post/project itself. [Firebase upload and progress API](https://firebase.google.com/docs/storage/web/upload-files).

Accepted input: JPG, PNG or WebP, at most 12 MiB and 40 megapixels. HEIC/HEIF, GIF and SVG are not accepted: export a JPEG from your phone first. Images are re-encoded in the browser, metadata stripped, aspect ratio preserved, and longest edge limited to 2048 px without cropping. Output is at most 4 MiB. No base64 image payloads go into Firestore or local drafts.

## Privacy, recovery and limitations

- Uploads are public-addressable immediately, even if the post/project remains a local draft. Never upload private or unauthorised photos. The preview before tapping Upload stays in browser memory.
- Selected files are not stored in local drafts. A page reload loses an unuploaded selection; uploaded URLs can be retained by the existing main-site draft system. The older editorial editor has no equivalent local draft system.
- Cancel/retry preserves the current image URL and entered text. Leaving, switching accounts, clearing the form or selecting another item cancels/invalidates pending work so late results cannot fill the wrong editor.
- Files use unique paths under `portfolio-media/{adminUID}/{project|post}/`. Existing files are not overwritten or automatically deleted. Completed but unused/cancelled uploads may remain; review them in the Firebase console before manually removing anything that another post might use.
- If you see an authorisation, bucket, quota or billing error, resolve it in Firebase. The URL field remains an alternative. Client-side hidden admin controls are not a replacement for Storage security rules.
- Local automated tests are not proof of real-device upload success, production rules correctness or live billing/Storage availability. Complete one authorised upload/save/reload from your phone after setup.

## Content ordering

Blog/Journal lists use the saved post date (including legacy day/month/year), then publication/creation timestamp, then an existing timestamp-like sort order. They display newest first; editing an old post does not turn its modification timestamp into a new post date.

Projects retain the full library and have three highlight views, each capped at three: **Featured**, **In Progress**, and **Latest**. Mark Featured and choose status/date in the editor. Latest requires a real project date or creation/publication timestamp; undated legacy projects are not assigned invented dates. Empty views explain what is missing. A project can appear in more than one view when it meets both criteria.
