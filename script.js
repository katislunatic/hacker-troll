const output = document.getElementById("output");
const terminal = document.getElementById("terminal");

function print(line, delay = 20) {
  return new Promise(resolve => {
    let i = 0;
    let interval = setInterval(() => {
      output.innerHTML += line[i];
      i++;

      if (i >= line.length) {
        clearInterval(interval);
        output.innerHTML += "\n";
        resolve();
      }

      terminal.scrollTop = terminal.scrollHeight;
    }, delay);
  });
}

async function runSequence(type) {

  // ------------------------
  // SYSTEM SCAN
  // ------------------------
  if (type === "scan") {
    await print("> Initializing system scan...");
    await print("> Scanning open ports...");
    await print("  - Port 22: OPEN");
    await print("  - Port 80: OPEN");
    await print("  - Port 443: OPEN");

    await print("> Checking system processes...");
    await print("  - CPU Usage: 73%");
    await print("  - RAM: 5.2GB / 8GB");

    await print("> Scan complete.\n");
  }

// ------------------------
// REAL IP TRACE
// ------------------------
if (type === "trace") {

    await print("> Initiating IP trace...");
    await print("> Establishing external IP connection...");

    // 1. Get client IP (100% real)
    let ipData = await fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .catch(() => ({ ip: "UNKNOWN" }));

    await print(`> External IP found: ${ipData.ip}`);
    await print("> Requesting extended geolocation records...");

    // 2. Detailed IP info
    let info = await fetch("https://ipinfo.io/json?token=f2f682efddfa5d")
        .then(res => res.json())
        .catch(() => ({
            city: "UNKNOWN",
            region: "UNKNOWN",
            country: "UNKNOWN",
            org: "UNKNOWN",
            loc: "0,0",
            timezone: "UNKNOWN",
            postal: "UNKNOWN",
            hostname: "UNKNOWN"
        }));

    await print("");
    await print("=== RESOLVED CLIENT METADATA ===");
    await print(`IP Address:         ${info.ip || ipData.ip}`);
    await print(`Hostname:           ${info.hostname || "UNKNOWN"}`);
    await print(`City:               ${info.city}`);
    await print(`Region:             ${info.region}`);
    await print(`Country:            ${info.country}`);
    await print(`Postal Code:        ${info.postal}`);
    await print(`Coordinates:        ${info.loc}`);
    await print(`Timezone:           ${info.timezone}`);
    await print(`ISP / Organization: ${info.org}`);
    await print("================================\n");

    await print("> Beginning network hop scan...");

    // 3. Fake traceroute (looks real)
    await print(" hop 1: 10.0.0.1            (local router)");
    await print(" hop 2: 96.120.0.54         (regional node)");
    await print(" hop 3: 68.86.91.25         (ISP backbone)");
    await print(" hop 4: 142.250.64.14       (global transit)");
    await print(` hop 5: ${ipData.ip}        (client endpoint)`);

    await print("> Network fingerprinting...");
    await print("> Proxy/VPN: ANALYZING...");

    // Simple VPN guess based on hostname
    if (info.hostname && info.hostname.toLowerCase().includes("vpn")) {
        await print("> Status: VPN LIKELY ACTIVE");
    } else {
        await print("> Status: No VPN detected");
    }

    await print("> Trace complete.\n");
}

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
