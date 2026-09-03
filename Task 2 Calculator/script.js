const expressionEl = document.getElementById("expression");
const previewEl = document.getElementById("resultPreview");
const memoryValueEl = document.getElementById("memoryValue");
const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");

const standardPad = document.getElementById("standardPad");
const scientificPad = document.getElementById("scientificPad");
const businessPanel = document.getElementById("businessPanel");

let expression = "";
let memory = Number(localStorage.getItem("calculatorMemory")) || 0;
let history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];
let angleMode = "DEG";

memoryValueEl.textContent = formatNumber(memory);
renderHistory();

function updateDisplay() {
  expressionEl.textContent = expression || "0";
  const preview = safeCalculate(expression);
  previewEl.textContent = preview === null ? "0" : formatNumber(preview);
}

function formatNumber(value) {
  if (!isFinite(value)) return "Error";
  return Number(value.toFixed(10)).toLocaleString("en-US");
}

function appendValue(value) {
  if (value === "pi") value = "π";
  if (value === "e") value = "e";
  expression += value;
  updateDisplay();
}

function clearAll() {
  expression = "";
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculateFinal() {
  const result = safeCalculate(expression);
  if (result === null || !isFinite(result)) {
    previewEl.textContent = "Invalid Expression";
    return;
  }

  addHistory(expression, result);
  expression = String(Number(result.toFixed(10)));
  updateDisplay();
}

function safeCalculate(input) {
  if (!input) return 0;

  try {
    let exp = input
      .replaceAll("×", "*")
      .replaceAll("÷", "/")
      .replaceAll("π", "Math.PI")
      .replaceAll("e", "Math.E")
      .replaceAll("^", "**");

    exp = exp.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

    if (!/^[0-9+\-*/().%\sMathPIE*]+$/.test(exp)) return null;

    const result = Function('"use strict"; return (' + exp + ")")();
    return typeof result === "number" ? result : null;
  } catch {
    return null;
  }
}

function getCurrentValue() {
  const result = safeCalculate(expression);
  return result === null ? 0 : result;
}

function applyFunction(func) {
  const value = getCurrentValue();
  let result;

  switch (func) {
    case "sin": result = Math.sin(convertAngle(value)); break;
    case "cos": result = Math.cos(convertAngle(value)); break;
    case "tan": result = Math.tan(convertAngle(value)); break;
    case "asin": result = reverseAngle(Math.asin(value)); break;
    case "acos": result = reverseAngle(Math.acos(value)); break;
    case "atan": result = reverseAngle(Math.atan(value)); break;
    case "sqrt": result = Math.sqrt(value); break;
    case "cbrt": result = Math.cbrt(value); break;
    case "square": result = value ** 2; break;
    case "cube": result = value ** 3; break;
    case "factorial": result = factorial(value); break;
    case "log": result = Math.log10(value); break;
    case "ln": result = Math.log(value); break;
    case "exp": result = Math.exp(value); break;
    case "reciprocal": result = 1 / value; break;
    case "abs": result = Math.abs(value); break;
  }

  if (result === undefined || !isFinite(result)) {
    previewEl.textContent = "Math Error";
    return;
  }

  addHistory(`${func}(${expression || value})`, result);
  expression = String(Number(result.toFixed(10)));
  updateDisplay();
}

function convertAngle(value) {
  return angleMode === "DEG" ? value * Math.PI / 180 : value;
}

function reverseAngle(value) {
  return angleMode === "DEG" ? value * 180 / Math.PI : value;
}

function factorial(num) {
  if (num < 0 || !Number.isInteger(num)) return NaN;
  if (num > 170) return Infinity;
  let total = 1;
  for (let i = 2; i <= num; i++) total *= i;
  return total;
}

function addHistory(exp, result) {
  history.unshift({
    exp,
    result: formatNumber(result),
    time: new Date().toLocaleString()
  });

  history = history.slice(0, 30);
  localStorage.setItem("calculatorHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = '<p class="empty">No calculations yet.</p>';
    return;
  }

  historyList.innerHTML = history.map(item => `
    <div class="history-item">
      <small>${item.time}</small>
      <p>${item.exp}</p>
      <strong>= ${item.result}</strong>
    </div>
  `).join("");
}

function memoryAction(action) {
  const value = getCurrentValue();

  if (action === "memory-clear") memory = 0;
  if (action === "memory-recall") expression = String(memory);
  if (action === "memory-add") memory += value;
  if (action === "memory-subtract") memory -= value;

  localStorage.setItem("calculatorMemory", memory);
  memoryValueEl.textContent = formatNumber(memory);
  updateDisplay();
}

document.addEventListener("click", event => {
  const btn = event.target.closest("button");
  if (!btn) return;

  const value = btn.dataset.value;
  const action = btn.dataset.action;
  const func = btn.dataset.func;

  if (value) appendValue(value);
  if (func) applyFunction(func);

  if (action === "clear") clearAll();
  if (action === "delete") deleteLast();
  if (action === "calculate") calculateFinal();
  if (action === "copy") navigator.clipboard.writeText(previewEl.textContent);
  if (action && action.startsWith("memory")) memoryAction(action);
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const mode = tab.dataset.mode;

    scientificPad.classList.toggle("hidden", mode !== "scientific");
    document.querySelector(".angle-row").classList.toggle("hidden", mode !== "scientific");
    businessPanel.classList.toggle("hidden", mode !== "business");
  });
});

