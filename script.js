const output = document.getElementById("output");
const typed = document.getElementById("typed");

function print(line, delay = 20) {
  return new Promise(resolve => {
    let i = 0;
    let int = setInterval(() => {
      output.innerHTML += line[i];
      i++;
      if (i >= line.length) {
        clearInterval(int);
        output.innerHTML += "\n";
        resolve();
      }
      terminal.scrollTop = terminal.scrollHeight;
    }, delay);
  });
}

async function runSequence(type) {
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

  if (type === "trace") {
    await print("> Starting IP trace...");
    await print("> Pinging target...");
    await print("  Reply from 192.168.1.1: bytes=32 time=4ms");
    await print("  Reply from 192.168.1.1: bytes=32 time=5ms");
    await print("> Locating origin...");
    await print("> Trace route hop sequence:");
    await print("  hop 1: 10.0.0.1");
    await print("  hop 2: 104.26.10.44");
    await print("  hop 3: 172.217.3.78");
    await print("> Approximate location: **Redacted**");
    await print("> Trace complete.\n");
  }

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

  if (type === "decrypt") {
    await print("> Loading encrypted files...");
    await print("> Running AES-256 brute-force routine...");
    await print("  Attempt 1/4096...");
    await print("  Attempt 231/4096...");
    await print("  Attempt 1133/4096...");
    await print("> Key match found!");
    await print("> Decryption complete.\n");
  }
}
