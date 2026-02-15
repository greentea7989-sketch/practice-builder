const themeToggle = document.getElementById('theme-toggle');
const drawButton = document.getElementById('draw-button');
const menuInput = document.getElementById('menu-input');
const clearInputButton = document.getElementById('clear-input');
const menuCount = document.getElementById('menu-count');
const filteredCount = document.getElementById('filtered-count');
const drawCountInput = document.getElementById('draw-count');
const allowDuplicateInput = document.getElementById('allow-duplicate');
const excludeInput = document.getElementById('exclude-input');
const statusMessage = document.getElementById('status-message');
const resultBox = document.getElementById('result-box');
const copyResultButton = document.getElementById('copy-result');
const clearHistoryButton = document.getElementById('clear-history');
const historyList = document.getElementById('history-list');
const moodButtons = document.querySelectorAll('.mood-btn');

const themeStorageKey = 'theme-preference';
let lastResults = [];
let selectedMood = null;
let spinTimer = null;

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (themeToggle) {
        const isDark = theme === 'dark';
        themeToggle.textContent = isDark ? '화이트모드' : '다크모드';
        themeToggle.setAttribute('aria-pressed', String(isDark));
    }
}

function initializeTheme() {
    const storedTheme = localStorage.getItem(themeStorageKey);
    const theme = storedTheme || getSystemTheme();
    applyTheme(theme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || getSystemTheme();
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
}

function normalizeMenus(text) {
    const rawItems = text
        .split(/[\n,]+/)
        .map(item => item.trim())
        .filter(Boolean);

    const uniqueItems = [];
    const seen = new Set();
    rawItems.forEach(item => {
        const key = item.toLowerCase();
        if (!seen.has(key)) {
            uniqueItems.push(item);
            seen.add(key);
        }
    });

    return uniqueItems;
}

function getExcludeKeywords() {
    return excludeInput.value
        .split(/[,\s]+/)
        .map(word => word.trim())
        .filter(Boolean);
}

function filterMenus(menus, keywords) {
    if (keywords.length === 0) {
        return menus;
    }

    const lowered = keywords.map(word => word.toLowerCase());
    return menus.filter(menu => {
        const menuLower = menu.toLowerCase();
        return !lowered.some(word => menuLower.includes(word));
    });
}

function updateCounts() {
    const menus = normalizeMenus(menuInput.value);
    const filtered = filterMenus(menus, getExcludeKeywords());
    menuCount.textContent = `후보 ${menus.length}개`;
    filteredCount.textContent = `필터 적용 후 ${filtered.length}개`;
}

function setStatus(message) {
    statusMessage.textContent = message;
}

function renderResults(results) {
    resultBox.classList.remove('spinning');
    if (results.length === 0) {
        resultBox.innerHTML = '<p class="placeholder">아직 추첨 전입니다.</p>';
        return;
    }

    const list = document.createElement('ul');
    list.className = 'result-list';
    results.forEach(item => {
        const li = document.createElement('li');
        li.className = 'result-item';
        li.textContent = item;
        list.appendChild(li);
    });

    resultBox.innerHTML = '';
    resultBox.appendChild(list);
}

function pushHistory(results) {
    const time = new Date();
    const entry = document.createElement('li');
    const summary = document.createElement('span');
    summary.textContent = results.join(' · ');
    const timestamp = document.createElement('time');
    timestamp.textContent = time.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    entry.appendChild(summary);
    entry.appendChild(timestamp);

    historyList.prepend(entry);
}

function startSpinAnimation(pool, onComplete) {
    resultBox.classList.add('spinning');
    const spinDuration = 1200;
    const spinInterval = 80;
    const startTime = Date.now();

    spinTimer = setInterval(() => {
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        resultBox.textContent = randomItem;

        if (Date.now() - startTime > spinDuration) {
            clearInterval(spinTimer);
            spinTimer = null;
            onComplete();
        }
    }, spinInterval);
}

function drawMenus() {
    if (spinTimer) {
        return;
    }
    const menus = normalizeMenus(menuInput.value);
    const filteredMenus = filterMenus(menus, getExcludeKeywords());

    updateCounts();

    if (filteredMenus.length === 0) {
        setStatus('추첨할 메뉴가 없습니다. 후보를 입력하거나 필터를 조정하세요.');
        renderResults([]);
        return;
    }

    const drawCount = Math.max(1, Number(drawCountInput.value) || 1);
    const allowDuplicate = allowDuplicateInput.checked;

    if (!allowDuplicate && drawCount > filteredMenus.length) {
        setStatus(`중복 없이 ${drawCount}개를 뽑을 수 없어요. 최대 ${filteredMenus.length}개까지 가능합니다.`);
        renderResults([]);
        return;
    }

    const moodInfo = selectedMood ? `분위기: ${selectedMood}. ` : '';
    setStatus(`${moodInfo}추첨을 시작합니다!`);

    const pool = [...filteredMenus];

    drawButton.disabled = true;
    startSpinAnimation(pool, () => {
        const results = [];
        if (allowDuplicate) {
            for (let i = 0; i < drawCount; i += 1) {
                results.push(pool[Math.floor(Math.random() * pool.length)]);
            }
        } else {
            for (let i = pool.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }
            results.push(...pool.slice(0, drawCount));
        }

        lastResults = results;
        renderResults(results);
        pushHistory(results);
        setStatus('추첨 완료! 맛있게 드세요.');
        drawButton.disabled = false;
    });
}

function clearInput() {
    menuInput.value = '';
    updateCounts();
    setStatus('후보가 비워졌습니다. 새 메뉴를 입력하세요.');
}

function copyResult() {
    if (lastResults.length === 0) {
        setStatus('복사할 결과가 없습니다. 먼저 추첨해 주세요.');
        return;
    }

    const text = `오늘의 메뉴: ${lastResults.join(', ')}`;
    navigator.clipboard.writeText(text).then(() => {
        setStatus('결과를 복사했습니다!');
    }).catch(() => {
        setStatus('복사에 실패했습니다. 브라우저 권한을 확인해 주세요.');
    });
}

function clearHistory() {
    historyList.innerHTML = '';
    setStatus('추첨 기록을 지웠습니다.');
}

function setupContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) {
        return;
    }
    const statusBox = form.querySelector('.form-status');
    const submitButton = form.querySelector('button[type="submit"]');

    const showStatus = (message, isError = false) => {
        if (!statusBox) {
            return;
        }
        statusBox.textContent = message;
        statusBox.classList.toggle('is-error', isError);
        statusBox.classList.add('is-visible');
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (submitButton) {
            submitButton.disabled = true;
        }
        showStatus('전송 중입니다. 잠시만 기다려 주세요...');

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: {
                    Accept: 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                showStatus('문의가 정상적으로 접수되었습니다. 빠르게 회신드릴게요!');
            } else {
                let errorMessage = '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';
                try {
                    const data = await response.json();
                    if (data && data.errors && data.errors.length > 0) {
                        errorMessage = data.errors.map(error => error.message).join(' ');
                    }
                } catch (error) {
                    // Ignore JSON parsing errors and use default message.
                }
                showStatus(errorMessage, true);
            }
        } catch (error) {
            showStatus('네트워크 오류가 발생했습니다. 연결을 확인해 주세요.', true);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}

function handleMoodSelection(event) {
    const button = event.currentTarget;
    moodButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    selectedMood = button.dataset.mood;
    setStatus(`분위기 "${selectedMood}"로 맞춰볼게요.`);
}

initializeTheme();
updateCounts();
setupContactForm();

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

drawButton.addEventListener('click', drawMenus);
menuInput.addEventListener('input', updateCounts);
excludeInput.addEventListener('input', updateCounts);
clearInputButton.addEventListener('click', clearInput);
copyResultButton.addEventListener('click', copyResult);
clearHistoryButton.addEventListener('click', clearHistory);

moodButtons.forEach(button => {
    button.addEventListener('click', handleMoodSelection);
});
