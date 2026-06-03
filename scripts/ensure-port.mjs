import { execFileSync } from "node:child_process";
import net from "node:net";

const port = Number(process.argv[2] ?? 3000);

function run(command, args) {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function findPid() {
  const lsof = run("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN", "-t"]);

  if (lsof) {
    return lsof.split(/\s+/)[0];
  }

  const fuser = run("fuser", [`${port}/tcp`]);

  if (fuser) {
    return fuser.split(/\s+/)[0];
  }

  return "";
}

function printBusyMessage(pid) {
  console.error(`\nPort ${port} sedang dipakai.`);

  if (pid) {
    console.error(`PID: ${pid}`);
    console.error(`Matikan dengan: kill ${pid}`);
    console.error(`Kalau masih hidup: kill -9 ${pid}`);
  } else {
    console.error("PID tidak terdeteksi otomatis.");
    console.error("Coba cek manual:");
    console.error(`  sudo lsof -nP -iTCP:${port} -sTCP:LISTEN`);
    console.error(`  sudo fuser -v ${port}/tcp`);
    console.error(`  sudo ss -ltnp 'sport = :${port}'`);
  }

  console.error("\nSetelah port kosong, jalankan lagi: npm run dev\n");
}

const server = net.createServer();

server.once("error", (error) => {
  if (error.code === "EADDRINUSE" || error.code === "EACCES") {
    printBusyMessage(findPid());
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});

server.once("listening", () => {
  server.close(() => {
    process.exit(0);
  });
});

server.listen(port, "0.0.0.0");
