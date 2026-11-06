
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { poolPromise, sql } = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

// Check that the API is running
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running" });
});

// Check the SQL Server database connection
app.get("/api/health/db", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT DB_NAME() AS databaseName,
             SUSER_SNAME() AS loginName
    `);

    res.json({
      status: "Database connection successful",
      details: result.recordset[0],
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);
    res.status(500).json({
      error: "Database connection failed",
    });
  }
});


app.post("/api/gaze/batch", async (req, res) => {
  try {
    const { sessionId, samples } = req.body;

     console.log("Gaze batch received:", {
      sessionId,
      sampleCount: Array.isArray(samples) ? samples.length : "not an array",
      firstSample: samples?.[0],
    });

    if (
      !Number.isInteger(sessionId) ||
      sessionId < 1 ||
      !Array.isArray(samples) ||
      samples.length < 1 ||
      samples.length > 500
    ) {
      return res.status(400).json({
        error: "Provide a valid sessionId and 1–500 gaze samples.",
      });
    }

    for (const sample of samples) {
      if (
        !["Baseline", "Accessible"].includes(sample.interface) ||
        typeof sample.page !== "string" ||
        sample.page.length > 500 ||
        !Number.isFinite(sample.x) ||
        !Number.isFinite(sample.y) ||
        !Number.isFinite(sample.timestamp) ||
        (sample.aoi != null &&
          (typeof sample.aoi !== "string" || sample.aoi.length > 200))
      ) {
        return res.status(400).json({
          error: "One or more gaze samples have invalid fields.",
        });
      }
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("sessionId", sql.Int, sessionId)
      .input("samples", sql.NVarChar(sql.MAX), JSON.stringify(samples))
      .query(`
        INSERT INTO dbo.GazeSamples (
          session_id,
          task_code,
          interface_name,
          page,
          x,
          y,
          timestamp_ms,
          aoi
        )
        SELECT
          @sessionId,
          task_code,
          interface_name,
          page,
          x,
          y,
          timestamp_ms,
          aoi
        FROM OPENJSON(@samples)
        WITH (
          task_code NVARCHAR(50) '$.taskCode',
          interface_name NVARCHAR(30) '$.interface',
          page NVARCHAR(500) '$.page',
          x FLOAT '$.x',
          y FLOAT '$.y',
          timestamp_ms BIGINT '$.timestamp',
          aoi NVARCHAR(200) '$.aoi'
        );
      `);

    res.status(201).json({
      message: "Gaze samples saved successfully.",
      savedCount: result.rowsAffected[0],
    });
  } catch (error) {
    console.error("Save gaze batch failed:", error);
    res.status(500).json({
      error: "Could not save gaze samples.",
    });
    console.log("Received task result:", req.body);
  }
});


app.post("/api/task-results", async (req, res) => {
  try {
    const {
      sessionId,
      taskCode,
      taskTitle,
      interfaceName,
      durationSeconds,
      completed,
      startedAtMs,
      completedAtMs,
      analysis,
    } = req.body;

    console.log("Received task result:", {
  sessionId,
  taskCode,
  taskCodeType: typeof taskCode,
  taskTitle,
  interfaceName,
  durationSeconds,
  durationSecondsType: typeof durationSeconds,
  completed,
  completedAtMs,
  completedAtMsType: typeof completedAtMs,
});

    
    const validationErrors = [];

    if (!Number.isInteger(Number(sessionId)) || Number(sessionId) < 1) {
      validationErrors.push("sessionId is invalid");
    }

    if (typeof taskCode !== "string" || taskCode.length > 50) {
      validationErrors.push("taskCode is invalid");
    }

    if (typeof taskTitle !== "string" || taskTitle.length > 200) {
      validationErrors.push("taskTitle is invalid");
    }

    if (!["Baseline", "Accessible"].includes(interfaceName)) {
      validationErrors.push("interfaceName is invalid");
    }

    if (!Number.isInteger(durationSeconds) || durationSeconds < 0) {
      validationErrors.push("durationSeconds is invalid");
    }

    if (typeof completed !== "boolean") {
      validationErrors.push("completed is invalid");
    }

    if (!Number.isFinite(completedAtMs)) {
      validationErrors.push("completedAtMs is invalid");
    }

    
if (validationErrors.length > 0) {
  console.error("Task result validation errors:", validationErrors);
  console.error("Full task result payload:", req.body);

  return res.status(400).json({
    error: "Invalid task result fields.",
    details: validationErrors,
  });
}

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("sessionId", sql.Int, Number(sessionId))
      .input("taskCode", sql.NVarChar(50), taskCode)
      .input("taskTitle", sql.NVarChar(200), taskTitle)
      .input("interfaceName", sql.NVarChar(30), interfaceName)
      .input("durationSeconds", sql.Int, durationSeconds)
      .input("completed", sql.Bit, completed)
      .input(
        "startedAtMs",
        sql.BigInt,
        Number.isFinite(startedAtMs) ? startedAtMs : null
      )
      .input("completedAtMs", sql.BigInt, completedAtMs)
      .input(
        "analysisJson",
        sql.NVarChar(sql.MAX),
        JSON.stringify(analysis ?? {})
      )
      .query(`
        INSERT INTO dbo.TaskResults (
          session_id,
          task_code,
          task_title,
          interface_name,
          duration_seconds,
          completed,
          started_at_ms,
          completed_at_ms,
          analysis_json
        )
        VALUES (
          @sessionId,
          @taskCode,
          @taskTitle,
          @interfaceName,
          @durationSeconds,
          @completed,
          @startedAtMs,
          @completedAtMs,
          @analysisJson
        );

        SELECT SCOPE_IDENTITY() AS taskResultId;
      `);

    res.status(201).json({
      message: "Task result saved successfully.",
      taskResultId: result.recordset[0].taskResultId,
    });
  } catch (error) {
    console.error("Save task result failed:", error);
    res.status(500).json({
      error: "Could not save task result.",
    });
  }
});



app.patch("/api/sessions/:sessionId/end", async (req, res) => {
  try {
    const sessionId = Number(req.params.sessionId);

    if (!Number.isInteger(sessionId) || sessionId < 1) {
      return res.status(400).json({
        error: "Invalid session ID.",
      });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("sessionId", sql.Int, sessionId)
      .query(`
        UPDATE dbo.ResearchSessions
        SET ended_at = SYSUTCDATETIME()
        WHERE session_id = @sessionId
          AND ended_at IS NULL;

        SELECT
          session_id,
          participant_code,
          started_at,
          ended_at
        FROM dbo.ResearchSessions
        WHERE session_id = @sessionId;
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        error: "Research session not found.",
      });
    }

    return res.json({
      message: "Research session ended successfully.",
      session: result.recordset[0],
    });
  } catch (error) {
    console.error("End research session failed:", error);

    return res.status(500).json({
      error: "Could not end research session.",
    });
  }
});


