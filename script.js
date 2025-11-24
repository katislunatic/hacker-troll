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

    await print("> Starting IP trace...");
    await print("> Requesting client IP...");

    // Get the real IP address
    let ipData = await fetch("https://api.ipify.org?format=json")
        .then(res => res.json())
        .catch(() => ({ ip: "UNKNOWN" }));

    await print(`> Client IP detected: ${ipData.ip}`);
    await print("> Pulling extended geolocation data...");

    // Get detailed info (city, region, country, ISP, etc.)
    let info = await fetch("https://ipinfo.io/json?token=YOUR_TOKEN_HERE")
        .then(res => res.json())
        .catch(() => ({
            city: "UNKNOWN",
            region: "UNKNOWN",
            country: "UNKNOWN",
            org: "UNKNOWN",
            loc: "0,0"
        }));

    await print(`  Location: ${info.city}, ${info.region}, ${info.country}`);
    await print(`  ISP: ${info.org}`);
    await print(`  Coordinates: ${info.loc}`);

    await print("> Running traceroute sequence...");
    await print("  hop 1: 10.0.0.1 (Router)");
    await print("  hop 2: 96.120.0.54");
    await print("  hop 3: 68.86.91.25");
    await print("  hop 4: 142.250.64.14");
    await print(`  hop 5: ${ipData.ip} (Client)`);

    await print("> Resolving network fingerprint...");
    await print("> VPN: POSSIBLY ACTIVE");
    await print("> Trace completed.\n");
}

  // ------------------------
  // DEVICE INFO SCAN
  // ------------------------
  if (type === "device") {
    await print("> Gathering client device information...");
    await print("> Parsing user-agent string...");

    await print(`  Device: ${navigator.platform}`);
    await print(`  Browser: ${navigator.userAgent}`);
    await print(`  Language: ${navigator.language}`);
    await print(`  Screen Resolution: ${window.screen.width}x${window.screen.height}`);

    await print("> Scanning local network interfaces...");
    await print("  Interface 1: 192.168.1.** (private)");
    await print("  Interface 2: 10.0.0.** (private)");

    await print("> Checking security fingerprint...");
    await print("  Firewall: ACTIVE");
    await print("  VPN: POSSIBLY ACTIVE");
    await print("  Tracking Protection: ENABLED");

    await print("> Device scan complete.\n");
  }
}
