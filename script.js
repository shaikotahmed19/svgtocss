// Get DOM elements
const svgInput = document.getElementById('svgInput');
const cssOutput = document.getElementById('cssOutput');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtns = document.querySelectorAll('.example-btn');
const toast = document.getElementById('toast');

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

