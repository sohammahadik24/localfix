// ─────────────────────────────────────────────────────────────────────────────
// src/components/RequestForm.jsx
//
// WHAT IS THIS COMPONENT?
//   The main customer request form for LocalFix.
//   Includes Real-Time AI Problem Classification that automatically analyzes
//   the customer's problem description and auto-selects the appropriate category!
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Row, Col, Badge, Spinner } from "react-bootstrap";
import services from "../data/services";
import { requestsAPI } from "../services/api";

const today = new Date().toISOString().split("T")[0];

function RequestForm({ formData, setFormData, image, setImage, errors, onSubmit, submitting }) {
  const fileInputRef = useRef(null);

  // ── AI AUTO-CLASSIFICATION STATE ──────────────────────────────────────────
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [userManuallySelected, setUserManuallySelected] = useState(false);
  const debounceTimerRef = useRef(null);

  // ── 1. REAL-TIME AI CLASSIFICATION EFFECT ─────────────────────────────────
  useEffect(() => {
    const text = formData.problem?.trim();

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!text || text.length < 5) {
      setAiSuggestion(null);
      return;
    }

    // Set 350ms debounce before triggering AI classification
    debounceTimerRef.current = setTimeout(async () => {
      setAiAnalyzing(true);
      try {
        const res = await requestsAPI.classifyPreview({ description: text });
        if (res.success && res.data && res.data.detectedCategory) {
          const detected = res.data.detectedCategory;
          setAiSuggestion(res.data);

          // Auto-select the category if the user hasn't manually chosen something different
          if (!userManuallySelected || !formData.service) {
            setFormData((prev) => ({
              ...prev,
              service: detected,
            }));
          }
        }
      } catch (err) {
        console.log("AI Preview error:", err.message);
      } finally {
        setAiAnalyzing(false);
      }
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData.problem, userManuallySelected, setFormData]);

  // ── 2. HANDLE FIELD CHANGES ───────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "service") {
      setUserManuallySelected(true);
    }
    setFormData({ ...formData, [name]: value });
  };

  // Direct Category Tile Click
  const handleCategoryTileClick = (catName) => {
    setUserManuallySelected(true);
    setFormData({ ...formData, service: catName });
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Form noValidate onSubmit={onSubmit}>
      {/* ── 1. PROBLEM DESCRIPTION (Input First for AI Detection) ─────────── */}
      <Form.Group className="mb-4" controlId="requestProblem">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <Form.Label className="lf-form-field-label mb-0">
            Describe Your Problem <span className="text-danger">*</span>
          </Form.Label>
          {aiAnalyzing ? (
            <span className="small text-primary d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-1" />
              <i className="bi bi-stars me-1"></i> AI is classifying...
            </span>
          ) : aiSuggestion ? (
            <Badge bg="info-subtle" text="primary" className="border border-primary-subtle px-2 py-1">
              <i className="bi bi-robot me-1"></i> AI Auto-Classified
            </Badge>
          ) : null}
        </div>

        <Form.Control
          as="textarea"
          rows={4}
          name="problem"
          placeholder="Example: My AC is running but not cooling properly, blowing warm air..."
          value={formData.problem}
          onChange={handleChange}
          className={`lf-form-textarea ${errors.problem ? "is-invalid" : ""}`}
        />

        {/* ── AI Auto-Detected Suggestion Banner ── */}
        {aiSuggestion && (
          <div className="alert alert-primary py-2 px-3 mt-2 mb-2 rounded-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-stars text-primary fs-5"></i>
              <div className="small">
                <span className="fw-bold text-dark">
                  AI Auto-Selected Category:{" "}
                  <span className="text-primary fw-bolder">{aiSuggestion.detectedCategory}</span>
                </span>
                <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Match Confidence: {(aiSuggestion.confidence * 100).toFixed(0)}% • {aiSuggestion.reasoning}
                </div>
              </div>
            </div>
            {formData.service === aiSuggestion.detectedCategory && (
              <Badge bg="success" className="px-2 py-1">
                <i className="bi bi-check-circle-fill me-1"></i> Auto-Applied
              </Badge>
            )}
          </div>
        )}

        <div className="lf-textarea-hint">
          Type your issue naturally — our AI will automatically detect the right service category.
        </div>
        {errors.problem && <div className="lf-field-error">{errors.problem}</div>}
      </Form.Group>

      {/* ── 2. SERVICE CATEGORY TILES (Auto-Selected by AI) ──────────────── */}
      <Form.Group className="mb-4" controlId="requestService">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label className="lf-form-field-label mb-0">
            Service Category <span className="text-danger">*</span>
          </Form.Label>
          <small className="text-muted">Click to change if needed</small>
        </div>

        {/* Visual Category Grid */}
        <Row className="g-2 mb-2">
          {services.map((svc) => {
            const isSelected = formData.service === svc.name;
            const isAiMatch = aiSuggestion && aiSuggestion.detectedCategory === svc.name;

            return (
              <Col xs={6} sm={4} key={svc.id}>
                <div
                  onClick={() => handleCategoryTileClick(svc.name)}
                  style={{
                    cursor: "pointer",
                    border: isSelected ? "2px solid #2563EB" : "1px solid #E2E8F0",
                    backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                  className="d-flex align-items-center gap-2"
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: (svc.color || "#2563EB") + "18",
                      color: svc.color || "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                    }}
                  >
                    <i className={svc.icon || "bi bi-tools"}></i>
                  </div>
                  <div className="flex-grow-1 text-truncate">
                    <div className="fw-semibold text-dark small text-truncate">{svc.name}</div>
                    {isAiMatch && (
                      <span
                        className="badge bg-primary-subtle text-primary p-0"
                        style={{ fontSize: "0.68rem" }}
                      >
                        ✨ AI Match
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <i className="bi bi-check-circle-fill text-primary ms-auto"></i>
                  )}
                </div>
              </Col>
            );
          })}
        </Row>

        {/* Fallback Select Dropdown */}
        <Form.Select
          name="service"
          value={formData.service}
          onChange={handleChange}
          className={`lf-form-select ${errors.service ? "is-invalid" : ""}`}
        >
          <option value="" disabled>
            — Select a service category —
          </option>
          {services.map((svc) => (
            <option key={svc.id} value={svc.name}>
              {svc.name}
            </option>
          ))}
        </Form.Select>

        {errors.service && <div className="lf-field-error">{errors.service}</div>}
      </Form.Group>

      {/* ── 3. SERVICE LOCATION ────────────────────────────────────────── */}
      <Form.Group className="mb-4" controlId="requestLocation">
        <Form.Label className="lf-form-field-label">
          Service Location / Address <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="text"
          name="location"
          placeholder="e.g. Flat 402, Sunshine Apts, Andheri West, Mumbai"
          value={formData.location}
          onChange={handleChange}
          className={`lf-form-input ${errors.location ? "is-invalid" : ""}`}
        />
        {errors.location && <div className="lf-field-error">{errors.location}</div>}
      </Form.Group>

      {/* ── 4. DATE & TIME ─────────────────────────────────────────────── */}
      <Row className="g-3 mb-4">
        <Col sm={6}>
          <Form.Group controlId="requestDate">
            <Form.Label className="lf-form-field-label">
              Preferred Date <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              className={`lf-form-input ${errors.date ? "is-invalid" : ""}`}
            />
            {errors.date && <div className="lf-field-error">{errors.date}</div>}
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group controlId="requestTime">
            <Form.Label className="lf-form-field-label">
              Preferred Time <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`lf-form-input ${errors.time ? "is-invalid" : ""}`}
            />
            {errors.time && <div className="lf-field-error">{errors.time}</div>}
          </Form.Group>
        </Col>
      </Row>

      {/* ── 5. OPTIONAL IMAGE UPLOAD ───────────────────────────────────── */}
      <Form.Group className="mb-4" controlId="requestImage">
        <Form.Label className="lf-form-field-label">
          Upload Problem Photo <span className="lf-optional-label">(Optional)</span>
        </Form.Label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        {image ? (
          <div className="lf-image-preview-wrap">
            <img
              src={URL.createObjectURL(image)}
              alt="Problem preview"
              className="lf-image-preview"
            />
            <div className="lf-image-preview-info">
              <div className="lf-image-name">
                <i className="bi bi-image me-1"></i> {image.name}
              </div>
              <div className="lf-image-size">{(image.size / 1024).toFixed(1)} KB</div>
            </div>
            <button type="button" className="lf-image-remove-btn" onClick={removeImage}>
              <i className="bi bi-x-circle-fill"></i> Remove
            </button>
          </div>
        ) : (
          <div
            className="lf-image-upload-area"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-cloud-upload lf-upload-icon"></i>
            <p className="lf-upload-text">Click to upload a photo of the problem</p>
          </div>
        )}
      </Form.Group>

      {/* ── 6. ADDITIONAL NOTES ────────────────────────────────────────── */}
      <Form.Group className="mb-4" controlId="requestNotes">
        <Form.Label className="lf-form-field-label">
          Additional Instructions <span className="lf-optional-label">(Optional)</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="notes"
          placeholder="Any specific landmarks, gate access codes, or timing preferences..."
          value={formData.notes}
          onChange={handleChange}
          className="lf-form-textarea"
        />
      </Form.Group>

      {/* ── SUBMIT BUTTON ─────────────────────────────────────────────── */}
      <Button
        type="submit"
        disabled={submitting}
        className="lf-form-submit-btn w-100 py-3 fw-bold fs-6"
      >
        {submitting ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Creating Booking with AI...
          </>
        ) : (
          <>
            <i className="bi bi-send-fill me-2"></i>
            Submit Service Request
          </>
        )}
      </Button>
    </Form>
  );
}

export default RequestForm;
