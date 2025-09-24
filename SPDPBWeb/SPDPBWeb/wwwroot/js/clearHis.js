window.onload = function () {
    // Replace the current history state
    history.replaceState(null, document.title, location.pathname + "#removed");

    // Then redirect to the same page to clear history stack
    if (location.hash === "#removed") {
        history.replaceState(null, document.title, location.pathname);
        // You can also redirect to a specific page if needed:
        // window.location.replace("your-desired-url.html");
    } else {
        // Redirect to the same page to trigger history replace
        window.location.replace(location.pathname);
    }
};