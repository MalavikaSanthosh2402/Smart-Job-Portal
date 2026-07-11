import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toastEl) => {
    toastEl.addEventListener('mouseenter', Swal.stopTimer);
    toastEl.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export const toastSuccess = (title) => Toast.fire({ icon: 'success', title });
export const toastError = (title) => Toast.fire({ icon: 'error', title });
export const toastWarning = (title) => Toast.fire({ icon: 'warning', title });
export const toastInfo = (title) => Toast.fire({ icon: 'info', title });
