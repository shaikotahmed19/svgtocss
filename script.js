// Get DOM elements
const svgInput = document.getElementById('svgInput');
const cssOutput = document.getElementById('cssOutput');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('pasteAndClearBtn');
const exampleBtns = document.querySelectorAll('.example-btn');
const toast = document.getElementById('toast');
const previewInput = document.getElementById('previewInput');
const previewOutput = document.getElementById('previewOutput');
const bgRepeatSelect = document.getElementById('bgRepeat');
const bgPositionSelect = document.getElementById('bgPosition');
const themeDropdown = document.getElementById('themeDropdown');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeMenu = document.getElementById('themeMenu');
const themeMenuButtons = document.querySelectorAll('.theme-menu-item');

const THEME_STORAGE_KEY = 'svgToCssThemePreference';

// Convert SVG to CSS background-image
function convertSvgToCss(svgCode) {
    if (!svgCode || svgCode.trim() === '') {
        return '';
    }
    
    try {
        // Remove any leading/trailing whitespace and newlines
        const cleanSvg = svgCode.trim();
        
        // Validate that it looks like SVG
        if (!cleanSvg.toLowerCase().startsWith('<svg')) {
            throw new Error('Not a valid SVG');
        }
        
        // Encode SVG to base64
        const encoded = btoa(unescape(encodeURIComponent(cleanSvg)));
        
        // Return CSS background-image format
        return `background-image: url("data:image/svg+xml;base64,${encoded}");`;
    } catch (error) {
        return '/* Error: Invalid SVG code. Please check your input. */';
    }
}

// Update output in real-time
function updateOutput() {
    const svgCode = svgInput.value;
    const baseCss = convertSvgToCss(svgCode);

    let fullCss = baseCss;

    // Append background options when SVG is valid
    if (baseCss && !baseCss.startsWith('/* Error:')) {
        const repeatValue = bgRepeatSelect ? bgRepeatSelect.value : 'no-repeat';
        const positionValue = bgPositionSelect ? bgPositionSelect.value : 'center center';

        fullCss = `${baseCss}
background-repeat: ${repeatValue};
background-position: ${positionValue};`;
    }

    cssOutput.value = fullCss;
    
    // Update preview boxes
    updatePreviewInput(svgCode);
    updatePreviewOutput(fullCss);

    // Update clear/paste button label based on input content
    updateClearPasteButton();
}

// Update input preview
function updatePreviewInput(svgCode) {
    if (!previewInput) {
        return;
    }

    if (!svgCode || svgCode.trim() === '') {
        previewInput.innerHTML = '<div style="color: #adb5bd; font-style: italic;">No SVG to preview</div>';
        return;
    }
    
    try {
        // Validate and display SVG
        const cleanSvg = svgCode.trim();
        if (!cleanSvg.toLowerCase().startsWith('<svg')) {
            previewInput.innerHTML = '<div style="color: #dc3545;">Invalid SVG</div>';
            return;
        }
        
        previewInput.innerHTML = cleanSvg;
    } catch (error) {
        previewInput.innerHTML = '<div style="color: #dc3545;">Error rendering SVG</div>';
    }
}

// Update output preview
function updatePreviewOutput(cssCode) {
    if (!cssCode || cssCode.trim() === '' || cssCode.includes('Error:')) {
        previewOutput.innerHTML = '<div style="color: #adb5bd; font-style: italic;">No result to preview</div>';
        return;
    }
    
    try {
        // Extract the background-image URL from CSS
        const urlMatch = cssCode.match(/url\(["']([^"']+)["']\)/);
        if (urlMatch) {
            // Apply the CSS background-image directly to show the result
            previewOutput.innerHTML = '';
            previewOutput.style.backgroundImage = `url("${urlMatch[1]}")`;
            previewOutput.style.backgroundSize = 'contain';
            previewOutput.style.backgroundRepeat = bgRepeatSelect ? bgRepeatSelect.value : 'no-repeat';
            previewOutput.style.backgroundPosition = bgPositionSelect ? bgPositionSelect.value : 'center center';
        } else {
            previewOutput.innerHTML = '<div style="color: #dc3545;">Could not extract URL</div>';
        }
    } catch (error) {
        previewOutput.innerHTML = '<div style="color: #dc3545;">Error rendering result</div>';
    }
}

// Update Clear/Paste button label
function updateClearPasteButton() {
    const hasContent = svgInput.value.trim() !== '';
    clearBtn.textContent = hasContent ? 'Clear' : 'Paste';
}

