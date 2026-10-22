// A cloned checkout intentionally has no Firebase browser configuration.
// The real config declares these lexical globals; only supply inert globals
// when that optional script was absent, so public fallback content can render.
if (typeof auth === "undefined") window.auth = null;
if (typeof db === "undefined") window.db = null;
if (typeof ALLOW_ANY_SIGNED_IN_USER_TO_EDIT === "undefined") window.ALLOW_ANY_SIGNED_IN_USER_TO_EDIT = false;
if (typeof ADMIN_EMAILS === "undefined") window.ADMIN_EMAILS = [];
if (typeof ADMIN_UIDS === "undefined") window.ADMIN_UIDS = [];
