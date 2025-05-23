// Calculator functionality
export function setupCalculator(invoiceManager) {
  // Get DOM elements
  const subtotalElement = document.getElementById('tong-cktm');
  const discountElement = document.getElementById('tong-chiet-khau');
  const totalBeforeTaxElement = document.getElementById('tong-tien-hang');
  const taxElement = document.getElementById('tong-thue-vat');
  const grandTotalElement = document.getElementById('tong-thanh-toan');
  const amountInWordsElement = document.getElementById('so-tien-chu');
  
  // Initialize discount percentage input
  const discountContainer = document.createElement('div');
  discountContainer.className = 'discount-input-container';
  discountContainer.style.display = 'none';
  discountContainer.innerHTML = `
    <div class="discount-input">
      <input type="number" name="discount-percent" placeholder="0" min="0" max="100"> %
    </div>
  `;
  
  document.querySelector('.summary-options').appendChild(discountContainer);
  
  // Initialize discount amount input
  const discountAmountContainer = document.createElement('div');
  discountAmountContainer.className = 'discount-amount-container';
  discountAmountContainer.style.display = 'none';
  discountAmountContainer.innerHTML = `
    <div class="discount-input">
      <input type="number" name="discount-amount" placeholder="0" min="0">
    </div>
  `;
  
  document.querySelector('.summary-options').appendChild(discountAmountContainer);
  
  // Listen for calculation events
  document.addEventListener('invoice:calculate', () => {
    calculateTotals();
  });
  
  // Calculate all totals
  function calculateTotals() {
    const subtotal = invoiceManager.getSubtotal();
    const discount = invoiceManager.getDiscount(subtotal);
    const totalBeforeTax = subtotal - discount;
    const tax = invoiceManager.getTax(subtotal);
    const grandTotal = totalBeforeTax + tax;
    
    // Update UI
    subtotalElement.value = formatCurrency(subtotal);
    discountElement.value = formatCurrency(discount);
    totalBeforeTaxElement.value = formatCurrency(totalBeforeTax);
    taxElement.value = formatCurrency(tax);
    grandTotalElement.value = formatCurrency(grandTotal);
    
    // Update amount in words
    amountInWordsElement.value = convertNumberToWords(grandTotal) + ' đồng';
  }
  
  // Update the discount based on the selected discount type
  function updateDiscount() {
    const discountPercentage = document.getElementById('chiet-khau-phan-tram').checked;
    const discountAmount = document.getElementById('chiet-khau-tien').checked;
    
    // Show/hide the appropriate discount input
    discountContainer.style.display = discountPercentage ? 'block' : 'none';
    discountAmountContainer.style.display = discountAmount ? 'block' : 'none';
    
    // Add event listeners for discount inputs
    const percentInput = document.querySelector('input[name="discount-percent"]');
    const amountInput = document.querySelector('input[name="discount-amount"]');
    
    if (percentInput) {
      percentInput.addEventListener('input', calculateTotals);
    }
    
    if (amountInput) {
      amountInput.addEventListener('input', calculateTotals);
    }
    
    // Calculate totals
    calculateTotals();
  }
  
  // Format currency
  function formatCurrency(value) {
    return new Intl.NumberFormat('vi-VN').format(value);
  }
  
  // Convert number to Vietnamese words
  function convertNumberToWords(number) {
    if (number === 0) return 'Không';
    
    const units = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const teens = ['', 'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu', 'mười bảy', 'mười tám', 'mười chín'];
    const tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
    
    function processTriplet(triplet) {
      let result = '';
      
      // Hundreds place
      if (Math.floor(triplet / 100) > 0) {
        result += units[Math.floor(triplet / 100)] + ' trăm ';
        triplet %= 100;
      }
      
      // Tens place
      if (triplet > 0) {
        if (triplet < 10) {
          result += units[triplet];
        } else if (triplet < 20) {
          result += teens[triplet - 10];
        } else {
          result += tens[Math.floor(triplet / 10)];
          if (triplet % 10 > 0) {
            result += ' ' + units[triplet % 10];
          }
        }
      }
      
      return result.trim();
    }
    
    // Round to nearest integer
    number = Math.round(number);
    
    const billion = Math.floor(number / 1000000000);
    const million = Math.floor((number % 1000000000) / 1000000);
    const thousand = Math.floor((number % 1000000) / 1000);
    const remainder = number % 1000;
    
    let result = '';
    
    if (billion > 0) {
      result += processTriplet(billion) + ' tỷ ';
    }
    
    if (million > 0) {
      result += processTriplet(million) + ' triệu ';
    }
    
    if (thousand > 0) {
      result += processTriplet(thousand) + ' nghìn ';
    }
    
    if (remainder > 0) {
      result += processTriplet(remainder);
    }
    
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
  
  // Calculate initial totals
  calculateTotals();
  
  // Return functions that can be used by other modules
  return {
    calculateTotals,
    updateDiscount,
    formatCurrency
  };
}