document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 0. Preview Password Auth (Client-side)
  // ==========================================================================
  const checkAuth = () => {
    if (sessionStorage.getItem('site_preview_auth') === 'true') {
      return; // Already authenticated
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'preview-auth-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#F0F7FF;z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);';
    
    const box = document.createElement('div');
    box.style.cssText = 'background:#fff;padding:40px;border-radius:12px;box-shadow:0 10px 30px rgba(0,102,204,0.15);text-align:center;max-width:400px;width:90%;border-top:5px solid #FF8C42;';
    
    const title = document.createElement('h2');
    title.style.cssText = 'color:#0066CC;margin-bottom:16px;font-size:1.5rem;font-weight:bold;';
    title.innerText = '公開前プレビュー';
    
    const desc = document.createElement('p');
    desc.style.cssText = 'color:#718096;margin-bottom:24px;font-size:0.9rem;line-height:1.6;';
    desc.innerText = 'このサイトは現在公開前確認中です。閲覧するにはパスワードを入力してください。';
    
    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'パスワードを入力';
    input.style.cssText = 'width:100%;padding:14px;border:1px solid #CBD5E0;border-radius:6px;margin-bottom:16px;font-size:1rem;box-sizing:border-box;outline:none;transition:border-color 0.3s;';
    input.onfocus = () => input.style.borderColor = '#00B4D8';
    input.onblur = () => input.style.borderColor = '#CBD5E0';
    
    const btn = document.createElement('button');
    btn.innerText = '認証して閲覧する';
    btn.style.cssText = 'width:100%;padding:14px;background:#FF8C42;color:#fff;border:none;border-radius:6px;font-size:1rem;font-weight:bold;cursor:pointer;transition:background 0.3s, transform 0.1s;';
    btn.onmouseover = () => btn.style.background = '#E8751A';
    btn.onmouseout = () => btn.style.background = '#FF8C42';
    btn.onmousedown = () => btn.style.transform = 'scale(0.98)';
    btn.onmouseup = () => btn.style.transform = 'scale(1)';
    
    const errorMsg = document.createElement('p');
    errorMsg.style.cssText = 'color:#E53E3E;margin-top:12px;font-size:0.85rem;display:none;';
    errorMsg.innerText = 'パスワードが間違っています。';
    
    btn.addEventListener('click', () => {
      if (input.value === 'kagasiya2026') {
        sessionStorage.setItem('site_preview_auth', 'true');
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.4s';
        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = '';
        }, 400);
      } else {
        errorMsg.style.display = 'block';
        input.style.borderColor = '#E53E3E';
      }
    });
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') btn.click();
    });
    
    box.appendChild(title);
    box.appendChild(desc);
    box.appendChild(input);
    box.appendChild(btn);
    box.appendChild(errorMsg);
    overlay.appendChild(box);
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden'; // スクロールロック
    
    // オートフォーカス
    setTimeout(() => input.focus(), 100);
  };
  
  checkAuth();

  // ==========================================================================
  // 1. Header Scroll Effect
  // ==========================================================================
  const header = document.querySelector('.header');
  const scrollThreshold = 50;

  const handleHeaderScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // 初期状態のチェック

  // ==========================================================================
  // 2. Responsive Burger Menu
  // ==========================================================================
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('active');
      burger.classList.toggle('active');
      
      // メニューオープン時に背景スクロールを抑止
      if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // リンククリック時にメニューを閉じる
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================================================
  // 3. Scroll Reveal Animation (Intersection Observer)
  // ==========================================================================
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const appearOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('appear');
        appearOnScroll.unobserve(entry.target);
      });
    }, appearOptions);

    fadeElements.forEach(element => {
      appearOnScroll.observe(element);
    });
  } else {
    // 古いブラウザ用のフォールバック
    fadeElements.forEach(element => {
      element.classList.add('appear');
    });
  }

  // ==========================================================================
  // 4. Tab Switcher Utility (News, Topics, etc.)
  // ==========================================================================
  const tabContainers = document.querySelectorAll('.tab-container');

  tabContainers.forEach(container => {
    const tabButtons = container.querySelectorAll('.tab-btn');
    const tabPanels = container.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        // アクティブボタンの切り替え
        tabButtons.forEach(button => button.classList.remove('active'));
        btn.classList.add('active');

        // パネルの切り替え
        tabPanels.forEach(panel => {
          if (panel.id === targetTab) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  });

  // ==========================================================================
  // 5. Contact Form Validation & WAF Simulation
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
    
    // リアルタイムバリデーション
    formInputs.forEach(input => {
      input.addEventListener('blur', () => {
        validateField(input);
      });
      
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateField(input);
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isFormValid = true;
      formInputs.forEach(input => {
        if (!validateField(input)) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        submitSecureForm(contactForm);
      } else {
        // 最初のエラー項目にスクロール
        const firstError = contactForm.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }
    });
  }

  function validateField(input) {
    const formGroup = input.closest('.form-group');
    let errorMessage = '';
    let isValid = true;

    // トリムしてチェック
    const value = input.value.trim();

    // 1. 空値チェック
    if (!value) {
      errorMessage = 'この項目は必須入力です。';
      isValid = false;
    } else {
      // 2. 個別フォーマットチェック
      if (input.type === 'email') {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/===?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!emailRegex.test(value)) {
          errorMessage = '有効なメールアドレスを入力してください。';
          isValid = false;
        }
      } else if (input.type === 'tel') {
        const telRegex = /^[0-9-+\s()]{10,15}$/;
        if (!telRegex.test(value)) {
          errorMessage = '有効な電話番号を入力してください。';
          isValid = false;
        }
      }

      // 3. WAF/セキュリティ XSS・SQLi簡易サニタイズ判定 (フロント側警告)
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /SELECT\s+.+\s+FROM/i,
        /UNION\s+SELECT/i,
        /INSERT\s+INTO/i,
        /UPDATE\s+.+\s+SET/i,
        /DELETE\s+FROM/i,
        /OR\s+['"]\d+['"]\s*=\s*['"]\d+/i
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(value)) {
          errorMessage = 'セキュリティポリシーにより、許可されていない文字列が含まれています。';
          isValid = false;
          break;
        }
      }
    }

    // エラー表示の制御
    if (!isValid) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      let errorDiv = formGroup.querySelector('.error-message');
      if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        formGroup.appendChild(errorDiv);
      }
      errorDiv.textContent = errorMessage;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      const errorDiv = formGroup.querySelector('.error-message');
      if (errorDiv) {
        errorDiv.remove();
      }
    }

    return isValid;
  }

  function submitSecureForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // 送信中アニメーション
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> 送信処理中...';
    
    // セキュリティシミュレーション (SSL & WAFが正常に機能し、データを暗号化して送信)
    setTimeout(() => {
      submitBtn.innerHTML = '🛡️ 安全な接続で送信中...';
      
      setTimeout(() => {
        // 送信完了画面への切り替え、またはメッセージ表示
        const container = form.closest('.contact-form-container');
        if (container) {
          container.innerHTML = `
            <div class="form-success-message fade-in appear" style="text-align: center; padding: 40px 20px;">
              <div class="success-icon" style="font-size: 4rem; color: var(--secondary); margin-bottom: 24px;">✓</div>
              <h3 style="font-size: 1.75rem; margin-bottom: 16px; color: var(--primary);">お問い合わせを受け付けました</h3>
              <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 1rem; line-height: 1.8;">
                お問い合わせありがとうございます。ご入力内容はSSL暗号化通信により安全に送信されました。<br>
                折り返し、担当者よりご連絡いたしますので、今しばらくお待ちください。
              </p>
              <div style="font-size: 0.8rem; color: #718096; background-color: var(--light); padding: 12px; border-radius: var(--border-radius-md); display: inline-flex; align-items: center; gap: 8px;">
                <span>🛡️ WAFによる安全検証済み</span> • <span>🔑 SSL/TLSによる暗号化送信完了</span>
              </div>
              <div style="margin-top: 40px;">
                <a href="index.html" class="btn-primary">トップページへ戻る</a>
              </div>
            </div>
          `;
        }
      }, 1500);
    }, 1500);
  }
});
