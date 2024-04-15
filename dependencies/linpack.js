const { spawn } = require("child_process");
const { writeFileSync } = require("fs");
const { join } = require("path");

function startRun(
  problemSize,
  leadingDimension,
  alignmentValue,
  timeToRun,
  reducedOutput,
  statTracker,
  residualCheck,
  KMP_AFFINITY
) {
  return new Promise((resolve) => {
    writeFileSync(
      "temp",
      `\n\n1\n${problemSize}\n${leadingDimension}\n99999\n${alignmentValue}`
    );

    let isRun = false;
    let residual, min, avg, max, total;
    let trials = 0;
    let previousTrials = 0;

    console.log(
      "\n" +
        `Start time: ${new Date().toLocaleTimeString([], {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })}\n` +
        `Time to run: ${timeToRun / 60000} minutes\n` +
        `Problem size: ${problemSize}\n` +
        `Leading dimension: ${leadingDimension}\n` +
        `Alignment value: ${alignmentValue}\n` +
        `Residual checks: ${residualCheck ? "ON" : "OFF"}\n`
    );

    const startTime = Date.now();

    const timer = setInterval(async () => {
      if (trials > previousTrials) {
        if (statTracker) {
          console.log(
            `Trials completed: ${trials
              .toString()
              .padStart(4, "0")} | GFlops - Min: ${min.toFixed(
              4
            )} Avg: ${avg.toFixed(4)} Max: ${max.toFixed(4)}`
          );
        }

        previousTrials = trials;

        if (Date.now() - startTime >= timeToRun) {
          clearInterval(timer);
          linpack.kill();
          await new Promise((r) => setTimeout(r, 5000));
          resolve();
        }
      }
    }, 20000);

    const linpack = spawn("linpack_xeon64.exe", [join(__dirname, "temp")], {
      cwd: join(__dirname, "linpack"),
      ...(KMP_AFFINITY.length > 0 && { env: { KMP_AFFINITY } }),
    });

    linpack.stdout.on("data", (data) => {
      const line = data.toString();

      if (!reducedOutput) {
        process.stdout.write(line);
      }

      const element = line.split(/\s+/);

      if (!isRun) {
        if (element[0] === problemSize && element[1] === problemSize) {
          isRun = true;
          residual = element[5];
          trials++;
          if (statTracker) {
            min = max = avg = total = parseFloat(element[4]);
          }
        }
      } else if (element.length > 2) {
        if (element[7] !== "pass") {
          console.log("\n\n" + "FAIL - severe instability detected\n\n");
          linpack.kill();
          process.exit();
        }

        if (residualCheck && element[5] !== residual) {
          console.log(
            "\n\n" +
              "RESIDUAL MISMATCH - instability detected (residual checks can be turned off in the config)\n\n"
          );
          linpack.kill();
          process.exit();
        }

        trials++;

        if (statTracker) {
          const gflops = parseFloat(element[4]);

          if (gflops < min) {
            min = gflops;
          }

          if (gflops > max) {
            max = gflops;
          }

          total += gflops;
          avg = total / trials;
        }
      }
    });

    linpack.stderr.on("data", (data) => {
      console.error(data.toString());
      linpack.kill();
      process.exit();
    });
  });
}

async function main() {
  const config = require(join(__dirname, "..", "config.json"));

  console.log(
    "Linpack Extended\n" + "https://github.com/BoringBoredom/Linpack-Extended"
  );

  for (const test of config["test order"]) {
    const currentTest = config.tests[test.toString()];
    await startRun(
      currentTest["problem size"].toString(),
      currentTest["leading dimension"],
      currentTest["alignment value"],
      currentTest["minutes"] * 60000,
      currentTest["problem size"] <
        config.settings["reduce output below X problem size"],
      currentTest["problem size"] <
        config.settings["track stats below X problem size"],
      config.settings["stop after residual mismatch"],
      config.settings.KMP_AFFINITY
    );
  }

  console.log(
    "\n\n" +
      "All tests successfully passed\n" +
      `Residual checks are ${
        config.settings["stop after residual mismatch"] ? "ON" : "OFF"
      }\n\n`
  );
}

main();