// Handle Clear/Paste button click
async function handleClearPasteClick() {
    const hasContent = svgInput.value.trim() !== '';

    if (hasContent) {
        // Clear existing SVG/code
        clearInput();
    } else {
        // Paste from clipboard into SVG input
        await pasteFromClipboard();
    }
}

// Paste SVG code from clipboard
async function pasteFromClipboard() {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
        showToast('Clipboard paste not supported in this browser.', true);
        return;
    }

    try {
        const text = await navigator.clipboard.readText();

        if (!text) {
            showToast('Clipboard is empty.', true);
            return;
        }

        svgInput.value = text;
        updateOutput();
        svgInput.focus();
        showToast('Pasted from clipboard.');
    } catch (error) {
        showToast('Unable to read from clipboard.', true);
    }
}

// THEME HANDLING

function isSystemDark() {
    return window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function setActiveThemeButton(theme) {
    themeMenuButtons.forEach(btn => {
        const btnTheme = btn.getAttribute('data-theme');
        btn.classList.toggle('active', btnTheme === theme);
        btn.setAttribute('aria-checked', btnTheme === theme ? 'true' : 'false');
    });
}

function applyTheme(theme) {
    const effectiveDark =
        theme === 'dark' || (theme === 'system' && isSystemDark());

    document.body.classList.toggle('theme-dark', effectiveDark);
    setActiveThemeButton(theme);
}

function initTheme() {
    const saved =
        localStorage.getItem(THEME_STORAGE_KEY) || 'system';

    applyTheme(saved);

    // React to OS theme changes only when in "system" mode
    if (window.matchMedia) {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        media.addEventListener('change', () => {
            const current =
                localStorage.getItem(THEME_STORAGE_KEY) || 'system';
            if (current === 'system') {
                applyTheme('system');
            }
        });
    }
}

function closeThemeMenu() {
    if (!themeDropdown) return;
    themeDropdown.classList.remove('open');
    if (themeToggleBtn) themeToggleBtn.setAttribute('aria-expanded', 'false');
}

function toggleThemeMenu() {
    if (!themeDropdown) return;
    const willOpen = !themeDropdown.classList.contains('open');
    themeDropdown.classList.toggle('open', willOpen);
    if (themeToggleBtn) themeToggleBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
}

// Copy CSS to clipboard
async function copyToClipboard() {
    const cssCode = cssOutput.value;
    
    if (!cssCode || cssCode.trim() === '') {
        showToast('Nothing to copy!', true);
        return;
    }
    
    try {
        await navigator.clipboard.writeText(cssCode);
        showToast('Copied to clipboard! ✓');
    } catch (error) {
        // Fallback for older browsers
        cssOutput.select();
        document.execCommand('copy');
        showToast('Copied to clipboard! ✓');
    }
}

// Clear input
function clearInput() {
    svgInput.value = '';
    cssOutput.value = '';
    previewOutput.style.backgroundImage = '';
    updatePreviewInput('');
    updatePreviewOutput('');
    updateClearPasteButton();
    svgInput.focus();
    showToast('Input cleared');
}

// Load example SVG
function loadExample(svgCode) {
    svgInput.value = svgCode;
    updateOutput();
    showToast('Example loaded!');
}

// Show toast notification
function showToast(message, isError = false) {
    toast.textContent = message;
    toast.className = isError ? 'toast error show' : 'toast show';
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Event listeners
svgInput.addEventListener('input', updateOutput);

copyBtn.addEventListener('click', copyToClipboard);

clearBtn.addEventListener('click', handleClearPasteClick);

if (bgRepeatSelect) {
    bgRepeatSelect.addEventListener('change', updateOutput);
}

if (bgPositionSelect) {
    bgPositionSelect.addEventListener('change', updateOutput);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleThemeMenu();
    });
}

themeMenuButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const theme = btn.getAttribute('data-theme');
        if (!theme) return;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        applyTheme(theme);
        closeThemeMenu();
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!themeDropdown) return;
    if (themeDropdown.contains(e.target)) return;
    closeThemeMenu();
});

exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const svgCode = btn.getAttribute('data-svg');
        loadExample(svgCode);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to copy
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        copyToClipboard();
    }
    
    // Esc to clear
    if (e.key === 'Escape' && document.activeElement === svgInput) {
        clearInput();
    }

    // Esc closes theme menu
    if (e.key === 'Escape') {
        closeThemeMenu();
    }
});

// Initialize
updateOutput();

// Set initial state of Clear/Paste button
updateClearPasteButton();

// Initialize theme (default, dark, or system)
initTheme();

