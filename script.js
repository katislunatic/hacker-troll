// ------------------------
// DEVICE INFO SCAN
// ------------------------
if (type === "device") {
    await print("> Initializing Device Info Scan...");
    
    // Basic browser/device info
    const platform = navigator.platform;
    const ua = navigator.userAgent;
    const language = navigator.language;
    const cores = navigator.hardwareConcurrency || "Unknown";
    const memory = navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Unknown";
    const width = screen.width;
    const height = screen.height;
    const pixelRatio = window.devicePixelRatio;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const touch = 'ontouchstart' in window ? "ENABLED" : "DISABLED";
    
    await print(`> Platform: ${platform}`);
    await print(`> Browser: ${ua}`);
    await print(`> Language: ${language}`);
    await print(`> CPU Cores: ${cores}`);
    await print(`> Approx RAM: ${memory}`);
    await print(`> Screen: ${width}x${height} @ ${pixelRatio}x`);
    await print(`> Touch Support: ${touch}`);
    await print(`> Timezone: ${timezone}`);

    // GPU info via WebGL
    let gpu = "Unknown";
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl) {
            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            if (debugInfo) {
                gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }
    } catch(e){}
    await print(`> GPU: ${gpu}`);

    // Battery info
    if (navigator.getBattery) {
        try {
            const battery = await navigator.getBattery();
            await print(`> Battery Level: ${Math.round(battery.level * 100)}%`);
            await print(`> Charging: ${battery.charging ? "Yes" : "No"}`);
        } catch(e){}
    }

    // Network info
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection && connection.effectiveType) {
        await print(`> Connection Type: ${connection.effectiveType.toUpperCase()}`);
        await print(`> Downlink: ${connection.downlink} Mbps`);
    }

    await print("> Device scan complete.\n");
}
