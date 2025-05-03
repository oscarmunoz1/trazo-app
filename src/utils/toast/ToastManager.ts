import { UseToastOptions } from '@chakra-ui/react';

/**
 * Toast Manager
 * Handles toast messages consistently and prevents duplicates
 */

// Store recently shown toasts to prevent duplicates
interface ToastRecord {
  id: string;
  timestamp: number;
}

class ToastManager {
  private static instance: ToastManager;
  private recentToasts: ToastRecord[] = [];
  private toastFn: ((options: UseToastOptions) => any) | null = null;
  private dedupeTimeMs = 5000; // Default deduplication window

  // Make constructor private for singleton
  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  /**
   * Initialize with toast function from Chakra
   * @param toastFn - Chakra toast function
   * @param dedupeTimeMs - Time window for deduplication
   */
  public init(toastFn: (options: UseToastOptions) => any, dedupeTimeMs = 5000): void {
    this.toastFn = toastFn;
    this.dedupeTimeMs = dedupeTimeMs;
    this.cleanupOldToasts();
  }

  /**
   * Show a toast notification with deduplication
   * @param options - Chakra toast options
   * @returns toast id or undefined if duplicate or no toast function
   */
  public showToast(options: UseToastOptions): string | undefined {
    if (!this.toastFn) {
      console.error('ToastManager not initialized with toast function');
      return undefined;
    }

    // Generate a unique key for this toast
    const toastKey = this.generateToastKey(options);

    // Check if this toast was recently shown
    if (this.isDuplicate(toastKey)) {
      console.debug('Preventing duplicate toast:', options.title);
      return undefined;
    }

    // Show the toast
    const id = this.toastFn(options);

    // Record this toast
    this.recentToasts.push({
      id: toastKey,
      timestamp: Date.now()
    });

    return id;
  }

  /**
   * Show a success toast
   * @param title - Toast title
   * @param description - Toast description
   * @param duration - Duration in milliseconds
   */
  public success(title: string, description: string, duration = 5000): string | undefined {
    return this.showToast({
      title,
      description,
      status: 'success',
      duration,
      isClosable: true
    });
  }

  /**
   * Show an error toast
   * @param title - Toast title
   * @param description - Toast description
   * @param duration - Duration in milliseconds
   */
  public error(title: string, description: string, duration = 5000): string | undefined {
    return this.showToast({
      title,
      description,
      status: 'error',
      duration,
      isClosable: true
    });
  }

  /**
   * Show a warning toast
   * @param title - Toast title
   * @param description - Toast description
   * @param duration - Duration in milliseconds
   */
  public warning(title: string, description: string, duration = 5000): string | undefined {
    return this.showToast({
      title,
      description,
      status: 'warning',
      duration,
      isClosable: true
    });
  }

  /**
   * Show an info toast
   * @param title - Toast title
   * @param description - Toast description
   * @param duration - Duration in milliseconds
   */
  public info(title: string, description: string, duration = 5000): string | undefined {
    return this.showToast({
      title,
      description,
      status: 'info',
      duration,
      isClosable: true
    });
  }

  /**
   * Clean up old toast records
   */
  private cleanupOldToasts(): void {
    const now = Date.now();
    this.recentToasts = this.recentToasts.filter(
      (toast) => now - toast.timestamp < this.dedupeTimeMs
    );

    // Set up periodic cleanup
    setTimeout(() => this.cleanupOldToasts(), this.dedupeTimeMs / 2);
  }

  /**
   * Check if a toast is a duplicate
   * @param toastKey - Unique key for the toast
   */
  private isDuplicate(toastKey: string): boolean {
    return this.recentToasts.some((toast) => toast.id === toastKey);
  }

  /**
   * Generate a unique key for a toast based on its content
   * @param options - Toast options
   */
  private generateToastKey(options: UseToastOptions): string {
    // Create a key based on title, status and description
    return `${options.status || 'default'}-${options.title}-${options.description || ''}`;
  }
}

// Export singleton instance
export const toastManager = ToastManager.getInstance();
export default toastManager;
