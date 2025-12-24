/* k-lingo.js */

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initChat();
    initSlang();
});

// --- Tabs Logic ---
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Add to click target
            tab.classList.add('active');

            const targetId = tab.dataset.tab;
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// --- Chat Logic ---
function initChat() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatWindow = document.getElementById('chatWindow');

    let isSending = false;

    const addMessage = (text, sender) => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        bubble.textContent = text;
        chatWindow.appendChild(bubble);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    // Chat with Mock Data
    const sendMessage = async (textOverride) => {
        const text = textOverride || input.value.trim();
        if (!text || isSending) return;

        // User UI
        if (!textOverride) input.value = '';
        addMessage(text, 'user');

        isSending = true;
        sendBtn.disabled = true;
        sendBtn.textContent = '...';

        try {
            // Call Node.js Server API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'Server error');
            }

            const data = await response.json();
            addMessage(data.reply, 'bot');

        } catch (err) {
            console.error(err);
            addMessage("AI 튜터와 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.", 'bot');
        } finally {
            isSending = false;
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send';
        }
    };

    sendBtn.addEventListener('click', () => sendMessage());
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) sendMessage();
    });

    // Expose send function globally for Slang interaction
    window.sendChatQuery = sendMessage;

    // Handle URL Params for "Ask" (from Dictionary redirect, if implemented that way)
    const urlParams = new URLSearchParams(window.location.search);
    const askText = urlParams.get('ask');
    if (askText) {
        // Clear params to avoid re-asking on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => sendMessage(askText), 500);
    }
}

// --- Slang Logic ---
function initSlang() {
    const grid = document.getElementById('slangGrid');
    const itemsPerPage = 10;
    let currentPage = 1;
    let fullList = [];

    const renderPage = (page) => {
        if (!grid) return;

        currentPage = page;
        grid.innerHTML = '';

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = fullList.slice(start, end);

        if (pageItems.length === 0) {
            grid.innerHTML = '<div class="loading-spinner">No slang found.</div>';
            return;
        }

        pageItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'slang-card';

            const term = item.term || '';
            const meaning = item.meaning || '';

            card.innerHTML = `
                <div class="slang-term">${term}</div>
                <div class="slang-meaning">${meaning}</div>
            `;

            // Click to ask Chat
            card.addEventListener('click', () => {
                const termClean = term.split('(')[0].trim();
                const askText = `'${termClean}' means '${meaning}'. Can you explain more using this definition?`;
                // Note: Modified askText slightly to fit English context better, though Server prompt handles language.

                // Switch to Chat tab
                document.querySelector('.tab-btn[data-tab="chat"]').click();

                // Send query
                if (window.sendChatQuery) {
                    window.sendChatQuery(askText);
                }
            });

            grid.appendChild(card);
        });

        renderPaginationControls();
    };

    const renderPaginationControls = () => {
        // Find or create pagination wrapper
        let nav = document.getElementById('slang-pagination');
        if (nav) nav.remove(); // Re-render fresh

        const totalPages = Math.ceil(fullList.length / itemsPerPage);
        if (totalPages <= 1) return;

        nav = document.createElement('div');
        nav.id = 'slang-pagination';
        nav.className = 'pagination-controls';

        // Prev Button
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Prev';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                renderPage(currentPage - 1);
                window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' });
            }
        };

        // Page Indicator
        const pageInfo = document.createElement('span');
        pageInfo.textContent = `${currentPage} / ${totalPages}`;
        pageInfo.style.fontWeight = '600';

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                renderPage(currentPage + 1);
                window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' });
            }
        };

        nav.appendChild(prevBtn);
        nav.appendChild(pageInfo);
        nav.appendChild(nextBtn);

        // Append after grid
        grid.parentNode.appendChild(nav);
    };

    // Use Global MOCK_SLANG_LIST
    if (typeof MOCK_SLANG_LIST !== 'undefined') {
        fullList = MOCK_SLANG_LIST;
        renderPage(1);
    } else {
        grid.innerHTML = '<div class="loading-spinner">Error: MOCK_SLANG_LIST not found.</div>';
    }
}
