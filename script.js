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

    // 1. Get client IP (REAL)
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

    // FAKE TRACEROUTE
    await print(" hop 1: 10.0.0.1            (local router)");
    await print(" hop 2: 96.120.0.54         (regional node)");
    await print(" hop 3: 68.86.91.25         (ISP backbone)");
    await print(" hop 4: 142.250.64.14       (global transit)");
    await print(` hop 5: ${ipData.ip}        (client endpoint)`);

    await print("> Network fingerprinting...");
    await print("> Proxy/VPN: ANALYZING...");

    // VPN guess
    if (info.hostname && info.hostname.toLowerCase().includes("vpn")) {
        await print("> Status: VPN LIKELY ACTIVE");
    } else {
        await print("> Status: No VPN detected");
    }

    await print("> Trace complete.\n");
  }

// ------------------------
// VPN DETECTION
// ------------------------
let vpnStatus = "UNKNOWN";

// 1. Check IPinfo privacy flags
if (info.privacy?.vpn) {
    vpnStatus = "YES (Listed VPN Provider)";
} else if (info.privacy?.proxy) {
    vpnStatus = "YES (Proxy Detected)";
} else if (info.privacy?.tor) {
    vpnStatus = "YES (TOR Node)";
} else if (info.privacy?.hosting) {
    vpnStatus = "LIKELY (Data Center IP)";
}

// 2. Check if the ISP is a known VPN or hosting provider
const hostingKeywords = [
    "amazon", "aws", "google", "digitalocean", "ovh", "hetzner", "linode",
    "contabo", "azure", "cloudflare", "vultr"
];

let orgLower = (info.org || "").toLowerCase();
if (hostingKeywords.some(k => orgLower.includes(k))) {
    vpnStatus = "LIKELY (Hosting Provider IP)";
}

// 3. Final print
await print(`> VPN Detection: ${vpnStatus}`);
  }
  
  // ------------------------
  // ACCURATE DEVICE INFO SCAN
  // ------------------------
  if (type === "device") {
    await print("> Starting Accurate Device Scan...");
    await print("> Collecting browser and hardware identifiers...\n");

    await print(`Platform: ${navigator.platform || "Unknown"}`);
    await print(`User Agent: ${navigator.userAgent}`);
    await print(`Language: ${navigator.language}`);
    await print(`Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);

    await print(`CPU Cores: ${navigator.hardwareConcurrency || "Unknown"}`);
    await print(`Approx RAM: ${navigator.deviceMemory ? navigator.deviceMemory + " GB" : "Unknown"}`);

    await print(`Screen Resolution: ${screen.width} x ${screen.height}`);
    await print(`Pixel Ratio: ${window.devicePixelRatio}`);

    await print(`Touch Support: ${("ontouchstart" in window) ? "Yes" : "No"}`);

    // GPU INFO
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl) {
            const debug = gl.getExtension("WEBGL_debug_renderer_info");
            const vendor = gl.getParameter(debug.UNMASKED_VENDOR_WEBGL);
            const renderer = gl.getParameter(debug.UNMASKED_RENDERER_WEBGL);

            await print(`GPU Vendor: ${vendor}`);
            await print(`GPU Renderer: ${renderer}`);
        } else {
            await print("GPU: Unknown");
        }
    } catch {
        await print("GPU: Unknown");
    }

    // STORAGE
    if (navigator.storage && navigator.storage.estimate) {
        try {
            const est = await navigator.storage.estimate();
            await print(`Storage Used: ${(est.usage / 1024**3).toFixed(2)} GB`);
            await print(`Storage Total: ${(est.quota / 1024**3).toFixed(2)} GB`);
        } catch {
            await print("Storage: Unknown");
        }
    }

    // BATTERY
    if (navigator.getBattery) {
        try {
            const battery = await navigator.getBattery();
            await print(`Battery Level: ${Math.round(battery.level * 100)}%`);
            await print(`Charging: ${battery.charging ? "Yes" : "No"}`);
        } catch {
            await print("Battery: Unknown");
        }
    }

    // NETWORK
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        await print(`Connection Type: ${connection.effectiveType}`);
        await print(`Downlink: ${connection.downlink} Mbps`);
    }

    // DEVICES
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        await print(`Cameras Detected: ${devices.filter(d => d.kind === "videoinput").length}`);
        await print(`Microphones Detected: ${devices.filter(d => d.kind === "audioinput").length}`);
    } catch {
        await print("Camera/Microphone Access: Blocked");
    }

    // PERMISSIONS
    if (navigator.permissions) {
        const camPerm = await navigator.permissions.query({ name: "camera" }).catch(() => null);
        const micPerm = await navigator.permissions.query({ name: "microphone" }).catch(() => null);

        if (camPerm) await print(`Camera Permission: ${camPerm.state}`);
        if (micPerm) await print(`Microphone Permission: ${micPerm.state}`);
    }

    await print("\n> Accurate device scan complete.\n");
  }

  // ------------------------
  // BREACH ATTEMPT
  // ------------------------
  if (type === "breach") {
    await print("> Initializing breach tools...");
    await print("> Establishing connection to target...");
    await print("> Injecting exploit payload...");

    for (let i = 1; i <= 6; i++) {
      await print(`  - Payload packet ${i}/6 delivered`);
    }

    await print("> Attempting privilege escalation...");
    await print("> Accessing restricted directories...");
    await print("  /etc/root/");
    await print("  /sys/kernel/");
    await print("  /var/auth/tokens/");

    await print("> Firewall detected intrusion — retrying...");
    await print("> Bypass successful.");

    await print("> Breach successful. Root access acquired.\n");
  }

  // ------------------------
  // DECRYPT FILES
  // ------------------------
  if (type === "decrypt") {

    await print("> Locating encrypted file blocks...");

    let files = [
      "vault_sys.enc",
      "auth_keys.enc",
      "backup_0312.enc",
      "userdata.bin.enc",
      "config_master.enc"
    ];

    for (let f of files) {
      await print(`> Found: ${f}`);
    }

    await print("> Beginning decryption sequence...");

    // Hex stream
    for (let i = 0; i < 20; i++) {
      let line = "";
      for (let j = 0; j < 32; j++) {
        line += Math.floor(Math.random() * 16).toString(16);
      }
      await print(line);
    }

    await print("> Validating data...");
    await print("> Integrity check: PASSED");
    await print("> Files decrypted successfully.\n");
  }

}
