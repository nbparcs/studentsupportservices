require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { poolPromise, sql } = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

const { computeAndSaveFixations } = require("./fixations");

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

const INTERFACES = ["Baseline", "Accessible"];

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
    res.status(500).json({ error: "Database connection failed" });
  }
});

/* ------------------------------------------------------------------
   Gaze samples
------------------------------------------------------------------ */
app.post("/api/gaze/batch", async (req, res) => {
  try {
    const { sessionId, samples } = req.body;

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
        !sample ||
        typeof sample.taskCode !== "string" ||
        sample.taskCode.length > 50 ||
        !INTERFACES.includes(sample.interface) ||
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
    res.status(500).json({ error: "Could not save gaze samples." });
  }
});

/* ------------------------------------------------------------------
   Compute and save fixations for a task
------------------------------------------------------------------ */
app.post("/api/gaze/fixations/:sessionId", async (req, res) => {
  try {
    const sessionId = Number(req.params.sessionId);
    if (!Number.isInteger(sessionId) || sessionId < 1) {
      return res.status(400).json({ error: "Invalid session ID." });
    }

    const { minDur = 100, maxDisp = 120, maxGap = 300 } = req.body ?? {};
    if (![minDur, maxDisp, maxGap].every((v) => Number.isInteger(v) && v > 0 && v <= 5000)) {
      return res.status(400).json({ error: "Invalid thresholds." });
    }

    const result = await computeAndSaveFixations(sessionId, { minDur, maxDisp, maxGap });
    res.status(201).json({ message: "Fixations saved.", ...result });
  } catch (error) {
    console.error("Fixation detection failed:", error);
    res.status(500).json({ error: "Could not compute fixations." });
  }
});


/* ------------------------------------------------------------------
   Task results
------------------------------------------------------------------ */
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

    if (!INTERFACES.includes(interfaceName)) {
      validationErrors.push("interfaceName is invalid");
    }

    // Accept decimals from the client and round them to whole seconds.
    if (!Number.isFinite(durationSeconds) || durationSeconds < 0) {
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
      .input("durationSeconds", sql.Int, Math.round(durationSeconds))
      .input("completed", sql.Bit, completed)
      .input(
        "startedAtMs",
        sql.BigInt,
        Number.isFinite(startedAtMs) ? startedAtMs : null,
      )
      .input("completedAtMs", sql.BigInt, completedAtMs)
      .input(
        "analysisJson",
        sql.NVarChar(sql.MAX),
        JSON.stringify(analysis ?? {}),
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
    res.status(500).json({ error: "Could not save task result." });
  }
});

/* ------------------------------------------------------------------
   End a session manually
------------------------------------------------------------------ */
app.patch("/api/sessions/:sessionId/end", async (req, res) => {
  try {
    const sessionId = Number(req.params.sessionId);

    if (!Number.isInteger(sessionId) || sessionId < 1) {
      return res.status(400).json({ error: "Invalid session ID." });
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
      return res.status(404).json({ error: "Research session not found." });
    }

    return res.json({
      message: "Research session ended successfully.",
      session: result.recordset[0],
    });
  } catch (error) {
    console.error("End research session failed:", error);
    return res.status(500).json({ error: "Could not end research session." });
  }
});

/* ------------------------------------------------------------------
   Create a research session
   The participant code is generated inside a locked transaction so
   two simultaneous participants cannot receive the same code.
------------------------------------------------------------------ */
app.post("/api/sessions", async (req, res) => {
  try {
    const pool = await poolPromise;

    // Reuse a participant code only when a valid one is supplied.
    const suppliedCode =
      typeof req.body?.participantCode === "string"
        ? req.body.participantCode.trim()
        : "";

    if (suppliedCode && !/^P\d{3,}$/.test(suppliedCode)) {
      return res.status(400).json({ error: "Invalid participant code." });
    }

    const result = await pool
      .request()
      .input("suppliedCode", sql.NVarChar(50), suppliedCode)
      .query(`
        BEGIN TRY
          BEGIN TRANSACTION;

          DECLARE @code NVARCHAR(50) = @suppliedCode;
          DECLARE @next INT;
          DECLARE @newSessionId INT;

          IF @code = ''
          BEGIN
            SELECT @next = ISNULL(MAX(
              TRY_CONVERT(INT, SUBSTRING(participant_code, 2, 20))
            ), 0) + 1
            FROM dbo.ResearchSessions WITH (UPDLOCK, HOLDLOCK)
            WHERE participant_code LIKE 'P%';

            SET @code = 'P' + CASE
              WHEN @next < 1000
                THEN RIGHT('000' + CAST(@next AS VARCHAR(10)), 3)
              ELSE CAST(@next AS VARCHAR(20))
            END;
          END;

          INSERT INTO dbo.ResearchSessions (participant_code)
          VALUES (@code);

          SET @newSessionId = CAST(SCOPE_IDENTITY() AS INT);

          COMMIT TRANSACTION;

          SELECT @newSessionId AS sessionId, @code AS participantCode;
        END TRY
        BEGIN CATCH
          IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

          THROW;
        END CATCH;
      `);

    const { sessionId, participantCode } = result.recordset[0];

    res.status(201).json({ sessionId, participantCode });
  } catch (error) {
    console.error("Create session failed:", error);
    res.status(500).json({ error: "Could not create research session." });
  }
});

