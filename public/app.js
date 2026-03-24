'use strict';

// ===== STATE =====
const state = {
  messages: [],       // { role, content }
  isLoading: false,
  isRecording: false,
  isSpeaking: false,
};

// ===== DOM REFS =====
const chatContainer   = document.getElementById('chatContainer');
const welcomeMessage  = document.getElementById('welcomeMessage');
const faqSection      = document.getElementById('faqSection');
const userInput       = document.getElementById('userInput');
const sendBtn         = document.getElementById('sendBtn');
const micBtn          = document.getElementById('micBtn');
const micStatus       = document.getElementById('micStatus');
const speakingOverlay = document.getElementById('speakingOverlay');
const stopSpeakingBtn = document.getElementById('stopSpeakingBtn');

// ===== SPEECH RECOGNITION =====
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = 'sk-SK';
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onstart = () => {
    state.isRecording = true;
    micBtn.classList.add('recording');
    micStatus.textContent = '🎙️ Počúvam...';
  };

  recognition.onresult = (e) => {
    let interim = '';
    let final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) final += e.results[i][0].transcript;
      else interim += e.results[i][0].transcript;
    }
    userInput.value = final || interim;
    autoResizeTextarea();
    if (final) {
      stopRecording();
      sendMessage(final.trim());
    }
  };

  recognition.onerror = (e) => {
    stopRecording();
    if (e.error === 'not-allowed') {
      micStatus.textContent = 'Mikrofón nie je povolený';
    } else if (e.error !== 'aborted') {
      micStatus.textContent = 'Chyba rozpoznávania hlasu';
    }
    setTimeout(() => { micStatus.textContent = ''; }, 3000);
  };

  recognition.onend = () => {
    if (state.isRecording) stopRecording();
  };
} else {
  micBtn.title = 'Hlasový vstup nie je podporovaný v tomto prehliadači';
  micBtn.style.opacity = '0.4';
  micBtn.disabled = true;
}

function startRecording() {
  if (!recognition || state.isLoading) return;
  try {
    recognition.start();
  } catch (e) { /* already started */ }
}

function stopRecording() {
  state.isRecording = false;
  micBtn.classList.remove('recording');
  micStatus.textContent = '';
  try { recognition && recognition.stop(); } catch (e) { /* ignore */ }
}

micBtn.addEventListener('click', () => {
  if (state.isRecording) stopRecording();
  else startRecording();
});

// ===== SPEECH SYNTHESIS =====
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'sk-SK';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  // Prefer a Slovak voice if available
  const voices = window.speechSynthesis.getVoices();
  const skVoice = voices.find(v => v.lang.startsWith('sk'));
  if (skVoice) utterance.voice = skVoice;

  utterance.onstart = () => {
    state.isSpeaking = true;
    speakingOverlay.style.display = 'flex';
  };

  utterance.onend = utterance.onerror = () => {
    state.isSpeaking = false;
    speakingOverlay.style.display = 'none';
  };

  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  state.isSpeaking = false;
  speakingOverlay.style.display = 'none';
}

stopSpeakingBtn.addEventListener('click', stopSpeaking);
speakingOverlay.addEventListener('click', (e) => {
  if (e.target === speakingOverlay) stopSpeaking();
});

// ===== CHAT UI =====
function hideWelcome() {
  if (welcomeMessage && welcomeMessage.parentNode) {
    welcomeMessage.remove();
  }
}

function hideFaq() {
  faqSection.style.display = 'none';
}

function appendMessage(role, content, isStreaming = false) {
  hideWelcome();

  const msgEl = document.createElement('div');
  msgEl.className = `message ${role}`;

  const avatarEl = document.createElement('div');
  avatarEl.className = 'message-avatar';
  avatarEl.textContent = role === 'assistant' ? 'BA' : '👤';

  const bubbleEl = document.createElement('div');
  bubbleEl.className = 'message-bubble';
  bubbleEl.textContent = content;

  msgEl.appendChild(avatarEl);
  msgEl.appendChild(bubbleEl);

  // Add speak button for assistant messages
  if (role === 'assistant') {
    const speakEl = document.createElement('button');
    speakEl.className = 'speak-btn';
    speakEl.title = 'Prečítať odpoveď';
    speakEl.innerHTML = '🔊';
    speakEl.addEventListener('click', () => speak(bubbleEl.textContent));
    msgEl.appendChild(speakEl);
  }

  chatContainer.appendChild(msgEl);
  scrollToBottom();
  return bubbleEl;
}

