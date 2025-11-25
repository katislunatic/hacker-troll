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
// USER-INPUT IP LOOKUP
// ------------------------
if (type === "lookup") {

    // Ask user for IP using prompt()
    let targetIP = prompt("Enter an IP address to lookup:");

    if (!targetIP || targetIP.trim() === "") {
        await print("> Lookup cancelled.\n");
        return;
    }

    targetIP = targetIP.trim();

    await print(`> Resolving IP: ${targetIP} ...`);
    await print("> Contacting geographic data servers...");

    // Fetch from ipinfo using YOUR token
    let info = await fetch(`https://ipinfo.io/${targetIP}/json?token=f2f682efddfa5d`)
        .then(res => res.json())
        .catch(() => null);

    if (!info || info.error) {
        await print("> ERROR: Unable to resolve IP.");
        await print("> The IP may be invalid or unreachable.\n");
        return;
    }

    await print("");
    await print("=== IP LOOKUP RESULTS ===");

    await print(`IP Address:         ${info.ip || targetIP}`);
    await print(`Hostname:           ${info.hostname || "Unknown"}`);
    await print(`City:               ${info.city || "Unknown"}`);
    await print(`Region:             ${info.region || "Unknown"}`);
    await print(`Country:            ${info.country || "Unknown"}`);
    await print(`Postal Code:        ${info.postal || "Unknown"}`);
    await print(`Coordinates:        ${info.loc || "Unknown"}`);
    await print(`Timezone:           ${info.timezone || "Unknown"}`);
    await print(`ISP / Organization: ${info.org || "Unknown"}`);

    await print("============================\n");

    // -------- OPTIONAL: VPN Detection (Same as TRACE) --------
    let vpnStatus = "No VPN detected";

    if (info.hostname && info.hostname.toLowerCase().includes("vpn")) {
        vpnStatus = "YES (Hostname suggests VPN)";
    }

    const hostingKeywords = [
        "amazon", "aws", "google", "digitalocean", "ovh", "hetzner",
        "linode", "contabo", "azure", "cloudflare", "vultr"
    ];

    const orgLower = (info.org || "").toLowerCase();
    if (hostingKeywords.some(k => orgLower.includes(k))) {
        vpnStatus = "LIKELY (Hosting / Proxy Provider)";
    }

    await print(`> VPN / Proxy Detection: ${vpnStatus}`);

    await print("\n> Lookup complete.\n");
}
  
