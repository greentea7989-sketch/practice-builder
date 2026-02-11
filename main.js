// --- Application Initializer ---

// This function will run repeatedly until it finds the necessary HTML elements.
function initializeApp() {

    // 1. Find the critical elements needed for the app to run.
    const originalMessageInput = document.getElementById('original-message');
    const toneButtons = document.querySelectorAll('.tone-btn');
    const coachingResultsContainer = document.getElementById('coaching-results');

    // 2. Check if the elements are actually available on the page.
    if (!originalMessageInput || !coachingResultsContainer || toneButtons.length === 0) {
        // If not, wait for a very short moment (10 milliseconds) and try running this function again.
        setTimeout(initializeApp, 10);
        return; // Stop the current attempt.
    }

    // 3. If all elements are found, proceed to set up the full application.
    console.log("Elements are ready. Starting the application.");
    runApplication();
}


// --- Main Application Logic ---

// This function contains the actual app features and will only run when initializeApp confirms everything is ready.
function runApplication() {

    // --- DOM Element Declarations ---
    const originalMessageInput = document.getElementById('original-message');
    const coachingResultsContainer = document.getElementById('coaching-results');
    const toneButtons = document.querySelectorAll('.tone-btn');
    const uploadButtons = document.querySelectorAll('.upload-btn');
    const fileInputs = document.querySelectorAll('.file-input');
    let selectedTone = null;

    // --- Function Definitions ---

    function getCoachedMessages(message, tone) {
        const prefixes = {
            '진지하게': [
                '진지하게 말씀드리자면, ',
                '솔직하게 제 생각을 말씀드리면, '
            ],
            '유머러스하게': [
                'ㅋㅋㅋ 근데 혹시 ',
                '너 T야? 왜 이렇게 웃겨 ㅋㅋ 암튼 ',
            ],
            '친근하게': [
                '혹시 시간 괜찮을 때, ',
                '부담 갖지 말고 들어봐, '
            ],
            '단호하게': [
                '단호하게 말해서, ',
                '이건 좀 아니라고 생각해. '
            ]
        };

        let results = [];
        if (prefixes[tone]) {
            prefixes[tone].forEach(prefix => {
                results.push(prefix + message);
            });
        }
        return results;
    }

    function generateCoachingResults() {
        const originalMessage = originalMessageInput.value.trim();

        if (!originalMessage || !selectedTone) {
            coachingResultsContainer.innerHTML = '<p class="placeholder">메시지를 입력하고 톤을 선택해주세요.</p>';
            return;
        }

        coachingResultsContainer.innerHTML = ''; // Clear previous results

        const coachedMessages = getCoachedMessages(originalMessage, selectedTone);

        coachedMessages.forEach(msg => {
            const messageCard = document.createElement('div');
            messageCard.className = 'coached-message';
            messageCard.innerHTML = `<p>${msg}</p>`;
            coachingResultsContainer.appendChild(messageCard);
        });
    }

    // --- Event Listener Setup ---

    toneButtons.forEach(button => {
        button.addEventListener('click', () => {
            toneButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedTone = button.textContent;
            generateCoachingResults();
        });
    });

    uploadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const inputId = button.getAttribute('data-for');
            document.getElementById(inputId).click();
        });
    });

    fileInputs.forEach(input => {
        input.addEventListener('change', () => {
            const fileNameDisplayId = `file-name-${input.id.split('-')[2]}`;
            const fileNameDisplay = document.getElementById(fileNameDisplayId);
            if (input.files.length > 0) {
                fileNameDisplay.textContent = input.files[0].name;
            } else {
                fileNameDisplay.textContent = '선택된 파일 없음';
            }
        });
    });

    originalMessageInput.addEventListener('input', generateCoachingResults);

    // --- Dynamic Styles ---
    const style = document.createElement('style');
    style.textContent = `
        .coached-message {
            background-color: #fff;
            border: 1px solid #d1d1d1;
            border-left: 5px solid var(--accent-color);
            padding: 1rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            animation: fadeIn 0.5s ease;
        }
        .coached-message p { white-space: pre-wrap; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

// --- Start the initialization process ---
initializeApp();
