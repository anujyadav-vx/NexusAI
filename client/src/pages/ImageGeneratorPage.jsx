import React, { useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  WandSparkles,
  Check,
  LoaderCircle,
} from "lucide-react";

const STYLES = [
  "Photorealistic",
  "Cyberpunk",
  "3D Render",
  "Anime/Digital Art",
];

const ASPECT_RATIOS = ["16:9", "1:1", "9:16"];

export default function ImageGeneratorPage() {
  const { refreshUserData } = useAuth();
  const { addToast } = useNotification();

  const [prompt, setPrompt] = useState(
    "Cyberpunk neon skyscraper with holographic interfaces and volumetric fog",
  );
  const [style, setStyle] = useState("Cyberpunk");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [loading, setLoading] = useState(false);
  const [imageResult, setImageResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!prompt.trim() || loading) return;

    setLoading(true);

    try {
      const res = await api.imageGenerate({
        prompt: prompt.trim(),
        style,
        aspectRatio,
      });

      if (res.success && res.data) {
        setImageResult(res.data);
        refreshUserData();
        addToast("Image generated successfully!", "success");
      } else {
        throw new Error(res.message || "Image generation failed");
      }
    } catch (err) {
      addToast(err.message || "Failed to generate image.", "error");
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = imageResult?.imageUrl;

  return (
    <div className="studio-page">
      {/* Page Header */}
      <header className="studio-header">
        <div className="studio-heading">
          <div className="studio-heading-icon">
            <ImageIcon size={19} />
          </div>

          <div>
            <div className="studio-eyebrow">CREATIVE TOOLS</div>
            <h1>Image Studio</h1>
          </div>
        </div>

        <p className="studio-description">
          Turn your ideas into visuals. Describe what you imagine, customize the
          style, and generate your artwork.
        </p>
      </header>

      {/* Main Workspace */}
      <div className="studio-workspace">
        {/* Generator Form */}
        <section className="studio-panel studio-controls">
          <div className="studio-panel-heading">
            <div>
              <h2>Create an image</h2>
              <p>Configure your image generation settings.</p>
            </div>

            <WandSparkles size={19} className="studio-muted-icon" />
          </div>

          <form onSubmit={handleGenerate} className="studio-form">
            {/* Prompt */}
            <div className="studio-field">
              <div className="studio-label-row">
                <label htmlFor="studio-prompt">Image prompt</label>
                <span className="studio-optional-label">
                  DESCRIBE YOUR IDEA
                </span>
              </div>

              <textarea
                id="studio-prompt"
                className="studio-prompt-input"
                rows={6}
                placeholder="Describe the image you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={2000}
                required
              />

              <div className="studio-input-footer">
                <span>Be descriptive for better results</span>
                <span>{prompt.length}/2000</span>
              </div>
            </div>

            {/* Style */}
            <div className="studio-field">
              <div className="studio-label-row">
                <label>Aesthetic style</label>
                <span className="studio-optional-label">STYLE</span>
              </div>

              <div className="studio-style-grid">
                {STYLES.map((item) => {
                  const selected = style === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      className={`studio-option ${selected ? "selected" : ""}`}
                      onClick={() => setStyle(item)}
                      aria-pressed={selected}
                    >
                      <span>{item}</span>
                      {selected && <Check size={15} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="studio-field">
              <div className="studio-label-row">
                <label>Aspect ratio</label>
                <span className="studio-optional-label">CANVAS SIZE</span>
              </div>

              <div className="studio-ratio-grid">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    className={`studio-ratio-option ${
                      aspectRatio === ratio ? "selected" : ""
                    }`}
                    onClick={() => setAspectRatio(ratio)}
                    aria-pressed={aspectRatio === ratio}
                  >
                    <span
                      className={`ratio-preview ratio-${ratio.replace(":", "-")}`}
                    />
                    <span>{ratio}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button
              type="submit"
              className="studio-generate-btn"
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <>
                  <LoaderCircle size={17} className="studio-spin" />
                  Generating image...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Generate image
                </>
              )}
            </button>

            <p className="studio-form-note">
              <Sparkles size={13} />
              Your image will appear in the preview panel.
            </p>
          </form>
        </section>

        {/* Preview Panel */}
        <section className="studio-panel studio-preview-panel">
          <div className="studio-preview-header">
            <div>
              <h2>Preview</h2>
              <p>Your generated artwork will appear here.</p>
            </div>

            <span className={`studio-status ${imageUrl ? "complete" : ""}`}>
              <span className="studio-status-dot" />
              {imageUrl ? "Generated" : "Waiting"}
            </span>
          </div>

          <div className="studio-preview-content">
            {imageUrl ? (
              <div className="studio-result">
                <div
                  className={`studio-image-frame ratio-${(
                    imageResult.aspectRatio || aspectRatio
                  ).replace(":", "-")}`}
                >
                  <img
                    src={imageUrl}
                    alt={imageResult.prompt || "Generated artwork"}
                    className="studio-result-image"
                  />

                  {loading && (
                    <div className="studio-regenerating">
                      <LoaderCircle size={20} className="studio-spin" />
                      Generating a new image...
                    </div>
                  )}
                </div>

                <div className="studio-result-details">
                  <div className="studio-result-prompt">
                    <span className="studio-detail-label">PROMPT</span>
                    <p>{imageResult.prompt}</p>
                  </div>

                  <div className="studio-result-meta">
                    <div className="studio-meta-item">
                      <span>Ratio</span>
                      <strong>{imageResult.aspectRatio || "—"}</strong>
                    </div>

                    <div className="studio-meta-item">
                      <span>Style</span>
                      <strong>{imageResult.style || "—"}</strong>
                    </div>

                    <div className="studio-meta-item">
                      <span>Seed</span>
                      <strong>{imageResult.seed ?? "—"}</strong>
                    </div>
                  </div>

                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`nexus_ai_${imageResult.seed ?? "image"}.jpg`}
                    className="studio-download-btn"
                  >
                    <Download size={16} />
                    Download image
                  </a>
                </div>
              </div>
            ) : (
              <div className="studio-empty-state">
                <div className="studio-empty-icon">
                  {loading ? (
                    <LoaderCircle size={30} className="studio-spin" />
                  ) : (
                    <ImageIcon size={30} />
                  )}
                </div>

                <h3>
                  {loading ? "Creating your artwork" : "Your canvas is empty"}
                </h3>

                <p>
                  {loading
                    ? "Please wait while your image is being generated."
                    : "Enter a prompt, select your preferred style, and generate your first image."}
                </p>

                {loading && (
                  <div className="studio-loading-track">
                    <div className="studio-loading-bar" />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
