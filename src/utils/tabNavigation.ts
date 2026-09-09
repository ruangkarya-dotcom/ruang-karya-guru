/**
 * Tab Navigation Helper for Ruang Karya Guru
 * Ensures dedicated multi-tab workflow between:
 * 1. Ruang Karya Guru / Akun Guru Portal (Tab Name: 'rkg_public_portal')
 * 2. Administrator Executive Portal (Tab Name: 'rkg_admin_portal')
 */

export const PUBLIC_TAB_NAME = 'rkg_public_portal';
export const ADMIN_TAB_NAME = 'rkg_admin_portal';

/**
 * Initializes the current window name based on active route/role
 */
export function initializeTabName(isAdmin: boolean = false) {
  if (typeof window === 'undefined') return;
  if (!window.name || window.name === '') {
    window.name = isAdmin ? ADMIN_TAB_NAME : PUBLIC_TAB_NAME;
  }
}

/**
 * Open or switch focus directly to the Admin Portal in a dedicated browser tab
 */
export function switchToAdminPortal(path: string = '/admin/login'): Window | null {
  if (typeof window === 'undefined') return null;

  // Ensure current window is registered as the public tab
  if (!window.name || window.name === '') {
    window.name = PUBLIC_TAB_NAME;
  }

  try {
    const adminWindow = window.open(path, ADMIN_TAB_NAME);
    if (adminWindow) {
      adminWindow.focus();
      return adminWindow;
    }
  } catch (err) {
    console.warn('[TabNav] Gagal membuka tab admin:', err);
  }
  return null;
}

/**
 * Switch focus back to the Ruang Karya Guru / Akun Guru Portal in its dedicated browser tab
 * Triggers window.opener.focus() without closing the Admin tab.
 * @param path Target public path (default: '/')
 * @param closeCurrentAdminTab If true, attempts to close this admin tab
 */
export function switchToPublicPortal(path: string = '/', closeCurrentAdminTab: boolean = false): Window | null {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Prioritize focusing parent/opener window (Tab Utama Ruang Karya Guru) if still active
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.focus();
        if (closeCurrentAdminTab) {
          window.close();
          return window.opener;
        }
        return window.opener;
      } catch (err) {
        console.warn('[TabNav] Opener focus error:', err);
      }
    }

    // 2. Open or switch to existing public tab by name without closing current admin tab
    const publicWindow = window.open(path, PUBLIC_TAB_NAME);
    if (publicWindow) {
      publicWindow.focus();
      if (closeCurrentAdminTab) {
        try {
          window.close();
        } catch (_) {}
      }
      return publicWindow;
    }
  } catch (err) {
    console.warn('[TabNav] Gagal beralih ke tab akun guru:', err);
  }
  return null;
}

/**
 * Quick helper to bring focus to the Guru Tab via window.opener.focus()
 */
export function focusGuruPortal(path: string = '/'): Window | null {
  return switchToPublicPortal(path, false);
}

