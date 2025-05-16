document.addEventListener("DOMContentLoaded", () => {
  const copyContractButton = document.getElementById("copy-contract-button");
  const contractAddressElement = document.getElementById("contract-address");

  if (copyContractButton && contractAddressElement) {
    copyContractButton.addEventListener("click", () => {
      const contractAddress = contractAddressElement.innerText;
      navigator.clipboard
        .writeText(contractAddress)
        .then(() => {
          const originalIcon = copyContractButton.innerHTML;
          copyContractButton.innerHTML = `
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                      `;
          setTimeout(() => {
            copyContractButton.innerHTML = originalIcon;
          }, 2000);
        })
        .catch((err) => {
          console.error("Không thể sao chép địa chỉ contract: ", err);
          alert("Không thể sao chép. Vui lòng thử lại hoặc sao chép thủ công.");
        });
    });
  }

  const tipsToggle = document.getElementById("tips-toggle");
  const tipsContent = document.getElementById("tips-content");
  const tipsIcon = tipsToggle ? tipsToggle.querySelector("svg") : null;

  if (tipsToggle && tipsContent && tipsIcon) {
    tipsToggle.addEventListener("click", () => {
      tipsContent.classList.toggle("hidden");
      tipsIcon.classList.toggle("rotate-180");
    });
  }

  const currentYearElement = document.getElementById("current-year");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  const buyFroggerButton = document.getElementById("buy-frogger-button");
  if (buyFroggerButton) {
    buyFroggerButton.addEventListener("click", () => {
      window.open("https://app.uniswap.org/", "_blank");
    });
  }
});
