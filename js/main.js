// Main application entry point
import { InvoiceManager } from './invoice.js';
import { setupCalculator } from './calculator.js';
import { setupValidation } from './validation.js';
import { setupUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize invoice manager
  const invoiceManager = new InvoiceManager();
  
  // Initialize the calculator
  const calculator = setupCalculator(invoiceManager);
  
  // Initialize form validation
  setupValidation();
  
  // Initialize UI interactions
  setupUI(invoiceManager, calculator);
  
  // Add some default rows to the invoice table
  invoiceManager.addEmptyRows(3);
  
  // Set the current date in the date field
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  document.getElementById('ngay-hd').value = `${day}/${month}/${year}`;
  
  // Add event listeners for the main buttons
  document.getElementById('add-row').addEventListener('click', () => {
    invoiceManager.addRow();
  });
  
  document.getElementById('delete-row').addEventListener('click', () => {
    invoiceManager.deleteSelectedRows();
  });
  
  // Calendar button event
  document.getElementById('calendar-btn').addEventListener('click', (event) => {
    event.preventDefault();
    // In a real application, show a date picker
    alert('Chức năng chọn lịch sẽ hiển thị ở đây');
  });
  
  // Setup event listeners for radio buttons
  const radioButtons = document.querySelectorAll('input[name="chiet-khau"]');
  radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
      calculator.updateDiscount();
    });
  });

  // Add event listener for auto-generated invoice number checkbox
  document.getElementById('tu-dong-sinh').addEventListener('change', (event) => {
    const soHDInput = document.getElementById('so-hd');
    if (event.target.checked) {
      soHDInput.value = generateInvoiceNumber();
      soHDInput.setAttribute('readonly', true);
    } else {
      soHDInput.removeAttribute('readonly');
    }
  });
  
  // Focus the first input field
  document.getElementById('ten-don-vi').focus();
});

// Function to generate a random invoice number
function generateInvoiceNumber() {
  const prefix = 'INV';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}