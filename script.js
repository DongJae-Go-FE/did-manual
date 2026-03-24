// Custom Full Page Scroll with Enhanced Features
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('#section-nav li');
  const progressBar = createProgressBar();
  const totalSections = sections.length;

  let currentSection = 0;
  let isScrolling = false;
  let touchStartY = 0;

  // DOM Elements
  const currentSectionEl = document.getElementById('current-section');
  const totalSectionsEl = document.getElementById('total-sections');
  const mobileCurrentEl = document.getElementById('mobile-current');
  const searchBtn = document.getElementById('search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchClose = document.getElementById('search-close');
  const searchResults = document.getElementById('search-results');
  const themeToggle = document.getElementById('theme-toggle');
  const goTopBtn = document.getElementById('go-top');
  const goBottomBtn = document.getElementById('go-bottom');
  const mobilePrev = document.getElementById('mobile-prev');
  const mobileNext = document.getElementById('mobile-next');
  const youtubeInput = document.getElementById('youtube-id-input');
  const youtubePreviewBtn = document.getElementById('youtube-preview-btn');
  const youtubePreviewContainer = document.getElementById('youtube-preview-container');

  // Initialize
  init();

  function init() {
    // Set total sections
    if (totalSectionsEl) totalSectionsEl.textContent = totalSections;

    // Set initial state
    sections[0].classList.add('active');
    updateNav(0);
    updateSectionIndicator(0);

    // Load saved theme
    loadTheme();

    // Prevent default scroll
    document.body.style.overflow = 'hidden';

    // Event listeners - Navigation
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeydown);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Navigation click
    navItems.forEach((item, index) => {
      item.addEventListener('click', () => goToSection(index));
    });

    // Top/Bottom buttons
    if (goTopBtn) goTopBtn.addEventListener('click', () => goToSection(0));
    if (goBottomBtn) goBottomBtn.addEventListener('click', () => goToSection(totalSections - 1));

    // Mobile navigation
    if (mobilePrev) mobilePrev.addEventListener('click', prevSection);
    if (mobileNext) mobileNext.addEventListener('click', nextSection);

    // Search functionality
    if (searchBtn) searchBtn.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);
    if (searchInput) searchInput.addEventListener('input', handleSearch);
    if (searchModal) {
      searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeSearch();
      });
    }

    // Theme toggle
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);


    // YouTube preview
    if (youtubePreviewBtn) youtubePreviewBtn.addEventListener('click', showYoutubePreview);
    if (youtubeInput) {
      youtubeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') showYoutubePreview();
      });
    }

    // Escape key to close modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
        closeSearch();
      }
    });

    console.log('📚 Notion 매뉴얼 페이지 로드 완료');
    console.log('⌨️ 키보드: ↑↓ 이동, Home/End 처음/끝, Ctrl+K 검색');
  }

  // ==================== Navigation ====================

  function handleWheel(e) {
    e.preventDefault();
    if (isScrolling) return;

    if (e.deltaY > 0) {
      nextSection();
    } else {
      prevSection();
    }
  }

  function handleKeydown(e) {
    // Ctrl+K or Cmd+K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
      return;
    }

    if (isScrolling) return;

    switch(e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        nextSection();
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prevSection();
        break;
      case 'Home':
        e.preventDefault();
        goToSection(0);
        break;
      case 'End':
        e.preventDefault();
        goToSection(totalSections - 1);
        break;
    }
  }

  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (isScrolling) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSection();
      } else {
        prevSection();
      }
    }
  }

  function nextSection() {
    if (currentSection < totalSections - 1) {
      goToSection(currentSection + 1);
    }
  }

  function prevSection() {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  }

  function goToSection(index) {
    if (index === currentSection || isScrolling) return;
    if (index < 0 || index >= totalSections) return;

    isScrolling = true;

    // Remove active from current
    sections[currentSection].classList.remove('active');

    // Update current
    currentSection = index;

    // Scroll to section
    sections[currentSection].scrollIntoView({ behavior: 'smooth' });

    // Add active to new section
    setTimeout(() => {
      sections[currentSection].classList.add('active');
      triggerAnimations(sections[currentSection]);
    }, 100);

    // Update navigation and indicators
    updateNav(currentSection);
    updateSectionIndicator(currentSection);

    // Reset scrolling flag
    setTimeout(() => {
      isScrolling = false;
    }, 700);
  }

  function updateNav(index) {
    // Update nav dots
    navItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update progress bar (0% at first section, 100% at last)
    const progress = (index / (totalSections - 1)) * 100;
    progressBar.style.width = progress + '%';
  }

  function updateSectionIndicator(index) {
    const sectionNum = index + 1;
    if (currentSectionEl) currentSectionEl.textContent = sectionNum;
    if (mobileCurrentEl) mobileCurrentEl.textContent = sectionNum;
  }

  function triggerAnimations(section) {
    const animatedElements = section.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .fade-in-up');
    animatedElements.forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // Trigger reflow
      el.style.animation = null;
    });
  }

  function createProgressBar() {
    const bar = document.createElement('div');
    bar.id = 'progress-bar';
    bar.style.cssText = `
      position: fixed;
      top: 60px;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #2563eb, #10b981);
      width: 0%;
      z-index: 1000;
      transition: width 0.3s ease;
    `;
    document.body.appendChild(bar);
    return bar;
  }

  // ==================== Search ====================

  function openSearch() {
    if (searchModal) {
      searchModal.classList.add('active');
      if (searchInput) {
        searchInput.focus();
        searchInput.value = '';
      }
      if (searchResults) searchResults.innerHTML = '';
    }
  }

  function closeSearch() {
    if (searchModal) {
      searchModal.classList.remove('active');
    }
  }

  function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
      searchResults.innerHTML = '';
      return;
    }

    const results = [];

    sections.forEach((section, index) => {
      const title = section.getAttribute('data-title') || '';
      const text = section.textContent.toLowerCase();

      if (text.includes(query) || title.toLowerCase().includes(query)) {
        // Find matching text snippet
        const fullText = section.textContent;
        const matchIndex = text.indexOf(query);
        let snippet = '';

        if (matchIndex !== -1) {
          const start = Math.max(0, matchIndex - 30);
          const end = Math.min(fullText.length, matchIndex + query.length + 50);
          snippet = (start > 0 ? '...' : '') +
                    fullText.substring(start, end).trim() +
                    (end < fullText.length ? '...' : '');
        }

        results.push({
          index,
          title: title || `섹션 ${index + 1}`,
          snippet: snippet
        });
      }
    });

    renderSearchResults(results, query);
  }

  function renderSearchResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-result-item">
          <p style="text-align: center; color: var(--gray-400);">검색 결과가 없습니다</p>
        </div>
      `;
      return;
    }

    searchResults.innerHTML = results.map(result => {
      const highlightedSnippet = result.snippet.replace(
        new RegExp(query, 'gi'),
        match => `<span class="search-highlight">${match}</span>`
      );

      return `
        <div class="search-result-item" data-section="${result.index}">
          <h4>${result.title}</h4>
          <p>${highlightedSnippet}</p>
        </div>
      `;
    }).join('');

    // Add click handlers to results
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const sectionIndex = parseInt(item.getAttribute('data-section'));
        closeSearch();
        goToSection(sectionIndex);
      });
    });
  }

  // ==================== Theme ====================

  function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');

    // Update icon
    const icon = themeToggle.querySelector('i');
    if (icon) {
      icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Save preference
    localStorage.setItem('manual-theme', isLight ? 'light' : 'dark');
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem('manual-theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      const icon = themeToggle?.querySelector('i');
      if (icon) icon.className = 'fas fa-sun';
    }
  }


  // ==================== YouTube Preview ====================

  function showYoutubePreview() {
    const videoId = youtubeInput?.value.trim();

    if (!videoId) {
      if (youtubePreviewContainer) {
        youtubePreviewContainer.innerHTML = `
          <div class="preview-placeholder">
            <i class="fab fa-youtube"></i>
            <span>Video ID를 입력해주세요</span>
          </div>
        `;
      }
      return;
    }

    // Extract video ID if full URL was pasted
    const extractedId = extractYoutubeId(videoId);

    if (youtubePreviewContainer) {
      youtubePreviewContainer.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${extractedId}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      `;
    }

    // Update input with extracted ID
    if (youtubeInput && extractedId !== videoId) {
      youtubeInput.value = extractedId;
    }
  }

  function extractYoutubeId(input) {
    // Check if it's already just an ID (11 characters, alphanumeric with - and _)
    if (/^[\w-]{11}$/.test(input)) {
      return input;
    }

    // Try to extract from various URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // Return original input if no pattern matched
    return input;
  }
});
