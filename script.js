// Get DOM elements
const svgInput = document.getElementById('svgInput');
const cssOutput = document.getElementById('cssOutput');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtns = document.querySelectorAll('.example-btn');
const toast = document.getElementById('toast');
const previewInput = document.getElementById('previewInput');
const previewOutput = document.getElementById('previewOutput');

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
    const cssCode = convertSvgToCss(svgCode);
    cssOutput.value = cssCode;
    
    // Update preview boxes
    updatePreviewInput(svgCode);
    updatePreviewOutput(cssCode);
}

// Update input preview
function updatePreviewInput(svgCode) {
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
            previewOutput.style.backgroundRepeat = 'no-repeat';
            previewOutput.style.backgroundPosition = 'center';
        } else {
            previewOutput.innerHTML = '<div style="color: #dc3545;">Could not extract URL</div>';
        }
    } catch (error) {
        previewOutput.innerHTML = '<div style="color: #dc3545;">Error rendering result</div>';
    }
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

clearBtn.addEventListener('click', clearInput);

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
});

// Initialize
updateOutput();