app.post("/api/sessions", async (req, res) => {
  try {
    const pool = await poolPromise;

    // Reuse the participant code when one is supplied.
    let participantCode =
      typeof req.body.participantCode === "string"
        ? req.body.participantCode.trim()
        : "";

    // Create a new participant code only for a new participant.
    if (!participantCode) {
      const nextCode = await pool.request().query(`
        SELECT ISNULL(MAX(
          TRY_CONVERT(INT, SUBSTRING(participant_code, 2, 20))
        ), 0) + 1 AS nextNumber
        FROM dbo.ResearchSessions
        WHERE participant_code LIKE 'P%'
      `);

      participantCode =
        `P${String(nextCode.recordset[0].nextNumber).padStart(3, "0")}`;
    }

    const result = await pool
      .request()
      .input("participantCode", sql.NVarChar(50), participantCode)
      .query(`
        INSERT INTO dbo.ResearchSessions (participant_code)
        VALUES (@participantCode);

        SELECT CAST(SCOPE_IDENTITY() AS INT) AS sessionId;
      `);

    const sessionId = result.recordset[0].sessionId;

    res.status(201).json({
      sessionId,
      participantCode,
    });
  } catch (error) {
    console.error("Create session failed:", error);
    res.status(500).json({
      error: "Could not create research session.",
    });
  }
});





