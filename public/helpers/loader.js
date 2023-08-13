export async function loadScript(url) {
    const $script = document.createElement("script");
    $script.setAttribute("src", url);
    document.head.appendChild($script);
    return new Promise((done) => {
        $script.onload = done;
        $script.onerror = done;
    });
}

export async function CSS(baseURL, ...arrayOfFilenames) {
    const sheets = await Promise.all(arrayOfFilenames.map((filename) => loadSingleCSS(baseURL, filename)));
    return sheets.join("\n\n");
}

async function loadSingleCSS(baseURL, filename) {
    const res = await fetch(baseURL.replace(/(.*)\/[^\/]+$/, "$1/") + filename, {
        cache: "default"
    });
    if (res.status !== 200) return `/* ERROR: ${res.status} */`;
    else if (!res.headers.get("Content-Type").startsWith("text/css")) return `/* ERROR: wrong type, got "${res.headers.get("Content-Type")}"*/`;
    return await res.text();
}
