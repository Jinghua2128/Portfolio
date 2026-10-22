(() => {
    const form = document.querySelector("#admin-login");
    const status = document.querySelector("#admin-status");
    const destinations = document.querySelector("#admin-destinations");
    const logout = document.querySelector("#admin-logout");
    // This is a navigation gate only; Firestore rules enforce owner writes by UID.
    const configuredAdmin = (user) => Boolean(user && !ALLOW_ANY_SIGNED_IN_USER_TO_EDIT
        && Array.isArray(ADMIN_UIDS) && ADMIN_UIDS.includes(user.uid));
    if (!auth || !db) {
        form.hidden = true;
        status.textContent = "Firebase is not configured in this checkout. Public pages remain available.";
        return;
    }
    auth.onAuthStateChanged((user) => {
        const allowed = configuredAdmin(user);
        form.hidden = !!user;
        destinations.hidden = !allowed;
        logout.hidden = !user;
        status.textContent = allowed ? "Editor access confirmed." : user ? "This account cannot manage portfolio content." : "";
    });
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        status.textContent = "Checking account…";
        try {
            await auth.signInWithEmailAndPassword(form.querySelector("#admin-email").value, form.querySelector("#admin-password").value);
            form.reset();
        } catch (_) {
            status.textContent = "Sign-in failed. Check your credentials and try again.";
        }
    });
    logout.addEventListener("click", () => auth.signOut());
})();
