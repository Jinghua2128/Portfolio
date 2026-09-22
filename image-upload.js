/* Shared admin-only upload controls. Images go to Storage; documents keep URL fields. */
(() => {
    const MiB = 1024 * 1024;
    const types = new Set(['image/jpeg', 'image/png', 'image/webp']);
    let sdkPromise;
    const el = (tag, text, className) => {
        const node = document.createElement(tag);
        if (text) node.textContent = text;
        if (className) node.className = className;
        return node;
    };
    function storageSDK() {
        if (typeof window.firebase?.storage === 'function') return Promise.resolve(window.firebase.storage());
        if (!window.firebase?.apps?.length) return Promise.reject(Error('Firebase is unavailable. Reconnect and sign in again, or keep using an image URL.'));
        if (!sdkPromise) sdkPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js';
            script.async = true;
            const fail = () => { clearTimeout(timer); script.remove(); reject(Error('Image uploads could not connect. Check your connection and retry. Your existing image is unchanged.')); };
            const timer = setTimeout(fail, 15000);
            script.onerror = fail;
            script.onload = () => {
                clearTimeout(timer);
                if (typeof window.firebase?.storage !== 'function') { fail(); return; }
                resolve();
            };
            document.head.append(script);
        }).catch(error => { sdkPromise = null; throw error; });
        return sdkPromise.then(() => window.firebase.storage());
    }
    async function prepare(file) {
        if (!types.has(file.type)) throw Error('Choose a JPG, PNG or WebP photo. For HEIC/HEIF, export or share a JPEG copy from your phone first. GIF and SVG are not supported.');
        if (!file.size || file.size > 12 * MiB) throw Error('Choose a photo under 12 MB. Export a smaller copy from your phone if needed.');
        const source = URL.createObjectURL(file);
        const image = new Image();
        const canvas = document.createElement('canvas');
        try {
            await new Promise((resolve, reject) => {
                const timer = setTimeout(() => reject(Error('This photo took too long to open. Try a smaller JPEG.')), 15000);
                image.onload = () => { clearTimeout(timer); resolve(); };
                image.onerror = () => { clearTimeout(timer); reject(Error('This file could not be opened as a photo. Try exporting a JPEG copy.')); };
                image.src = source;
            });
            if (!image.naturalWidth || image.naturalWidth * image.naturalHeight > 40_000_000) throw Error('This photo is too large to process safely on a phone. Export a smaller copy (under 40 megapixels).');
            const scale = Math.min(1, 2048 / Math.max(image.naturalWidth, image.naturalHeight));
            canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
            const context = canvas.getContext('2d');
            if (!context) throw Error('Photo preparation is unavailable in this browser. You can still use an image URL.');
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            const blob = await new Promise(resolve => canvas.toBlob(resolve, file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp', 0.85));
            if (!blob || !types.has(blob.type) || !blob.size || blob.size > 4 * MiB) throw Error('This photo is still too large after resizing. Choose a smaller JPEG (upload limit 4 MB).');
            return { blob, width: canvas.width, height: canvas.height };
        } finally {
            image.src = ''; URL.revokeObjectURL(source); canvas.width = canvas.height = 0;
        }
    }
    function friendly(error) {
        switch (error?.code) {
        case 'storage/unauthorized': case 'storage/unauthenticated':
            return 'Upload not authorised. Sign in as the configured admin and check the Firebase Storage rules. Your current image is unchanged.';
        case 'storage/no-default-bucket': case 'storage/bucket-not-found': case 'storage/project-not-found':
            return 'Firebase Storage needs setup for this project. Check the bucket and admin rules in the Firebase console; image URLs still work.';
        case 'storage/quota-exceeded':
            return 'Firebase Storage quota or billing needs attention. Check the Firebase console before retrying; image URLs still work.';
        case 'storage/retry-limit-exceeded':
            return 'Upload timed out. Check your connection and retry while keeping this page open.';
        case 'storage/canceled': return 'Upload cancelled. Your existing image is unchanged.';
        default: return error?.code ? 'Upload failed. Check your connection, Firebase Storage setup and admin rules, then retry. Your text is unchanged.' : error.message || 'Upload failed. Please retry.';
        }
    }
    function mount({ form, kind }) {
        if (!form) return { setUser() {}, reset() {} };
        let user = null, generation = 0;
        const panels = [];
        const configs = kind === 'project'
            ? [['project-image', 'Project photo', false]]
            : [['post-cover-image', 'Cover photo', false], ['post-image-urls', 'Body photo', true]];
        const busy = () => panels.some(p => p.active || p.preparing);
        function sync() {
            panels.forEach(p => {
                p.box.hidden = !user;
                p.picker.disabled = !user || busy();
                p.upload.disabled = !user || busy() || !p.prepared;
                p.clear.disabled = !user || (!p.prepared && !p.active && !p.preparing);
                p.clear.textContent = p.active || p.preparing ? 'Cancel' : 'Discard selection';
            });
        }
        function clear(p, message = '', keepPicker = false) {
            p.revision++;
            p.task?.cancel(); p.task = null;
            p.active = p.preparing = false;
            p.prepared = null; p.uploadedRef = null;
            if (!keepPicker) p.picker.value = '';
            if (p.previewURL) URL.revokeObjectURL(p.previewURL);
            p.previewURL = ''; p.preview.removeAttribute('src'); p.preview.hidden = true;
            p.progress.hidden = true;
            p.status.textContent = message; p.status.classList.remove('is-error');
            sync();
        }
        configs.forEach(([id, label, append]) => {
            const input = form.querySelector(`#${id}`);
            if (!input) return;
            const box = el('div', '', 'image-upload'); box.hidden = true;
            const picker = el('input'); picker.type = 'file'; picker.accept = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp'; picker.id = `${id}-file`;
            const title = el('label', `${label} from your phone or computer`); title.htmlFor = picker.id;
            const help = el('p', 'Choose JPG, PNG or WebP (up to 12 MB). Resized to 2048 px without cropping; photo metadata is removed. HEIC: export a JPEG first.', 'image-upload-help'); help.id = `${id}-upload-help`; picker.setAttribute('aria-describedby', help.id);
            const preview = el('img'); preview.hidden = true; preview.alt = 'Selected photo preview — not uploaded yet';
            const status = el('p', '', 'image-upload-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
            const progress = el('progress'); progress.max = 100; progress.value = 0; progress.hidden = true; progress.setAttribute('aria-label', `${label} upload progress`);
            const actions = el('div', '', 'image-upload-actions');
            const upload = el('button', 'Upload photo', 'text-action'); upload.type = 'button';
            const discard = el('button', 'Discard selection', 'text-action'); discard.type = 'button'; actions.append(upload, discard);
            box.append(title, picker, help, preview, actions, progress, status, el('p', 'Upload makes this image accessible by link immediately. Use only photos you may publish. Then save/publish this post or project. Selected files are not saved in local drafts.', 'image-upload-help'));
            // Managed fields include the existing URL/chip controls; legacy forms use adjacent fields.
            (input.closest('.editor-field') || input).insertAdjacentElement('afterend', box);
            const p = { box, picker, preview, progress, status, upload, clear: discard, input, revision: 0, active: false, preparing: false, prepared: null, task: null, uploadedRef: null, previewURL: '' };
            panels.push(p);
            const message = (text, error = false) => { status.textContent = text; status.classList.toggle('is-error', error); };
            picker.addEventListener('change', async () => {
                const file = picker.files?.[0]; if (!file) return;
                if (!user || busy() || form.getAttribute('aria-busy') === 'true') { picker.value = ''; return; }
                clear(p, '', true); p.preparing = true; const revision = p.revision, session = generation;
                const current = () => revision === p.revision && session === generation && user;
                message('Preparing photo preview…'); sync();
                try {
                    const prepared = await prepare(file);
                    if (!current()) return;
                    p.prepared = prepared;
                    p.previewURL = URL.createObjectURL(prepared.blob);
                    preview.src = p.previewURL; preview.hidden = false;
                    message(`Ready: ${prepared.width} × ${prepared.height} · ${Math.max(1, Math.round(prepared.blob.size / 1024))} KB. Not uploaded yet.`);
                } catch (error) { if (current()) message(friendly(error), true); }
                finally { if (current()) { p.preparing = false; sync(); } }
            });
            discard.addEventListener('click', () => { clear(p, 'Selection discarded. Existing image unchanged; already uploaded files are not deleted.'); picker.focus(); });
            upload.addEventListener('click', async () => {
                if (!user || busy() || !p.prepared || form.getAttribute('aria-busy') === 'true') return;
                const revision = p.revision, session = generation, uid = user.uid, baseline = input.value;
                const current = () => revision === p.revision && session === generation && user?.uid === uid;
                p.active = true; progress.hidden = false; progress.value = 0; message('Connecting to image storage…'); sync();
                try {
                    const storage = await storageSDK();
                    if (!current()) return;
                    storage.setMaxUploadRetryTime?.(45000); storage.setMaxOperationRetryTime?.(20000);
                    if (!p.uploadedRef) {
                        const suffix = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[p.prepared.blob.type];
                        const token = Array.from(crypto.getRandomValues(new Uint8Array(16)), n => n.toString(16).padStart(2, '0')).join('');
                        const ref = storage.ref(`portfolio-media/${uid}/${kind}/${Date.now()}-${token}.${suffix}`);
                        const task = p.task = ref.put(p.prepared.blob, { contentType: p.prepared.blob.type, cacheControl: 'public,max-age=31536000,immutable' });
                        await new Promise((resolve, reject) => task.on('state_changed', snapshot => {
                            if (!current()) return;
                            const percent = Math.round(snapshot.bytesTransferred / Math.max(1, snapshot.totalBytes) * 100);
                            progress.value = percent; message(`Uploading photo… ${percent}%`);
                        }, reject, resolve));
                        if (!current()) return;
                        p.uploadedRef = task.snapshot.ref; p.task = null;
                    }
                    message('Getting the image link…');
                    const url = await p.uploadedRef.getDownloadURL();
                    if (!current()) return;
                    if (!/^https:\/\//.test(url)) throw Error('Storage returned an invalid image link. Please retry.');
                    if (input.value !== baseline) throw Error('The image URL was edited during upload. It has been kept. Retry to use the uploaded photo, or discard this selection.');
                    input.value = append ? [...new Set([...baseline.split(',').map(v => v.trim()).filter(Boolean), url])].join(', ') : url;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    form.dispatchEvent(new CustomEvent('portfolio:image-uploaded', { detail: { field: id } }));
                    clear(p, 'Photo uploaded and its URL filled in. Save/publish to show it on the website.');
                    input.type === 'hidden' ? upload.focus() : input.focus();
                } catch (error) { if (current()) message(friendly(error), true); }
                finally { if (current()) { p.active = false; p.task = null; progress.hidden = true; sync(); } }
            });
        });
        function reset() { generation++; panels.forEach(p => clear(p)); }
        form.addEventListener('reset', reset);
        // Capture before existing save handlers, including keyboard submission.
        form.addEventListener('submit', event => {
            const pending = panels.find(p => p.preparing || p.active || p.prepared);
            if (!pending) return;
            event.preventDefault(); event.stopImmediatePropagation();
            pending.status.textContent = 'Upload or discard the selected photo before saving. Your existing image and text are unchanged.';
            pending.status.classList.add('is-error'); (pending.upload.disabled ? pending.clear : pending.upload).focus();
        }, true);
        window.addEventListener('beforeunload', event => {
            if (!panels.some(p => p.preparing || p.active || p.prepared)) return;
            event.preventDefault(); event.returnValue = '';
        });
        sync();
        return { reset, setUser(next) { if (user?.uid !== next?.uid) { reset(); user = next || null; } sync(); } };
    }
    window.PortfolioImageUpload = Object.freeze({ mount });
})();
