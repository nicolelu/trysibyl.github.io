// Configuration
const TYPING_SPEED = 100;
const BACKSPACE_SPEED = 50;
const CURSOR_BLINK_INTERVAL = 530; // milliseconds
const BLOCK_CURSOR = '❚';
const PIPE_CURSOR = '|';
const CONTINUOUS_LOOP = true;  // Set to false to stop after last word

// Typing animation strings
const TYPING_STRINGS = [
    'Sibyl',
    'Sibyl AI',
    'Sibyl agents',
    'Sibyl data engineering'
];

document.addEventListener('DOMContentLoaded', function() {
    const textElement = document.getElementById('typed-text');
    let currentStringIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let cursorVisible = true;
    let isTyping = false;  // Track if we're actively typing
    
    // Function to get current text without cursor
    const getCurrentText = () => {
        return textElement.textContent.replace(BLOCK_CURSOR, '').replace(PIPE_CURSOR, '');
    };

    // Function to update text with cursor
    const updateText = (text, showCursor, isTypingCursor = false) => {
        const cursor = isTypingCursor ? BLOCK_CURSOR : PIPE_CURSOR;
        textElement.textContent = text + (showCursor ? cursor : '');
    };

    // Handle cursor blinking
    setInterval(() => {
        if (!isTyping) {  // Only blink when not typing
            cursorVisible = !cursorVisible;
            updateText(getCurrentText(), cursorVisible, false);
        }
    }, CURSOR_BLINK_INTERVAL);

    // Main typing function
    function typeText() {
        const currentString = TYPING_STRINGS[currentStringIndex];
        const currentText = getCurrentText();

        if (isDeleting) {
            isTyping = true;
            // Deleting text
            if (currentText.length > 5) { // Keep "Sibyl" and delete the rest
                updateText(currentText.slice(0, -1), true, true);
                setTimeout(typeText, BACKSPACE_SPEED);
            } else {
                isDeleting = false;
                if (CONTINUOUS_LOOP || currentStringIndex < TYPING_STRINGS.length - 1) {
                    currentStringIndex = (currentStringIndex + 1) % TYPING_STRINGS.length;
                    isTyping = false;
                    setTimeout(typeText, 500); // Pause before typing next string
                } else {
                    // Stop at the last word if not looping
                    isTyping = false;
                }
            }
        } else {
            // Typing text
            if (currentText.length < currentString.length) {
                isTyping = true;
                updateText(currentString.slice(0, currentText.length + 1), true, true);
                setTimeout(typeText, TYPING_SPEED);
            } else {
                // Finished typing current string
                isTyping = false;
                if (CONTINUOUS_LOOP || currentStringIndex < TYPING_STRINGS.length - 1) {
                    setTimeout(() => {
                        isDeleting = true;
                        typeText();
                    }, 1500); // Pause before starting to delete
                }
            }
        }
    }

    // Start the typing animation
    setTimeout(typeText, 500);

    // Handle form submission
    const form = document.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success state
                submitButton.classList.remove('chrome-button');
                submitButton.classList.add('success-button');
                submitButton.textContent = "Message received - we'll reach out to you soon!";
                form.reset();

                // Reset button after 5 seconds
                setTimeout(() => {
                    submitButton.classList.remove('success-button');
                    submitButton.classList.add('chrome-button');
                    submitButton.textContent = originalButtonText;
                }, 5000);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            submitButton.textContent = "Error sending message. Please try again.";
            submitButton.classList.add('error-state');

            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.classList.remove('error-state');
                submitButton.textContent = originalButtonText;
            }, 3000);
        }
    });
}); 