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
  // IP TRACE
  // ------------------------
  if (type === "trace") {
    await print("> Starting IP trace...");
    await print("> Initiating outbound request...");
    await print("> Pinging target...");

    await print("  Reply from 172.217.5.142: bytes=32 time=22ms TTL=54");
    await print("  Reply from 172.217.5.142: bytes=32 time=23ms TTL=54");

    await print("> Running traceroute sequence:");
    await print("  hop 1: 10.0.0.1 (Router)");
    await print("  hop 2: 96.120.0.54");
    await print("  hop 3: 68.86.91.25");
    await print("  hop 4: 142.250.64.14");
    await print("  hop 5: 172.217.5.142 (Target)");

    await print("> Resolving geographic origin...");
    await print("> Approximate region: **REDACTED**");

    await print("> Trace completed.\n");
  }

  // ------------------------
  // BREACH ATTEMPT
  // ------------------------
  if (type === "breach") {
    await print("> Attempting remote access...");
    await print("> Connecting to SSH...");
    await print("  Error: Public key mismatch");

    await print("> Retrying with fallback methods...");
    await print("  Injecting override payload...");
    await print("  Bypassing authentication...");

    await print("> Access Granted.");
    await print("> Extracting system logs...");
    await print("> Operation complete.\n");
  }

  // ------------------------
  // DECRYPT FILES
  // ------------------------
  if (type === "decrypt") {
    await print("> Loading encrypted files...");
    await print("> Running AES-256 brute-force routine...");
    await print("  Attempt 1/4096...");
    await print("  Attempt 231/4096...");
    await print("  Attempt 1133/4096...");

    await print("> Key match found!");
    await print("> Decryption complete.\n");
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
