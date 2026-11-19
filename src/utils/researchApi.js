
//const API_URL = "http://localhost:3001/api";
//const API_URL = "/api";
const API_URL = import.meta.env.VITE_API_URL;

const PARTICIPANT_CODE_KEY = "researchParticipantCode";
const ACTIVE_SESSION_KEY = "researchActiveSessionId";

let sessionCreationPromise = null;

export async function ensureResearchSession() {
  // Reuse an existing session.
  const existingSessionId = sessionStorage.getItem(
    ACTIVE_SESSION_KEY
  );

  if (existingSessionId) {
    window.researchSessionId = Number(existingSessionId);

    console.log(
      "Reusing research session:",
      window.researchSessionId
    );

    return window.researchSessionId;
  }

  // Prevent simultaneous session creation.

  if (!API_URL) {
    throw new Error("VITE_API_URL is not configured.");
  }

  if (sessionCreationPromise) {
    return sessionCreationPromise;
  }

  // Require an existing participant code.
  const participantCode = sessionStorage.getItem(
    PARTICIPANT_CODE_KEY
  );

  if (!participantCode) {
    throw new Error(
      "Participant code is missing. Please complete the consent and registration process first."
    );
  }

  sessionCreationPromise = (async () => {
    const response = await fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participantCode }),
    });

    const responseText = await response.text();

let data;

try {
  data = responseText ? JSON.parse(responseText) : {};
} catch {
  console.error("Unexpected session response:", responseText);
  throw new Error("The server returned an unexpected response.");
}

    if (!response.ok) {
      throw new Error(
        data.error || "Could not create research session."
      );
    }

    if (!Number.isInteger(Number(data.sessionId)) || Number(data.sessionId) < 1) {
      throw new Error("Invalid session ID returned by server.");
}

    // Preserve the original participant code.
    if (data.participantCode !== participantCode) {
      throw new Error(
        "Participant code mismatch between registration and research session."
      );
    }

    sessionStorage.setItem(
      ACTIVE_SESSION_KEY,
      String(data.sessionId)
    );

    window.researchSessionId = data.sessionId;

    console.log("Research session created:", {
      participantCode,
      sessionId: data.sessionId,
    });

    return data.sessionId;
  })();

  try {
    return await sessionCreationPromise;
  } finally {
    sessionCreationPromise = null;
  }
}

export function clearActiveResearchSession(sessionId) {
  const activeSessionId = sessionStorage.getItem(
    ACTIVE_SESSION_KEY
  );

  if (activeSessionId === String(sessionId)) {
    sessionStorage.removeItem(ACTIVE_SESSION_KEY);
  }

  if (window.researchSessionId === sessionId) {
    window.researchSessionId = null;
  }
}