// ------------------------
// NEARBY DEVICE SCAN (Real + Fake)
// ------------------------
if (type === "nearby") {

    await print("> Initializing Nearby Device Scan...");
    await print("> Checking Bluetooth adapter...");

    let realDevices = [];

    // REAL BLUETOOTH DEVICE SCAN
    try {
        const options = {
            acceptAllDevices: true,
            optionalServices: []
        };

        await print("> Scanning for real Bluetooth devices...");
        let device = await navigator.bluetooth.requestDevice(options);

        if (device) {
            realDevices.push(device.name || "Unknown Device");
            await print(`> REAL Device Found: ${device.name || "Unnamed Device"}`);
        }
    } catch (err) {
        await print("> Bluetooth scan skipped (permission denied or unsupported).");
    }

    await print("\n> Starting extended network device discovery...");

    // --------------- Fake LAN Devices (super realistic) ---------------
    function randomMac() {
        const vendors = ["D4:93:90", "58:8A:5A", "FC:EC:DA", "BC:4B:79", "3C:5A:B4"];
        let prefix = vendors[Math.floor(Math.random() * vendors.length)];
        let rest = Array.from({ length: 3 }, () =>
            Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
        ).join(":");
        return prefix + ":" + rest;
    }

    function randomIP() {
        return `192.168.1.${Math.floor(Math.random() * 150 + 2)}`;
    }

    const fakeDevices = [
        { type: "iPhone 15", vendor: "Apple, Inc." },
        { type: "Samsung Galaxy", vendor: "Samsung Electronics" },
        { type: "PlayStation 5", vendor: "Sony Interactive" },
        { type: "Amazon Fire TV", vendor: "Amazon Technologies" },
        { type: "HP Laptop", vendor: "HP, Inc." },
        { type: "Oculus Quest 2", vendor: "Meta Platforms" },
    ];

    // Randomize selection
    const selectedDevices = fakeDevices.sort(() => 0.5 - Math.random()).slice(0, 4);

    await print("\n=== NEARBY DEVICES FOUND ===");

    // Show REAL devices first
    if (realDevices.length > 0) {
        for (let d of realDevices) {
            await print(`REAL DEVICE: ${d}`);
        }
    } else {
        await print("No real Bluetooth devices detected.");
    }

    // Show FAKE devices (but realistic!)
    for (let d of selectedDevices) {
        await print(`
Device: ${d.type}
IP Address: ${randomIP()}
MAC Address: ${randomMac()}
Vendor: ${d.vendor}
Signal Strength: -${Math.floor(Math.random() * 30 + 50)} dBm
Last Seen: ${Math.floor(Math.random() * 5 + 1)} seconds ago
        `.trim());
    }

    await print("=============================\n");
    await print("> Nearby device scan complete.\n");
}

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
  // REAL IP TRACE + VPN DETECTION
  // ------------------------
  if (type === "trace") {

    await print("> Initiating IP trace...");
    await print("> Establishing external IP connection...");

    let ipData = await fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .catch(() => ({ ip: "UNKNOWN" }));

    await print(`> External IP found: ${ipData.ip}`);
    await print("> Requesting extended geolocation records...");

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
    await print(" hop 1: 10.0.0.1            (local router)");
    await print(" hop 2: 96.120.0.54         (regional node)");
    await print(" hop 3: 68.86.91.25         (ISP backbone)");
    await print(" hop 4: 142.250.64.14       (global transit)");
    await print(` hop 5: ${ipData.ip}        (client endpoint)`);

    await print("> Network fingerprinting...");
    await print("> Proxy/VPN: ANALYZING...");

    let vpnStatus = "No VPN detected";

    if (info.hostname && info.hostname.toLowerCase().includes("vpn")) {
        vpnStatus = "YES (Hostname suggests VPN)";
    }

    const hostingKeywords = [
        "amazon", "aws", "google", "digitalocean", "ovh",
        "hetzner", "linode", "contabo", "azure", "cloudflare", "vultr"
    ];

    const orgLower = (info.org || "").toLowerCase();

    if (hostingKeywords.some(k => orgLower.includes(k))) {
        vpnStatus = "LIKELY (Hosting Provider IP)";
    }

    await print(`> VPN Detection: ${vpnStatus}`);

    await print("> Trace complete.\n");
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

    // GPU detection
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

    // Storage estimate
    if (navigator.storage && navigator.storage.estimate) {
        try {
            const est = await navigator.storage.estimate();
            await print(`Storage Used: ${(est.usage / 1024**3).toFixed(2)} GB`);
            await print(`Storage Total: ${(est.quota / 1024**3).toFixed(2)} GB`);
        } catch {
            await print("Storage: Unknown");
        }
    }

    // Battery
    if (navigator.getBattery) {
        try {
            const battery = await navigator.getBattery();
            await print(`Battery Level: ${Math.round(battery.level * 100)}%`);
            await print(`Charging: ${battery.charging ? "Yes" : "No"}`);
        } catch {
            await print("Battery: Unknown");
        }
    }

    // Network info
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        await print(`Connection Type: ${connection.effectiveType}`);
        await print(`Downlink: ${connection.downlink} Mbps`);
    }

    // Devices
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        await print(`Cameras Detected: ${devices.filter(d => d.kind === "videoinput").length}`);
        await print(`Microphones Detected: ${devices.filter(d => d.kind === "audioinput").length}`);
    } catch {
        await print("Camera/Microphone Access: Blocked");
    }

    // Permissions
    if (navigator.permissions) {
        const camPerm = await navigator.permissions.query({ name: "camera" }).catch(() => null);
        const micPerm = await navigator.permissions.query({ name: "microphone" }).catch(() => null);

        if (camPerm) await print(`Camera Permission: ${camPerm.state}`);
        if (micPerm) await print(`Microphone Permission: ${micPerm.state}`);
    }

    await print("\n> Accurate device scan complete.\n");
  }


  // ------------------------
  // BROWSER FINGERPRINT
  // ------------------------
  if (type === "fingerprint") {
    await print("> Collecting Browser Fingerprint...");
    await print("> Generating fingerprint hash...\n");

    function hash(str) {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
      }
      return (h >>> 0).toString(16);
    }

    const fingerprintData = {
      ua: navigator.userAgent,
      platform: navigator.platform,
      lang: navigator.language,
      cores: navigator.hardwareConcurrency,
      ram: navigator.deviceMemory,
      res: `${screen.width}x${screen.height}`,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      touch: "ontouchstart" in window,
      pixelRatio: window.devicePixelRatio
    };

    const fpHash = hash(JSON.stringify(fingerprintData));

    await print(`Fingerprint Hash: ${fpHash}`);
    await print(`Platform: ${fingerprintData.platform}`);
    await print(`Resolution: ${fingerprintData.res}`);
    await print(`Language: ${fingerprintData.lang}`);
    await print(`Touch Device: ${fingerprintData.touch}`);
    await print(`CPU Cores: ${fingerprintData.cores}`);
    await print(`RAM: ${fingerprintData.ram} GB`);
    await print(`Timezone: ${fingerprintData.tz}`);
    await print(`Pixel Ratio: ${fingerprintData.pixelRatio}`);

    await print("\n> Browser fingerprint complete.\n");
  }

// ------------------------
// SPEED TEST
// ------------------------
if (type === "speed") {
  await print("> Initializing Speed Test...");
  await print("> Testing ping...");

  const start = performance.now();
  await fetch("https://api.ipify.org?format=json");
  const ping = Math.round(performance.now() - start);
  await print(`Ping: ${ping} ms`);
  await print("> Testing download speed...");

  const testUrl = "https://speed.hetzner.de/1MB.bin"; // smaller file for speed
  const t1 = performance.now();
  const response = await fetch(testUrl);
  const reader = response.body.getReader();
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.length;
  }

  const t2 = performance.now();
  const mbps = (((received / 1024 / 1024) / ((t2 - t1) / 1000)) * 8).toFixed(2);
  await print(`Download Speed: ${mbps} Mbps`);

  await print("\n> Speed Test complete.\n");
}

  // ------------------------
  // BREACH ATTEMPT (fake)
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
  // DECRYPT FILES (fake)
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

} // <-- THIS closes runSequence()
