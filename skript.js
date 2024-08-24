document.addEventListener("DOMContentLoaded", function () {
    const toggleKeys = (type) => {
      document.querySelectorAll('.lowercase, .uppercase, .numbers-special').forEach(key => {
        key.style.display = 'none';
      });
      document.querySelectorAll('.' + type).forEach(key => {
        key.style.display = 'flex';
      });
    };
  
    let isUppercase = false;
    let isNumbersSpecial = false;
  
    const toggleEventHandler = (buttonId, toggleType) => {
      document.getElementById(buttonId).addEventListener('click', () => {
        if (toggleType === 'uppercase') {
          isUppercase = !isUppercase;
          isNumbersSpecial = false;
          toggleKeys(isUppercase ? 'uppercase' : 'lowercase');
        } else if (toggleType === 'numbers-special') {
          isNumbersSpecial = !isNumbersSpecial;
          toggleKeys(isNumbersSpecial ? 'numbers-special' : 'lowercase');
        }
      });
    };
  
    toggleEventHandler('caps', 'uppercase');
    toggleEventHandler('special', 'numbers-special');
  
    let longPressTimer;
    const longPressDuration = 500;
  
    const handleMouseDown = (event, keyElement) => {
      event.preventDefault();
      longPressTimer = setTimeout(() => {
        if (keyElement.dataset.longpress) {
          const inputField = document.querySelector('.inpi');
          inputField.value += keyElement.dataset.longpress;
          updateSuggestions();
          longPressTimer = null;
        }
      }, longPressDuration);
    };
  
    const handleMouseUp = (keyElement) => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        const inputField = document.querySelector('.inpi');
        inputField.value += keyElement.innerText;
        updateSuggestions(keyElement.innerText === ' ');
      }
    };
  
    const handleMouseLeave = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  
    document.querySelectorAll('.key').forEach(item => {
      item.addEventListener('mousedown', (event) => handleMouseDown(event, item));
      item.addEventListener('mouseup', () => handleMouseUp(item));
      item.addEventListener('mouseleave', handleMouseLeave);
    });
  
    document.querySelector('#delp').addEventListener('click', () => {
      const inputField = document.querySelector('.inpi');
      inputField.value = inputField.value.slice(0, -1);
      updateSuggestions();
    });
  
    document.querySelector('#delt').addEventListener('click', () => {
      const inputField = document.querySelector('.inpi');
      const text = inputField.value;
      const parts = text.split(' ').filter(Boolean);
      inputField.value = parts.length > 1 ? parts.slice(0, -1).join(' ') + ' ' : '';
      updateSuggestions();
    });
  
    document.querySelector('#space').addEventListener('click', () => {
      const inputField = document.querySelector('.inpi');
      inputField.value += ' ';
      updateSuggestions(true);
    });
  
    document.getElementById('go').addEventListener('click', async () => {
      const text = document.getElementById('text').value;
      await window.electronAPI.performKeyPress(text);
      const inputField = document.querySelector('.inpi');
      const inputText = inputField.value.trim();
      const lastWord = inputText.split(' ').pop();
      if (!commonWords.includes(lastWord)) {
        await window.electronAPI.saveWord(lastWord);
      }
      document.getElementById('text').value = '';
    });
  
    let isDragging = false;
    let startX, startY;
  
    document.getElementById('move-btn').addEventListener('mousedown', (event) => {
      isDragging = true;
      startX = event.clientX;
      startY = event.clientY;
    });
  
    document.addEventListener('mousemove', (event) => {
      if (isDragging) {
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        window.electronAPI.moveWindow(deltaX, deltaY);
        startX = event.clientX;
        startY = event.clientY;
      }
    });
  
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  
    let commonWords = [];
  
    // Assuming window.electronAPI.getCommonWords() is an asynchronous function
    window.electronAPI.getCommonWords().then(words => {
      commonWords = words;
    }).catch(err => {
      console.error('Error fetching common words:', err);
    });
  
    fetch('word.md')
      .then(response => response.text())
      .then(text => {
        commonWords = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
      })
      .catch(error => console.error('Error fetching the Markdown file:', error));
  
    function updateSuggestions(triggerSpace = false) {
      const inputField = document.querySelector('.inpi');
      const inputText = inputField.value.toLowerCase();
      const lastWord = inputText.split(' ').pop();
      const suggestions = commonWords.filter(word => word.toLowerCase().startsWith(lastWord)).slice(0, 5);
      const suggestionsContainer = document.getElementById('suggestions');
  
      suggestionsContainer.innerHTML = '';
      suggestions.forEach(suggestion => {
        const suggestionButton = document.createElement('button');
        suggestionButton.classList.add('suggestion');
        suggestionButton.textContent = suggestion;
        suggestionButton.addEventListener('click', () => {
          const text = inputField.value;
          const parts = text.split(' ');
          parts.pop();
          inputField.value = parts.join(' ') + ' ' + suggestion + ' ';
          suggestionsContainer.innerHTML = '';
        });
        suggestionsContainer.appendChild(suggestionButton);
      });
    }
  
    document.addEventListener('paste', (event) => {
      navigator.clipboard.readText().then(text => {
        const inputField = document.querySelector('.inpi');
        inputField.value += text;
        updateSuggestions();
      }).catch(err => {
        console.error('Failed to read clipboard contents:', err);
      });
    });
  
    toggleKeys('lowercase');
  });