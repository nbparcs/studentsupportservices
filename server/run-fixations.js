
const { computeAndSaveFixations } = require("./fixations");

async function run() {
  try {
    console.log("Starting fixation calculation...");

    const sessionId = 11058;

    const result = await computeAndSaveFixations(sessionId);

    console.log("\n========== FINAL RESULT ==========");
    console.log("Session ID:", sessionId);
    console.log("Fixations detected and saved:", result.fixationCount);
    console.log("Saved successfully:", result.saved);
    console.log("Thresholds:", result.thresholds);
    console.log("==================================");

    process.exit(0);
  } catch (error) {
    console.error("\nFIXATION PROCESS FAILED:");
    console.error(error);
    process.exit(1);
  }
}

run();