/* ------------------------------------------------------------------
   Participant questionnaire (five questions)
------------------------------------------------------------------ */
app.post("/api/participant-questionnaire", async (req, res) => {
  try {
    const { sessionId, visionResponses, consentGiven } = req.body;

    const parsedSessionId = Number(sessionId);

    if (!Number.isInteger(parsedSessionId) || parsedSessionId < 1) {
      return res.status(400).json({ error: "Invalid session ID." });
    }

    if (consentGiven !== true) {
      return res.status(400).json({
        error: "Participant consent is required.",
      });
    }

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

    // Allowed answers for the five questions
    const allowedStudentStatus = ["Yes", "No"];
    const allowedCorrectiveLensUse = ["Yes", "No"];
    const allowedVisionCorrectionType = [
      "Eyeglass (spectacles)",
      "Contact lenses",
      "Both glasses and corrective/contact lenses",
      "None",
    ];
    const allowedComputerTypes = ["Laptop", "Desktop computer"];
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
        "This study is intended for currently enrolled tertiary students.",
      );
    }

    // Question 2: Eyeglasses or contact lenses during the task
    if (!allowedCorrectiveLensUse.includes(q.usingCorrectiveLenses)) {
      validationErrors.push("Invalid corrective lens usage response.");
    }

    // Question 3: Type of vision correction
    if (!allowedVisionCorrectionType.includes(q.visionCorrectionType)) {
      validationErrors.push("Invalid vision correction type.");
    }

    // Consistency between Questions 2 and 3
    if (
      q.usingCorrectiveLenses === "Yes" &&
      q.visionCorrectionType === "None"
    ) {
      validationErrors.push(
        "Please select the type of vision correction you use.",
      );
    }

    if (
      q.usingCorrectiveLenses === "No" &&
      q.visionCorrectionType !== "None"
    ) {
      validationErrors.push(
        "If you will not be wearing eyeglasses or contact lenses, please select None.",
      );
    }

    // Question 4: Laptop or desktop computer
    if (!allowedComputerTypes.includes(q.computerType)) {
      validationErrors.push("Invalid computer type response.");
    }

    // Question 5: Importance of university websites
    if (!allowedWebsiteImportance.includes(q.universityWebsiteImportance)) {
      validationErrors.push("Invalid university website importance response.");
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Invalid questionnaire fields.",
        details: validationErrors,
      });
    }

    const pool = await poolPromise;

    const session = await pool
      .request()
      .input("sessionId", sql.Int, parsedSessionId)
      .query(`
        SELECT session_id
        FROM dbo.ResearchSessions
        WHERE session_id = @sessionId
      `);

    if (session.recordset.length === 0) {
      return res.status(404).json({ error: "Research session not found." });
    }

    // age_group is NULL because the questionnaire does not collect age.
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
          computerType: q.computerType,
          universityWebsiteImportance: q.universityWebsiteImportance,
        }),
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

/* ------------------------------------------------------------------
   Participant feedback (ends the session after saving)
------------------------------------------------------------------ */
app.post("/api/participant-feedback", async (req, res) => {
  try {
    const sessionId = Number(req.body.sessionId);
    const feedbackResponses = req.body.feedbackResponses;

    if (!Number.isInteger(sessionId) || sessionId < 1) {
      return res.status(400).json({ error: "Invalid research session ID." });
    }

    if (
      !feedbackResponses ||
      typeof feedbackResponses !== "object" ||
      Array.isArray(feedbackResponses)
    ) {
      return res.status(400).json({ error: "Invalid feedback responses." });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("sessionId", sql.Int, sessionId)
      .input(
        "feedbackResponses",
        sql.NVarChar(sql.MAX),
        JSON.stringify(feedbackResponses),
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
      return res.status(400).json({ error: error.message });
    }

    if (error.number === 50002) {
      return res.status(404).json({ error: error.message });
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