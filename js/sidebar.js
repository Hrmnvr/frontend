// ============================================================
// ScholarX Shared Sidebar Component
// ============================================================
import { logout } from './auth.js';

const studentNav = [
  { icon: 'dashboard', label: 'Dashboard', href: 'student_dashboard.html' },
  { icon: 'description', label: 'Notes & Upload', href: 'study_mode_upload.html' },
  { icon: 'psychology', label: 'AI Tutor', href: 'ai_tutor.html', badge: 'New' },
  { icon: 'school', label: 'Classrooms', href: 'student_dashboard.html#classrooms' },
  { icon: 'assignment', label: 'Assignments', href: 'assignments.html' },
];

const teacherNav = [
  { icon: 'dashboard', label: 'Dashboard', href: 'teacher_dashboard.html' },
  { icon: 'groups', label: 'Classrooms', href: 'teacher_dashboard.html#classrooms' },
  { icon: 'auto_stories', label: 'Content Studio', href: 'content_studio.html', badge: 'New' },
  { icon: 'quiz', label: 'Assessment Builder', href: 'assessment_builder.html', badge: 'New' },
  { icon: 'assignment', label: 'Assignments', href: 'assignments.html' },
];

/**
 * Render the sidebar into the page
 * @param {'student'|'teacher'} role
 * @param {string} activePage - current page filename (e.g. 'student_dashboard.html')
 */
export function renderSidebar(role = 'student', activePage = '') {
  const navItems = role === 'teacher' ? teacherNav : studentNav;

  const navHTML = navItems.map(item => {
    const isActive = activePage === item.href;
    const activeClass = isActive
      ? 'bg-primary/10 text-primary dark:text-white font-medium'
      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white';
    const iconClass = isActive ? 'text-primary' : '';
    const badge = item.badge
      ? `<span class="ml-auto px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-primary to-purple-500 text-white rounded-full">${item.badge}</span>`
      : '';

    return `<a class="flex items-center gap-3 px-4 py-3 rounded-xl ${activeClass} transition-colors" href="${item.href}">
      <span class="material-icons-round ${iconClass}">${item.icon}</span> ${item.label} ${badge}
    </a>`;
  }).join('');

  const premiumCard = role === 'student' ? `
    <div class="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/20 to-purple-900/20 border border-primary/20">
      <div class="flex items-center gap-3 mb-2">
        <span class="material-icons-round text-primary">school</span>
        <span class="text-sm font-semibold dark:text-white">Scholar Premium</span>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Unlock unlimited AI summary requests.</p>
      <button onclick="window.location.href='index.html#pricing'" class="w-full py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-lg shadow-primary/25">Upgrade Plan</button>
    </div>` : '';

  const sidebarHTML = `
    <div class="h-20 flex items-center px-8">
      <a href="index.html" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">S</div>
        <span class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">ScholarX</span>
      </a>
    </div>
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto" role="navigation" aria-label="Main navigation">
      ${navHTML}
    </nav>
    <div class="p-4 border-t border-gray-200 dark:border-white/5">
      <a class="flex items-center gap-3 px-4 py-3 rounded-xl ${activePage === 'settings.html' ? 'bg-primary/10 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'} transition-colors" href="settings.html">
        <span class="material-icons-round ${activePage === 'settings.html' ? 'text-primary' : ''}">settings</span> Settings
      </a>
      <button id="sidebarLogoutBtn" class="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer w-full mt-1">
        <span class="material-icons-round">logout</span> Logout
      </button>
      ${premiumCard}
    </div>`;

  // Desktop sidebar
  const aside = document.querySelector('aside');
  if (aside) {
    aside.innerHTML = sidebarHTML;
  }

  // Create mobile sidebar
  createMobileSidebar(sidebarHTML);

  // Bind logout
  document.querySelectorAll('#sidebarLogoutBtn').forEach(btn => {
    btn.addEventListener('click', logout);
  });
}

/**
 * Create mobile sidebar with overlay
 */
function createMobileSidebar(sidebarHTML) {
  // Overlay
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  // Mobile sidebar
  let mobileSidebar = document.querySelector('.sidebar-mobile');
  if (!mobileSidebar) {
    mobileSidebar = document.createElement('aside');
    mobileSidebar.className = 'sidebar-mobile flex flex-col border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#0d0b1a]';
    document.body.appendChild(mobileSidebar);
  }
  mobileSidebar.innerHTML = sidebarHTML;

  // Bind logout on mobile too
  mobileSidebar.querySelectorAll('#sidebarLogoutBtn').forEach(btn => {
    btn.addEventListener('click', logout);
  });

  // Toggle function
  const toggleMobile = () => {
    overlay.classList.toggle('active');
    mobileSidebar.classList.toggle('active');
  };

  // Hamburger button
  const hamburger = document.querySelector('[data-sidebar-toggle]') ||
    document.querySelector('header button .material-icons-round');

  if (hamburger) {
    const btn = hamburger.closest('button');
    if (btn) {
      btn.setAttribute('aria-label', 'Toggle navigation menu');
      btn.setAttribute('data-sidebar-toggle', 'true');
      btn.addEventListener('click', toggleMobile);
    }
  }

  // Close on overlay click
  overlay.addEventListener('click', toggleMobile);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
      toggleMobile();
    }
  });
}

/**
 * Create profile dropdown on avatar click
 * @param {Object} user - { displayName, email }
 */
export function setupProfileDropdown(user) {
  const avatarContainer = document.querySelector('.flex.items-center.gap-3.pl-4.border-l');
  if (!avatarContainer) return;

  avatarContainer.style.position = 'relative';
  avatarContainer.style.cursor = 'pointer';

  let dropdown = null;

  avatarContainer.addEventListener('click', (e) => {
    e.stopPropagation();

    if (dropdown) {
      dropdown.remove();
      dropdown = null;
      return;
    }

    dropdown = document.createElement('div');
    dropdown.className = 'profile-dropdown';
    dropdown.innerHTML = `
      <div class="px-3 py-2 border-b border-white/5 mb-1">
        <p class="text-sm font-semibold text-white">${user.displayName || 'User'}</p>
        <p class="text-xs text-gray-400 truncate">${user.email || ''}</p>
      </div>
      <a href="settings.html">
        <span class="material-icons-round" style="font-size:18px">person</span> View Profile
      </a>
      <a href="settings.html">
        <span class="material-icons-round" style="font-size:18px">settings</span> Settings
      </a>
      <div class="border-t border-white/5 mt-1 pt-1">
        <button id="dropdownLogoutBtn">
          <span class="material-icons-round" style="font-size:18px;color:#ef4444">logout</span>
          <span style="color:#ef4444">Logout</span>
        </button>
      </div>
    `;

    avatarContainer.appendChild(dropdown);

    dropdown.querySelector('#dropdownLogoutBtn').addEventListener('click', logout);
  });

  document.addEventListener('click', () => {
    if (dropdown) {
      dropdown.remove();
      dropdown = null;
    }
  });
}
