export const modalUtils = {
  openModal(modalId) {
    try {
      const modal = document.getElementById(modalId);
      if (!modal) {
        console.error(`Modal with ID ${modalId} not found`);
        return;
      }
      const modalInstance = new window.bootstrap.Modal(modal);
      modalInstance.show();
    } catch (error) {
      console.error(`Failed to open modal ${modalId}:`, error);
    }
  },

  closeModal(modalId) {
    try {
      const modal = document.getElementById(modalId);
      if (modal) {
        const modalInstance = window.bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
      // Clean up backdrop and modal-open class
      document.querySelector('.modal-backdrop')?.classList.remove('show');
      document.querySelector('.modal-backdrop')?.remove();
      document.body.classList.remove('modal-open');
    } catch (error) {
      console.error(`Failed to close modal ${modalId}:`, error);
    }
  },

  switchModal(fromModalId, toModalId) {
    try {
      this.closeModal(fromModalId);
      // Delay to ensure backdrop is cleared before opening new modal
      setTimeout(() => this.openModal(toModalId), 300);
    } catch (error) {
      console.error(`Failed to switch from modal ${fromModalId} to ${toModalId}:`, error);
    }
  },
};