app.post("/api/participant-questionnaire", async (req, res) => {
  try {
    const {
      sessionId,
      visionResponses,
      consentGiven,
    } = req.body;

    // Validate session ID
    const parsedSessionId = Number(sessionId);

    if (
      !Number.isInteger(parsedSessionId) ||
      parsedSessionId < 1
    ) {
      return res.status(400).json({
        error: "Invalid session ID.",
      });
    }

    // Validate consent
    if (consentGiven !== true) {
      return res.status(400).json({
        error: "Participant consent is required.",
      });
    }

    // Validate questionnaire object
    if (
      !visionResponses ||
      typeof visionResponses !== "object" ||
      Array.isArray(visionResponses)
    ) {
      return res.status(400).json({
        error: "Questionnaire responses must be an object.",
      });
    }

    const q = visionResponses;
    const validationErrors = [];

    // Allowed answers for the four questions
    const allowedStudentStatus = ["Yes", "No"];

    const allowedCorrectiveLensUse = ["Yes", "No"];

    const allowedVisionCorrectionType = [
      "Eyeglasses",
      "Corrective/contact lenses",
      "Both glasses and corrective/contact lenses",
      "None",
    ];

    const allowedWebsiteImportance = [
      "Very important",
      "Important",
      "Less important",
      "Not important",
    ];

    // Question 1: Tertiary enrolment
    if (!allowedStudentStatus.includes(q.studentStatus)) {
      validationErrors.push("Invalid tertiary enrolment response.");
    } else if (q.studentStatus !== "Yes") {
      validationErrors.push(
        "This study is intended for currently enrolled tertiary students."
      );
    }

    // Question 2: Corrective lenses during the task
    if (
      !allowedCorrectiveLensUse.includes(q.usingCorrectiveLenses)
    ) {
      validationErrors.push(
        "Invalid corrective lens usage response."
      );
    }

    // Question 3: Type of corrective lenses
    if (
      !allowedVisionCorrectionType.includes(q.visionCorrectionType)
    ) {
      validationErrors.push(
        "Invalid vision correction type."
      );
    }

    // Check consistency between Questions 2 and 3
    if (
      q.usingCorrectiveLenses === "Yes" &&
      q.visionCorrectionType === "None"
    ) {
      validationErrors.push(
        "Please select the type of corrective lenses you will use."
      );
    }

    if (
      q.usingCorrectiveLenses === "No" &&
      q.visionCorrectionType !== "None"
    ) {
      validationErrors.push(
        "If you are not using corrective lenses, please select None."
      );
    }

    // Question 4: Importance of university websites
    if (
      !allowedWebsiteImportance.includes(
        q.universityWebsiteImportance
      )
    ) {
      validationErrors.push(
        "Invalid university website importance response."
      );
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Invalid questionnaire fields.",
        details: validationErrors,
      });
    }

    const pool = await poolPromise;

    // Confirm research session exists
    const session = await pool
      .request()
      .input("sessionId", sql.Int, parsedSessionId)
      .query(`
        SELECT session_id
        FROM dbo.ResearchSessions
        WHERE session_id = @sessionId
      `);

    if (session.recordset.length === 0) {
      return res.status(404).json({
        error: "Research session not found.",
      });
    }

    // Save the four answers as JSON.
    // age_group is NULL because the simplified questionnaire
    // no longer collects participant age.
    await pool
      .request()
      .input("sessionId", sql.Int, parsedSessionId)
      .input(
        "visionResponses",
        sql.NVarChar(sql.MAX),
        JSON.stringify({
          studentStatus: q.studentStatus,
          usingCorrectiveLenses: q.usingCorrectiveLenses,
          visionCorrectionType: q.visionCorrectionType,
          universityWebsiteImportance: q.universityWebsiteImportance,
        })
      )
      .input("consentGiven", sql.Bit, true)
      .query(`
        INSERT INTO dbo.ParticipantQuestionnaires (
          session_id,
          age_group,
          vision_responses_json,
          consent_given
        )
        VALUES (
          @sessionId,
          NULL,
          @visionResponses,
          @consentGiven
        )
      `);

    console.log("Questionnaire saved successfully:", {
      sessionId: parsedSessionId,
      studentStatus: q.studentStatus,
      usingCorrectiveLenses: q.usingCorrectiveLenses,
      visionCorrectionType: q.visionCorrectionType,
      universityWebsiteImportance: q.universityWebsiteImportance,
    });

    return res.status(201).json({
      message: "Participant questionnaire saved successfully.",
      sessionId: parsedSessionId,
    });

  } catch (error) {
    console.error("Questionnaire save error:", error);

    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({
        error: "A questionnaire has already been saved for this session.",
      });
    }

    return res.status(500).json({
      error: "Could not save participant questionnaire.",
    });
  }
});


