async function checkImage(url, name) {
    try {
        const response = await fetch(url);
        console.log(`[${name}] Status Code:`, response.status);
        console.log(`[${name}] Content-Type:`, response.headers.get('content-type'));
        const buffer = await response.arrayBuffer();
        console.log(`[${name}] Total Size: ${buffer.byteLength} bytes\n`);
    } catch (error) {
        console.error(`[${name}] Error:`, error.message);
    }
}

async function run() {
    await checkImage('https://covers.openlibrary.org/b/isbn/9781982120627-L.jpg', 'How To Not Die Alone (OpenLibrary)');
    await checkImage('https://covers.openlibrary.org/b/isbn/9780807014271-L.jpg', 'Mans Search for Meaning (OpenLibrary)');
}
run();