function appendTypingIndicator() {
  const wrapper = document.createElement('div');
  wrapper.className = 'message assistant';
  wrapper.id = 'typingIndicator';

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = 'BA';

  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

  wrapper.appendChild(avatar);
  wrapper.appendChild(indicator);
  chatContainer.appendChild(wrapper);
  scrollToBottom();
  return wrapper;
}

function removeTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ===== TEXTAREA AUTO-RESIZE =====
function autoResizeTextarea() {
  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
}

userInput.addEventListener('input', autoResizeTextarea);

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const text = userInput.value.trim();
    if (text && !state.isLoading) sendMessage(text);
  }
});

sendBtn.addEventListener('click', () => {
  const text = userInput.value.trim();
  if (text && !state.isLoading) sendMessage(text);
});

// ===== FAQ BUTTONS =====
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const question = btn.dataset.question;
    if (question && !state.isLoading) {
      hideFaq();
      sendMessage(question);
    }
  });
});

// ===== SEND MESSAGE =====
async function sendMessage(text) {
  if (!text || state.isLoading) return;

  state.isLoading = true;
  sendBtn.disabled = true;
  userInput.value = '';
  autoResizeTextarea();

  // Stop any speaking
  stopSpeaking();

  // Add user message to UI and state
  appendMessage('user', text);
  state.messages.push({ role: 'user', content: text });

  // Show typing indicator
  const typingEl = appendTypingIndicator();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: state.messages }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    removeTypingIndicator();

    // Stream response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let bubbleEl = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') break;

        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            if (!bubbleEl) bubbleEl = appendMessage('assistant', '').parentNode.querySelector('.message-bubble');
            bubbleEl.textContent = parsed.error;
            fullText = parsed.error;
            break;
          }
          if (parsed.text) {
            fullText += parsed.text;
            if (!bubbleEl) {
              hideWelcome();
              const msgEl = document.createElement('div');
              msgEl.className = 'message assistant';
              const avatarEl = document.createElement('div');
              avatarEl.className = 'message-avatar';
              avatarEl.textContent = 'BA';
              bubbleEl = document.createElement('div');
              bubbleEl.className = 'message-bubble';
              const speakEl = document.createElement('button');
              speakEl.className = 'speak-btn';
              speakEl.title = 'Prečítať odpoveď';
              speakEl.innerHTML = '🔊';
              speakEl.addEventListener('click', () => speak(bubbleEl.textContent));
              msgEl.appendChild(avatarEl);
              msgEl.appendChild(bubbleEl);
              msgEl.appendChild(speakEl);
              chatContainer.appendChild(msgEl);
            }
            bubbleEl.textContent = fullText;
            scrollToBottom();
          }
        } catch (e) { /* non-JSON line, skip */ }
      }
    }

    // Save assistant message
    if (fullText) {
      state.messages.push({ role: 'assistant', content: fullText });
      // Auto-speak the response if user used voice input
      if (state.lastInputWasVoice) {
        speak(fullText);
        state.lastInputWasVoice = false;
      }
    }

  } catch (err) {
    removeTypingIndicator();
    appendMessage('assistant', 'Ľutujem, nastala technická chyba. Skúste to prosím znovu.');
    console.error(err);
  } finally {
    state.isLoading = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
}

// Track if last input was voice (for auto-speak)
const origStartRecording = startRecording;
micBtn.addEventListener('click', () => {
  if (!state.isRecording) state.lastInputWasVoice = true;
});

// Load voices for speech synthesis
if (window.speechSynthesis) {
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    // voices loaded - no action needed, speak() will pick them up
  });
}