document.getElementById("degreeToggle").addEventListener("click", () => {
  angleMode = "DEG";
  document.getElementById("degreeToggle").classList.add("active");
  document.getElementById("radianToggle").classList.remove("active");
});

document.getElementById("radianToggle").addEventListener("click", () => {
  angleMode = "RAD";
  document.getElementById("radianToggle").classList.add("active");
  document.getElementById("degreeToggle").classList.remove("active");
});

document.getElementById("clearHistory").addEventListener("click", () => {
  history = [];
  localStorage.removeItem("calculatorHistory");
  renderHistory();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️ Light" : "🌙 Dark";
});

document.addEventListener("keydown", event => {
  const key = event.key;

  if ("0123456789+-*/().%".includes(key)) appendValue(key);
  if (key === "Enter") calculateFinal();
  if (key === "Backspace") deleteLast();
  if (key === "Escape") clearAll();
});

function currency(value) {
  if (!isFinite(value)) return "Invalid input";
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

document.getElementById("taxBtn").addEventListener("click", () => {
  const amount = Number(document.getElementById("taxAmount").value);
  const rate = Number(document.getElementById("taxRate").value);
  const tax = amount * rate / 100;
  document.getElementById("taxResult").textContent = `Tax: ${currency(tax)} | Total: ${currency(amount + tax)}`;
});

document.getElementById("discountBtn").addEventListener("click", () => {
  const price = Number(document.getElementById("discountPrice").value);
  const rate = Number(document.getElementById("discountRate").value);
  const discount = price * rate / 100;
  document.getElementById("discountResult").textContent = `Saved: ${currency(discount)} | Final: ${currency(price - discount)}`;
});

document.getElementById("profitBtn").addEventListener("click", () => {
  const cost = Number(document.getElementById("costPrice").value);
  const sell = Number(document.getElementById("sellingPrice").value);
  const profit = sell - cost;
  const margin = sell === 0 ? 0 : (profit / sell) * 100;
  document.getElementById("profitResult").textContent = `Profit: ${currency(profit)} | Margin: ${margin.toFixed(2)}%`;
});

document.getElementById("emiBtn").addEventListener("click", () => {
  const principal = Number(document.getElementById("loanAmount").value);
  const annualRate = Number(document.getElementById("interestRate").value);
  const months = Number(document.getElementById("loanMonths").value);
  const monthlyRate = annualRate / 12 / 100;

  let emi;
  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  document.getElementById("emiResult").textContent = `Monthly EMI: ${currency(emi)}`;
});

updateDisplay();