app.post("/api/participant-feedback", async (req, res) => {
  try {
    const sessionId = Number(req.body.sessionId);
    const feedbackResponses = req.body.feedbackResponses;

    if (!Number.isInteger(sessionId) || sessionId < 1) {
      return res.status(400).json({
        error: "Invalid research session ID.",
      });
    }

    if (
      !feedbackResponses ||
      typeof feedbackResponses !== "object" ||
      Array.isArray(feedbackResponses)
    ) {
      return res.status(400).json({
        error: "Invalid feedback responses.",
      });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("sessionId", sql.Int, sessionId)
      .input(
        "feedbackResponses",
        sql.NVarChar(sql.MAX),
        JSON.stringify(feedbackResponses)
      )
      .query(`
        BEGIN TRY
          BEGIN TRANSACTION;

          -- Confirm the research session exists.
          IF NOT EXISTS (
            SELECT 1
            FROM dbo.ResearchSessions
            WHERE session_id = @sessionId
          )
          BEGIN
            THROW 50002, 'Research session not found.', 1;
          END;

          -- Require all six activities to be completed.
          IF (
            SELECT COUNT(*)
            FROM (VALUES
              ('Baseline', '1'),
              ('Baseline', '2'),
              ('Baseline', '3'),
              ('Accessible', '1'),
              ('Accessible', '2'),
              ('Accessible', '3')
            ) AS expected(interface_name, task_code)
            WHERE EXISTS (
              SELECT 1
              FROM dbo.TaskResults tr
              WHERE tr.session_id = @sessionId
                AND tr.interface_name = expected.interface_name
                AND tr.task_code = expected.task_code
                AND tr.completed = 1
            )
          ) <> 6
          BEGIN
            THROW 50001,
              'All six tasks must be completed before submitting feedback.',
              1;
          END;

          -- Save participant feedback.
          INSERT INTO dbo.ParticipantFeedback (
            session_id,
            feedback_responses_json
          )
          VALUES (
            @sessionId,
            @feedbackResponses
          );

          -- End the research session only after feedback is saved.
          UPDATE dbo.ResearchSessions
          SET ended_at = SYSUTCDATETIME()
          WHERE session_id = @sessionId
            AND ended_at IS NULL;

          COMMIT TRANSACTION;

          SELECT
            session_id,
            ended_at
          FROM dbo.ResearchSessions
          WHERE session_id = @sessionId;

        END TRY
        BEGIN CATCH
          IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

          THROW;
        END CATCH;
      `);

    return res.status(201).json({
      message: "Feedback saved and research session completed.",
      session: result.recordset[0],
    });

  } catch (error) {
    console.error("Feedback submission failed:", error);

    if (error.number === 50001) {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error.number === 50002) {
      return res.status(404).json({
        error: error.message,
      });
    }

    if (error.number === 2627 || error.number === 2601) {
      return res.status(409).json({
        error: "Feedback has already been submitted for this session.",
      });
    }

    return res.status(500).json({
      error: "Could not save participant feedback.",
    });
  }
});


app.listen(PORT, () => {
  console.log(`Research API running on http://localhost:${PORT}`);
});

