// main.js
let qp;

try {
  qp = window.top.location.pathname === "/d";
} catch {
  try {
    qp = window.parent.location.pathname === "/d";
  } catch {
    qp = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Access Code System
  function checkAccess() {
    const storedCode = localStorage.getItem("gamo_access_code");
    
    // Helper to create blocking style
    const styleId = "access-block-style";
    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
            body { overflow: hidden !important; }
        `;
        document.head.appendChild(style);
    }
    
    const showOverlay = (initialMsg = "") => {
        if (document.getElementById("access-overlay")) return;
        
        const overlay = document.createElement("div");
        overlay.id = "access-overlay";
        overlay.style.cssText = `
          position: fixed; inset: 0; background: rgba(5, 5, 5, 0.6); z-index: 2147483647;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          font-family: 'Inter', sans-serif; opacity: 0; transition: opacity 0.5s ease;
        `;
        
        // Trigger reflow for transition
        requestAnimationFrame(() => { overlay.style.opacity = "1"; });

        const container = document.createElement("div");
        container.style.cssText = `
          background: #000; border: 1px solid rgba(139, 92, 246, 0.3);
          padding: 40px; border-radius: 20px; text-align: center; max-width: 400px;
          width: 90%; box-shadow: 0 0 50px rgba(139, 92, 246, 0.15);
        `;

        container.innerHTML = `
          <h2 style="color:#fff; margin-bottom:10px; font-weight:700; font-size: 1.5rem;">Gamo <span style="color:#8B5CF6">Access</span></h2>
          <p style="color:#aaa; margin-bottom:24px; font-size:0.9rem;">This device must be authorized.<br>Generate a code via our Discord bot.</p>
          <input type="text" id="access-code" placeholder="XXXX-XXXX-XXXX-XXXX" maxlength="19" autocomplete="off" style="
            background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);
            padding: 14px 16px; border-radius: 10px; color: #fff; width: 100%;
            margin-bottom: 20px; outline: none; text-align: center; letter-spacing: 2px;
            font-family: monospace; text-transform: uppercase; font-size: 1.1rem;
            transition: border-color 0.3s;
          ">
          <button id="access-btn" style="
            background: #8B5CF6; color: #fff; border: none; padding: 14px;
            width: 100%; border-radius: 10px; font-weight: 600; cursor: pointer;
            transition: all 0.2s; font-size: 1rem;
          ">Verify Access</button>
          <p id="access-message" style="color:#ef4444; margin-top:16px; font-size:0.85rem; min-height: 1.2em;">${initialMsg}</p>
        `;

        overlay.appendChild(container);
        document.body.appendChild(overlay);
        
        // --- ANTI-TAMPER EASTER EGG ---
        // Obfuscated payload to detect overlay removal via inspect element
        (function(){
            const o = document.getElementById("access-overlay");
            let triggered = false;
            window.__gamo_trap_active = true;
            
            function fireTrap(){
                if(triggered || !window.__gamo_trap_active) return;
                triggered = true;
                if (o && o.parentNode) { try { o.parentNode.removeChild(o); } catch(err){} }
                document.documentElement.style.setProperty("--accent", "#ff0000", "important");
                const styleEl = document.createElement("style");
                styleEl.textContent = `
                    @keyframes gamoShake { 0% { transform: translate(1px, 1px) rotate(0deg); } 10% { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
                    body, .frame-container { animation: gamoShake 0.5s infinite; filter: blur(5px) !important; pointer-events: none !important; user-select: none !important; }
                    * { color: #ff0000 !important; border-color: #ff0000 !important; }
                `;
                document.head.appendChild(styleEl);
                setTimeout(() => {
                    ["Oh, look at you... a regular 'hacker'.","Did you think it would be that easy?","I put a lot of work into that CSS, and you just deleted it. Mean.","You're looking for the content, right?","It's not here.","Actually, it was here, but then you touched the DOM.","Now we both have to start over.","Goodbye, 'Mr. Robot'."].forEach(m=>alert(m));
                    document.body.innerHTML = ""; document.body.style.backgroundColor = "black";
                    window.top.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                }, 100);
            }

            const n = new MutationObserver((mutations) => {
                if(!window.__gamo_trap_active) return;
                if(!document.getElementById("access-overlay")) return fireTrap();
                for (const m of mutations) {
                    if (m.target === o) {
                        // Only care about the overlay container itself being hidden
                        if (m.type === 'attributes') {
                            const st = window.getComputedStyle(o);
                            if (st.display==="none" || st.visibility==="hidden" || o.hasAttribute("hidden")) fireTrap();
                        }
                        // If children of the overlay are deleted directly from the overlay container (e.g. they deleted the inner access-box)
                        if (m.type === 'childList') {
                            for (const node of m.removedNodes) {
                                if (node.classList && node.classList.contains('access-box')) fireTrap();
                            }
                        }
                    } else if (m.type === 'childList') {
                        // Care if the overlay itself was deleted from the document
                        for (const node of m.removedNodes) {
                            if (node === o || (node.contains && node.contains(o))) fireTrap();
                        }
                    }
                }
            });
            window.__gamo_disable_trap = () => { window.__gamo_trap_active = false; n.disconnect(); };
            n.observe(document.documentElement, { childList: true, subtree: true, attributes: true, characterData: true });
        })();
        // --- END ANTI-TAMPER ---
        
        const input = container.querySelector("input");
        const btn = container.querySelector("button");
        const msg = container.querySelector("#access-message");
        
        // Formatting
        input.addEventListener('input', (e) => {
            let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            if (val.length > 16) val = val.substring(0, 16);
            const parts = [];
            for (let i = 0; i < val.length; i += 4) { parts.push(val.substring(i, Math.min(i + 4, val.length))); }
            e.target.value = parts.join('-');
            input.style.borderColor = 'rgba(255,255,255,0.1)';
        });
        
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            const clean = text.replace(/[^a-zA-Z0-9]/g, '').substring(0, 16).toUpperCase();
            const parts = [];
            for (let i = 0; i < clean.length; i += 4) { parts.push(clean.substring(i, Math.min(i + 4, clean.length))); }
            input.value = parts.join('-');
        });

        const verify = async () => {
             const code = input.value.trim();
             if (code.length < 5) return;
             
             btn.textContent = "Verifying...";
             btn.disabled = true;
             btn.style.opacity = "0.7";
             msg.textContent = "";
             
             try {
                const backendUrl = (self.GAMO_BACKEND || "") + "/api/verify-code";
                const response = await fetch(backendUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code })
                });
                const data = await response.json();
                
                if (response.ok && data.success) {
                    localStorage.setItem("gamo_trusted_device", "true");
                    msg.style.color = "#10b981";
                    localStorage.setItem("gamo_access_code", code);
                    localStorage.setItem("gamo_trusted_device", "true"); // Legacy support
                    
                    setTimeout(() => {
                        overlay.style.opacity = "0";
                        setTimeout(() => {
                            if (window.__gamo_disable_trap) window.__gamo_disable_trap(); // Prevent trap trigger
                            overlay.remove();
                            const styleEl = document.getElementById(styleId);
                            if (styleEl) styleEl.remove();
                        }, 500);
                    }, 500);
                } else {
                    msg.textContent = data.error || "Invalid Code";
                    msg.style.color = "#ef4444";
                    btn.textContent = "Verify Access";
                    btn.disabled = false;
                    btn.style.opacity = "1";
                    input.style.borderColor = "#ef4444";
                }
             } catch (e) {
                 msg.textContent = "Connection Error";
                 btn.textContent = "Verify Access";
                 btn.disabled = false;
                 btn.style.opacity = "1";
             }
        };
        
        btn.onclick = verify;
        input.onkeydown = (e) => { if (e.key === "Enter") verify(); };
    };

    // Main Logic
    if (!storedCode) {
        showOverlay();
    } else {
        // Re-verify in background
        const backendUrl = (self.GAMO_BACKEND || "") + "/api/verify-code";
        fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: storedCode })
        })
        .then(res => {
            if (!res.ok) throw new Error("Network error");
            return res.json();
        })
        .then(data => {
            if (!data || !data.success) {
                // Invalid/Blacklisted
                localStorage.removeItem("gamo_access_code");
                localStorage.removeItem("gamo_trusted_device");
                showOverlay("Session Expired. Please re-enter code.");
            } else {
                // Valid - Ensure block is removed if it persisted
                const styleEl = document.getElementById(styleId);
                if (styleEl) styleEl.remove();
            }
        })
        .catch(() => {
            // CAUTION: "site double checks always"
            // If network error, allow cached if network flakey.
            const styleEl = document.getElementById(styleId);
            if (styleEl) styleEl.remove();
        });
        
        // Ensure immediate release of blocks for valid cached codes while waiting for network
        const styleEl = document.getElementById(styleId);
        if (styleEl) styleEl.remove();
    }
  }
  
  checkAccess();


  const nav = document.querySelector(".f-nav");

  if (nav) {
    const themeId = localStorage.getItem("theme");
    let LogoUrl = "/favicon.png";
    if (themeId === "Inverted") {
      LogoUrl = "/assets/media/favicon/main-inverted.png";
    }
    const html = `
      <div id="icon-container">
        <a class="icon" href="/./"><img alt="nav" id="INImg" src="${LogoUrl}"/></a>
      </div>
      <div class="f-nav-right">
        <a class="navbar-link" href="/./a"><i class="fa-solid fa-gamepad navbar-icon"></i><an>&#71;&#97;</an><an>&#109;&#101;&#115;</an></a>
        <a class="navbar-link" href="/./b"><i class="fa-solid fa-phone navbar-icon"></i><an>&#65;&#112;</an><an>&#112;&#115;</an></a>
        ${qp ? "" : '<a class="navbar-link" href="/./d"><i class="fa-solid fa-laptop navbar-icon"></i><an>&#84;&#97;</an><an>&#98;&#115;</an></a>'}
        <a class="navbar-link" href="/./c"><i class="fa-solid fa-gear navbar-icon settings-icon"></i><an>&#83;&#101;&#116;</an><an>&#116;&#105;&#110;&#103;</an></a>
      </div>`;
    nav.innerHTML = html;
  }

  // LocalStorage Setup for 'dy'
  if (localStorage.getItem("dy") === null || localStorage.getItem("dy") === undefined) {
    localStorage.setItem("dy", "false");
  }

  // Theme Logic
  /* Theme Logic - Temporarily Disabled for Global Redesign
  const themeid = localStorage.getItem("theme");
  const themeEle = document.createElement("link");
  themeEle.rel = "stylesheet";
  const themes = {
    catppuccinMocha: "/assets/css/themes/catppuccin/mocha.css?v=00",
    catppuccinMacchiato: "/assets/css/themes/catppuccin/macchiato.css?v=00",
    catppuccinFrappe: "/assets/css/themes/catppuccin/frappe.css?v=00",
    catppuccinLatte: "/assets/css/themes/catppuccin/latte.css?v=00",
    Inverted: "/assets/css/themes/colors/inverted.css?v=00",
    sky: "/assets/css/themes/colors/sky.css?v=00",
  };

  if (themes[themeid]) {
    themeEle.href = themes[themeid];
    document.body.appendChild(themeEle);
  } else {
    const customThemeEle = document.createElement("style");
    customThemeEle.textContent = localStorage.getItem(`theme-${themeid}`);
    document.head.appendChild(customThemeEle);
  }
  */

  // Favicon and Name Logic
  const icon = document.getElementById("tab-favicon");
  const name = document.getElementById("t");
  const selectedValue = localStorage.getItem("selectedOption");

  function setCloak(nameValue, iconUrl) {
    const customName = localStorage.getItem("CustomName");
    const customIcon = localStorage.getItem("CustomIcon");

    let FinalNameValue = nameValue;
    let finalIconUrl = iconUrl;

    if (customName) FinalNameValue = customName;
    if (customIcon) finalIconUrl = customIcon;

    // Persist
    if (finalIconUrl) localStorage.setItem("icon", finalIconUrl);
    if (FinalNameValue) localStorage.setItem("name", FinalNameValue);

    // Helper to apply to a document
    const applyToDoc = (doc) => {
        if (!doc) return;
        if (FinalNameValue) {
            doc.title = FinalNameValue;
            // Also update element text content if it exists (for Gamo specific logic)
            const titleEl = doc.getElementById("t");
            if (titleEl) titleEl.textContent = FinalNameValue;
        }
        
        if (finalIconUrl) {
            let fav = doc.querySelector("link[rel*='icon']") || doc.getElementById("tab-favicon");
            if (!fav) {
                fav = doc.createElement("link");
                fav.rel = "shortcut icon";
                doc.head.appendChild(fav);
            }
            fav.href = finalIconUrl;
            fav.setAttribute("href", finalIconUrl);
        }
    };

    // Apply to current document
    applyToDoc(document);

    // Apply to Top/Parent Frame (crucial for iframe/shell persistence)
    try {
        if (window.top !== window && window.top.document) {
            applyToDoc(window.top.document);
        }
        if (window.parent !== window && window.parent.document) {
            applyToDoc(window.parent.document);
        }
    } catch (e) {
        // CORS might block access to top frame if domains differ, but for same-origin (shell) it works
        console.warn("Could not cloak top frame:", e);
    }
  }

  const options = {
    Google: { name: "Google", icon: "/assets/media/favicon/google.png" },
    "Savvas Realize": {
      name: "Savvas Realize",
      icon: "/assets/media/favicon/savvas-realize.png",
    },
    SmartPass: {
      name: "SmartPass",
      icon: "/assets/media/favicon/smartpass.png",
    },
    "World Book Online - Super Home": {
      name: "Super Home Page",
      icon: "/assets/media/favicon/wbo.ico",
    },
    "World Book Online - Student": {
      name: "WBO Student | Home Page",
      icon: "/assets/media/favicon/wbo.ico",
    },
    "World Book Online - Timelines": {
      name: "Timelines - Home Page",
      icon: "/assets/media/favicon/wbo.ico",
    },
    Naviance: {
      name: "Naviance Student",
      icon: "/assets/media/favicon/naviance.png",
    },
    "PBS Learning Media": {
      name: "PBS LearningMedia | Teaching Resources For Students And Teachers",
      icon: "/assets/media/favicon/pbslearningmedia.ico",
    },
    "PBS Learning Media Student Home": {
      name: "Student Homepage | PBS LearningMedia",
      icon: "/assets/media/favicon/pbslearningmedia.ico",
    },
    Drive: {
      name: "My Drive - Google Drive",
      icon: "/assets/media/favicon/drive.png",
    },
    Classroom: { name: "Home", icon: "/assets/media/favicon/classroom.png" },
    Schoology: {
      name: "Home | Schoology",
      icon: "/assets/media/favicon/schoology.png",
    },
    Gmail: { name: "Gmail", icon: "/assets/media/favicon/gmail.png" },
    Clever: {
      name: "Clever | Portal",
      icon: "/assets/media/favicon/clever.png",
    },
    Khan: {
      name: "Dashboard | Khan Academy",
      icon: "/assets/media/favicon/khan.png",
    },
    Dictionary: {
      name: "Dictionary.com | Meanings & Definitions of English Words",
      icon: "/assets/media/favicon/dictionary.png",
    },
    Thesaurus: {
      name: "Synonyms and Antonyms of Words | Thesaurus.com",
      icon: "/assets/media/favicon/thesaurus.png",
    },
    Campus: {
      name: "Infinite Campus",
      icon: "/assets/media/favicon/campus.png",
    },
    IXL: { name: "IXL | Dashboard", icon: "/assets/media/favicon/ixl.png" },
    Canvas: { name: "Dashboard", icon: "/assets/media/favicon/canvas.png" },
    LinkIt: { name: "Test Taker", icon: "/assets/media/favicon/linkit.ico" },
    Edpuzzle: { name: "Edpuzzle", icon: "/assets/media/favicon/edpuzzle.png" },
    "i-Ready Math": {
      name: "Math To Do, i-Ready",
      icon: "/assets/media/favicon/i-ready.ico",
    },
    "i-Ready Reading": {
      name: "Reading To Do, i-Ready",
      icon: "/assets/media/favicon/i-ready.ico",
    },
    "ClassLink Login": {
      name: "Login",
      icon: "/assets/media/favicon/classlink-login.png",
    },
    "Google Meet": {
      name: "Google Meet",
      icon: "/assets/media/favicon/google-meet.png",
    },
    "Google Docs": {
      name: "Google Docs",
      icon: "/assets/media/favicon/google-docs.ico",
    },
    "Google Slides": {
      name: "Google Slides",
      icon: "/assets/media/favicon/google-slides.ico",
    },
    Wikipedia: {
      name: "Wikipedia",
      icon: "/assets/media/favicon/wikipedia.png",
    },
    Britannica: {
      name: "Encyclopedia Britannica | Britannica",
      icon: "/assets/media/favicon/britannica.png",
    },
    Ducksters: {
      name: "Ducksters",
      icon: "/assets/media/favicon/ducksters.png",
    },
    Minga: {
      name: "Minga – Creating Amazing Schools",
      icon: "/assets/media/favicon/minga.png",
    },
    "i-Ready Learning Games": {
      name: "Learning Games, i-Ready",
      icon: "/assets/media/favicon/i-ready.ico",
    },
    "NoRedInk Home": {
      name: "Student Home | NoRedInk",
      icon: "/assets/media/favicon/noredink.png",
    },
    Desmos: {
      name: "Desmos | Graphing Calculator",
      icon: "/assets/media/favicon/desmos.ico",
    },
    "Newsela Binder": {
      name: "Newsela | Binder",
      icon: "/assets/media/favicon/newsela.png",
    },
    "Newsela Assignments": {
      name: "Newsela | Assignments",
      icon: "/assets/media/favicon/newsela.png",
    },
    "Newsela Home": {
      name: "Newsela | Instructional Content Platform",
      icon: "/assets/media/favicon/newsela.png",
    },
    "PowerSchool Sign In": {
      name: "Student and Parent Sign In",
      icon: "/assets/media/favicon/powerschool.png",
    },
    "PowerSchool Grades and Attendance": {
      name: "Grades and Attendance",
      icon: "/assets/media/favicon/powerschool.png",
    },
    "PowerSchool Teacher Comments": {
      name: "Teacher Comments",
      icon: "/assets/media/favicon/powerschool.png",
    },
    "PowerSchool Standards Grades": {
      name: "Standards Grades",
      icon: "/assets/media/favicon/powerschool.png",
    },
    "PowerSchool Attendance": {
      name: "Attendance",
      icon: "/assets/media/favicon/powerschool.png",
    },
    Nearpod: { name: "Nearpod", icon: "/assets/media/favicon/nearpod.png" },
    StudentVUE: {
      name: "StudentVUE",
      icon: "/assets/media/favicon/studentvue.ico",
    },
    "Quizlet Home": {
      name: "Flashcards, learning tools and textbook solutions | Quizlet",
      icon: "/assets/media/favicon/quizlet.webp",
    },
    "Google Forms Locked Mode": {
      name: "Start your quiz",
      icon: "/assets/media/favicon/googleforms.png",
    },
    DeltaMath: {
      name: "DeltaMath",
      icon: "/assets/media/favicon/deltamath.png",
    },
    Kami: { name: "Kami", icon: "/assets/media/favicon/kami.png" },
    "GoGuardian Admin Restricted": {
      name: "Restricted",
      icon: "/assets/media/favicon/goguardian-lock.png",
    },
    "GoGuardian Teacher Block": {
      name: "Uh oh!",
      icon: "/assets/media/favicon/goguardian.png",
    },
    "World History Encyclopedia": {
      name: "World History Encyclopedia",
      icon: "/assets/media/favicon/worldhistoryencyclopedia.png",
    },
    "Big Ideas Math Assignment Player": {
      name: "Assignment Player",
      icon: "/assets/media/favicon/bim.ico",
    },
    "Big Ideas Math": {
      name: "Big Ideas Math",
      icon: "/assets/media/favicon/bim.ico",
    },
  };

  if (options[selectedValue]) {
    setCloak(options[selectedValue].name, options[selectedValue].icon);
  } else {
    // Fallback: This handles "Custom" or any saved values in localStorage
    // setCloak uses internal localStorage reads if arguments are null
    setCloak(null, null);
  }

  // Event Key Logic - Read panic keys from localStorage
  let eventKey = ['`']; // Default fallback
  try {
    const storedKey = localStorage.getItem("eventKey");
    if (storedKey) {
      const parsed = JSON.parse(storedKey);
      if (Array.isArray(parsed) && parsed.length > 0) {
        eventKey = parsed;
      }
    }
  } catch (e) {
    // If JSON parse fails, try treating it as a single key
    const rawKey = localStorage.getItem("eventKeyRaw");
    if (rawKey) {
      eventKey = rawKey.split(',').map(k => k.trim());
    }
  }
  
  let pLink = localStorage.getItem("pLink") || "https://classroom.google.com/";
  
  // Ensure URL has protocol
  if (pLink && !pLink.startsWith('http://') && !pLink.startsWith('https://')) {
    pLink = 'https://' + pLink;
  }
  
  let pressedKeys = [];

  document.addEventListener("keydown", event => {
    // Don't trigger panic key when typing in input fields
    const activeEl = document.activeElement;
    const isTyping = activeEl && (
      activeEl.tagName === 'INPUT' || 
      activeEl.tagName === 'TEXTAREA' || 
      activeEl.contentEditable === 'true'
    );
    if (isTyping) return;
    
    pressedKeys.push(event.key);
    if (pressedKeys.length > eventKey.length) {
      pressedKeys.shift();
    }
    if (eventKey.every((key, index) => key === pressedKeys[index])) {
      // Use top.location to escape any iframes (including shell)
      // This ensures the entire window redirects, not just the content iframe
      try {
        window.top.location.href = pLink;
      } catch (e) {
        // If cross-origin, fallback to current window
        window.location.href = pLink;
      }
      pressedKeys = [];
    }
  });

  // Background Image Logic
  // Background Image Logic - Disabled for Performance/Redesign
  /*
  const savedBackgroundImage = localStorage.getItem("backgroundImage");
  if (savedBackgroundImage) {
    document.body.style.backgroundImage = `url('${savedBackgroundImage}')`;
  }
  */
});
