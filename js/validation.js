// ============================================================
// ScholarX Shared Validation & UI Utilities
// ============================================================

/**
 * Validate email format
 * @param {string} email
 * @returns {string|null} error message or null
 */
export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return 'Please enter a valid email address';
  return null;
}

/**
 * Validate password
 * @param {string} password
 * @returns {string|null} error message or null
 */
export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

/**
 * Validate required field
 * @param {string} value
 * @param {string} fieldName
 * @returns {string|null}
 */
export function validateRequired(value, fieldName) {
  if (!value || !value.toString().trim()) return `${fieldName} is required`;
  return null;
}

/**
 * Show inline error below an input
 * @param {HTMLElement} inputEl
 * @param {string} message
 */
export function showFieldError(inputEl, message) {
  clearFieldError(inputEl);
  inputEl.classList.add('input-error');

  const errorEl = document.createElement('div');
  errorEl.className = 'field-error';
  errorEl.innerHTML = `<span class="material-icons" style="font-size:14px">error_outline</span> ${escapeHtml(message)}`;

  const parent = inputEl.closest('.group') || inputEl.closest('.space-y-1\\.5') || inputEl.parentElement;
  parent.appendChild(errorEl);
}

/**
 * Clear field error
 * @param {HTMLElement} inputEl
 */
export function clearFieldError(inputEl) {
  inputEl.classList.remove('input-error');
  const parent = inputEl.closest('.group') || inputEl.closest('.space-y-1\\.5') || inputEl.parentElement;
  const existing = parent.querySelector('.field-error');
  if (existing) existing.remove();
}

/**
 * Set button loading state
 * @param {HTMLButtonElement} btn
 * @param {boolean} loading
 * @param {string} [loadingText]
 */
export function setButtonLoading(btn, loading, loadingText) {
  if (loading) {
    btn._originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.classList.add('loading');
    btn.innerHTML = `<span class="spinner"></span> ${loadingText || 'Loading...'}`;
  } else {
    btn.disabled = false;
    btn.classList.remove('loading');
    if (btn._originalHTML) {
      btn.innerHTML = btn._originalHTML;
    }
  }
}

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 * @param {number} duration - ms
 */
export function showToast(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const icons = {
    success: 'check_circle',
    error: 'error_outline',
    info: 'info',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="material-icons" style="font-size:18px">${icons[type] || icons.info}</span> ${escapeHtml(message)}`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toast-out 0.3s ease-in forwards';
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

/**
 * Setup real-time validation on a form
 * @param {HTMLFormElement} form
 * @param {Object} rules - { fieldId: validatorFn }
 */
export function setupRealTimeValidation(form, rules) {
  Object.entries(rules).forEach(([fieldId, validator]) => {
    const input = form.querySelector(`#${fieldId}`);
    if (!input) return;

    input.addEventListener('blur', () => {
      const error = validator(input.value);
      if (error) {
        showFieldError(input, error);
      } else {
        clearFieldError(input);
      }
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('input-error')) {
        const error = validator(input.value);
        if (!error) clearFieldError(input);
      }
    });
  });
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
