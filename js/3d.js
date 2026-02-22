document.getElementById("yr").textContent = new Date().getFullYear();

/* ─────────────────────────────────────────────
     OBFUSCATED MODEL CONFIG
     Links are encoded in base64 to keep them out
     of plain-text page source (not truly secret,
     but not immediately visible in HTML inspect).
     ───────────────────────────────────────────── */
const _cfg = (function () {
  // Each entry: [label, emoji, base64(glbPath), description]
  // base64 encoded raw GitHub paths
  const raw = [
    [
      "Assem2.glb",
      "🔧",
      "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL1N1bHRoYW5FQXphbUsvVGlsbGVyL21haW4vQXNzZW0yLmdsYg==",
      "Final year mechanical assembly design project created during engineering studies using SolidWorks, converted for 3D web visualization.",
    ],
    [
      "Aeroplane.glb",
      "✈️",
      "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL1N1bHRoYW5FQXphbUsvVGlsbGVyL21haW4vQWVyb3BsYW5lLmdsYg==",
      "Modeled during training at Technosoft Computer Institute, focused on aeronautical design and SolidWorks 3D modeling practice.",
    ],
    [
      "calw_city_map.glb",
      "🗺️",
      "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL1N1bHRoYW5FQXphbUsvVGlsbGVyL21haW4vY2Fsd19jaXR5X21hcC5nbGI=",
      "Urban city model developed while working at Calpion Software Technologies, used in map-based equipment visualization tasks.",
    ],
    [
      "city_test.glb",
      "🏙️",
      "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL1N1bHRoYW5FQXphbUsvVGlsbGVyL21haW4vY2l0eV90ZXN0LmdsYg==",
      "Test model of a 3D city environment created at Calpion for simulation and visual testing purposes.",
    ],
    [
      "map_lviv_ukraine.glb",
      "🌍",
      "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL1N1bHRoYW5FQXphbUsvVGlsbGVyL21haW4vbWFwX2x2aXZfdWtyYWluZS5nbGI=",
      "Detailed 3D map of Lviv, Ukraine — built as part of geospatial visualization research.",
    ],
  ];

  return raw.map(([name, emoji, b64, desc]) => ({
    name,
    emoji,
    desc,
    glbUrl: atob(b64),
  }));
})();

/* ─────────────────────────────────────────────
     DETECT PLATFORM
     ───────────────────────────────────────────── */
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isAndroid = /android/i.test(navigator.userAgent);

/* ─────────────────────────────────────────────
     BUILD CARDS
     ───────────────────────────────────────────── */
const container = document.getElementById("models-container");

_cfg.forEach((model, idx) => {
  const qrId = `qr-${idx}`;
  const androidArUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(model.glbUrl)}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;
  const sceneViewerUrl = `https://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(model.glbUrl)}&mode=ar_only`;
  // iOS uses USDZ — we link to glb (model-viewer handles on iOS via WebXR fallback)
  // For iOS AR Quick Look we need .usdz. We'll open the model-viewer AR on iOS.
  const iosArUrl = `${model.glbUrl}`;

  const card = document.createElement("div");
  card.className = "model-block";
  card.innerHTML = `
      <div class="model-block-header">
        <h2>${model.emoji} ${model.name}</h2>
        <span class="model-tag">AR Ready</span>
      </div>
      <div class="model-qr-flex">
        <!-- 3D VIEWER -->
        <model-viewer
          id="mv-${idx}"
          src="${model.glbUrl}"
          alt="${model.name}"
          auto-rotate
          camera-controls
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          shadow-intensity="1"
          exposure="1"
          style="height:340px;width:100%;border-right:1px solid var(--border);background:#0d0f18;"
        ></model-viewer>

        <!-- QR CODE -->
        <div class="qr-box">
          <p><i class="fas fa-qrcode"></i> Scan for AR</p>
          <canvas id="${qrId}"></canvas>
          <p style="font-size:0.62rem;color:var(--muted);text-align:center;margin-top:4px;">Point phone camera here</p>
        </div>

        <!-- INFO + BUTTONS -->
        <div class="model-info">
          <p><strong>About:</strong> ${model.desc}</p>
          <div class="ar-buttons">
            <!-- Android / Scene Viewer -->
            <a href="${sceneViewerUrl}" class="ar-btn ar-btn-android" target="_blank" rel="noopener"
               onclick="return handleARClick(event,'android','${encodeURIComponent(model.glbUrl)}')">
              <i class="fab fa-android"></i> Open AR on Android
            </a>
            <!-- iOS AR Quick Look -->
            <a href="#" class="ar-btn ar-btn-ios"
               onclick="return handleARClick(event,'ios','${encodeURIComponent(model.glbUrl)}')">
              <i class="fab fa-apple"></i> Open AR on iOS
            </a>
            <!-- WebXR / model-viewer built-in -->
            <button class="ar-btn ar-btn-webxr" onclick="launchWebXR(${idx})">
              <i class="fas fa-camera pulse"></i> Launch WebXR AR (Browser)
            </button>
          </div>
        </div>
      </div>
    `;
  container.appendChild(card);

  // Generate QR pointing to Scene Viewer AR link
  new QRious({
    element: document.getElementById(qrId),
    value: sceneViewerUrl,
    size: 160,
    background: "#ffffff",
    foreground: "#1a0a3d",
    level: "H",
  });
});

/* ─────────────────────────────────────────────
     AR CLICK HANDLERS
     ───────────────────────────────────────────── */
function handleARClick(e, platform, encodedUrl) {
  const glbUrl = decodeURIComponent(encodedUrl);

  if (platform === "android") {
    if (!isAndroid) {
      alert(
        "⚠️ Android AR (Google Scene Viewer) works best on an Android device with ARCore. On desktop or iOS, try the iOS or WebXR button instead.",
      );
      return false;
    }
    // Let the href link proceed (Scene Viewer intent)
    return true;
  }

  if (platform === "ios") {
    e.preventDefault();
    if (!isIOS) {
      alert(
        "⚠️ iOS AR Quick Look works on iPhone or iPad with iOS 12+. On Android, use the Android AR button instead.",
      );
      return false;
    }
    // model-viewer's AR button triggers Quick Look on iOS automatically
    // Find the corresponding model-viewer and programmatically click its AR button
    const mvIndex = Array.from(
      document.querySelectorAll("model-viewer"),
    ).findIndex(mv => mv.src === glbUrl);
    if (mvIndex >= 0) {
      const mv = document.querySelectorAll("model-viewer")[mvIndex];
      mv.activateAR();
    }
    return false;
  }

  return true;
}

function launchWebXR(idx) {
  const mv = document.querySelectorAll("model-viewer")[idx];
  if (!mv) return;

  // Check if AR is available via model-viewer
  if (mv.canActivateAR) {
    mv.activateAR();
  } else {
    // Check native WebXR
    if (navigator.xr) {
      navigator.xr.isSessionSupported("immersive-ar").then(supported => {
        if (supported) {
          mv.activateAR();
        } else {
          document.getElementById("webxr-modal").classList.add("active");
        }
      });
    } else {
      document.getElementById("webxr-modal").classList.add("active");
    }
  }
}

/* ─────────────────────────────────────────────
     PARALLAX BG ORB
     ───────────────────────────────────────────── */
document.addEventListener("mousemove", e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 40;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  document.getElementById("bg-orb").style.transform =
    `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
});
