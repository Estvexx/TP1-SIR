// script.js

const toastIcon = (content) =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;

const icon = {
  success: toastIcon('<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>'),
  danger: toastIcon('<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>'),
  warning: toastIcon('<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5m0 3h.01"/>'),
  info: toastIcon('<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>'),
};

const showToast = (
  message = "Operação concluída.",
  toastType = "info",
  duration = 5000,
) => {
  if (!Object.keys(icon).includes(toastType)) toastType = "info";

  let box = document.createElement("div");
  box.classList.add("toast", `toast-${toastType}`);
  box.setAttribute("role", toastType === "danger" ? "alert" : "status");
  box.innerHTML = ` <div class="toast-content-wrapper">
                      <div class="toast-icon">
                      ${icon[toastType]}
                      </div>
                      <div class="toast-message"></div>
                      <div class="toast-progress"></div>
                      </div>`;
  box.querySelector(".toast-message").textContent = message;
  duration = duration || 5000;
  box.querySelector(".toast-progress").style.animationDuration =
    `${duration / 1000}s`;

  let toastAlready = document.body.querySelector(".toast");
  if (toastAlready) {
    toastAlready.remove();
  }

  document.body.appendChild(box);

  window.setTimeout(() => {
    if (box.isConnected) box.remove();
  }, duration);
};

let submit = document.querySelector(".custom-toast.success-toast");
let information = document.querySelector(".custom-toast.info-toast");
let failed = document.querySelector(".custom-toast.danger-toast");
let warn = document.querySelector(".custom-toast.warning-toast");

submit?.addEventListener("click", (e) => {
  e.preventDefault();
  showToast("Operação concluída com sucesso.", "success", 5000);
});

information?.addEventListener("click", (e) => {
  e.preventDefault();
  showToast("Consulta os dados antes de continuar.", "info", 5000);
});

failed?.addEventListener("click", (e) => {
  e.preventDefault();
  showToast("Não foi possível concluir a operação. Tenta novamente.", "danger", 5000);
});

warn?.addEventListener("click", (e) => {
  e.preventDefault();
  showToast("O servidor está indisponível. Tenta novamente mais tarde.", "warning", 5000);
});
