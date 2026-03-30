// Inputs
const billInput = document.getElementById("bill");
const peopleInput = document.getElementById("people");
const customTipInput = document.getElementById("custom-tip");

// Buttons & UI
const percentButtons = document.querySelectorAll(".bill-percentage");
const tipPerPersonEl = document.querySelector(".total-bill");
const totalPerPersonEl = document.querySelector(".perHeads");
const resetBtn = document.querySelector(".reset-btn");

// State
let selectedPercent = 0;

// HANDLE PERCENT BUTTONS
percentButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedPercent = parseFloat(btn.innerText) || 0;

    // UI active state
    percentButtons.forEach((b) => b.classList.remove("active"));
    customTipInput.classList.remove("active");
    btn.classList.add("active");

    calculate();
  });
});

// HANDLE CUSTOM TIP
customTipInput.addEventListener("input", () => {
  selectedPercent = parseFloat(customTipInput.value) || 0;

  percentButtons.forEach((b) => b.classList.remove("active"));
  customTipInput.classList.add("active");

  calculate();
});

// MAIN CALCULATION
function calculate() {
  const bill = parseFloat(billInput.value) || 0;
  const people = parseInt(peopleInput.value) || 0;

  if (bill <= 0 || people <= 0 || selectedPercent <= 0) {
    tipPerPersonEl.innerText = "---";
    totalPerPersonEl.innerText = "---";
    return;
  }

  const totalTip = bill * (selectedPercent / 100);
  const totalPerPerson = (bill + totalTip) / people;

  // Output
  tipPerPersonEl.innerText = totalTip.toFixed(2);
  totalPerPersonEl.innerText = totalPerPerson.toFixed(2);
}

// LIVE INPUT LISTENERS
billInput.addEventListener("input", calculate);
peopleInput.addEventListener("input", calculate);

// RESET FUNCTION
resetBtn.addEventListener("click", () => {
  billInput.value = "";
  peopleInput.value = "";
  customTipInput.value = "";
  selectedPercent = 0;

  tipPerPersonEl.innerText = "---";
  totalPerPersonEl.innerText = "---";

  percentButtons.forEach((b) => b.classList.remove("active"));
  customTipInput.classList.remove("active");
});
