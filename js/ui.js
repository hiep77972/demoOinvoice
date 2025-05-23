// UI interaction functionality
export function setupUI(invoiceManager, calculator) {
  // Add customer search functionality
  setupCustomerSearch();
  
  // Add product search functionality
  setupProductSearch();
  
  // Set up keyboard shortcuts
  setupKeyboardShortcuts();
  
  // Set up table row hover effect
  setupTableRowEffects();
  
  // Set up form field animations
  setupFormFieldEffects();
  
  // Customer search functionality
  function setupCustomerSearch() {
    const maSoThueInput = document.getElementById('ma-so-thue');
    const maSoThueSearchBtn = maSoThueInput.nextElementSibling;
    
    maSoThueSearchBtn.addEventListener('click', () => {
      // In a real application, this would search a database
      // For demo purposes, let's just add some sample data
      const sampleCustomers = [
        { mst: '0200259666', name: 'LƯU THỊ KIM THOA', address: 'Số 149 Nguyễn Hữu Tuệ, Phường Gia Viên, Quận Ngô Quyền, Thành phố Hải Phòng', phone: '0912345678', email: 'thoa@example.com' },
        { mst: '0100109106', name: 'CÔNG TY CỔ PHẦN DƯỢC PHẨM IMEXPHARM', address: 'Số 4 Hàn Thuyên, Phường Phạm Đình Hổ, Quận Hai Bà Trưng, Thành phố Hà Nội', phone: '0987654321', email: 'contact@imexpharm.com' }
      ];
      
      const mst = maSoThueInput.value.trim();
      const customer = sampleCustomers.find(c => c.mst === mst);
      
      if (customer) {
        document.getElementById('nguoi-mua').value = customer.name;
        document.getElementById('dia-chi').value = customer.address;
        document.getElementById('dien-thoai').value = customer.phone;
        document.getElementById('email').value = customer.email;
      } else {
        alert('Không tìm thấy khách hàng với mã số thuế này');
      }
    });
  }
  
  // Product search functionality
  function setupProductSearch() {
    // This is handled in the InvoiceManager class
  }
  
  // Keyboard shortcuts
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Alt + N to add a new row
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        invoiceManager.addRow();
      }
      
      // Alt + D to delete selected rows
      if (event.altKey && event.key === 'd') {
        event.preventDefault();
        invoiceManager.deleteSelectedRows();
      }
      
      // Ctrl + S to save (simulated)
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveInvoice();
      }
    });
  }
  
  // Save invoice (simulated)
  function saveInvoice() {
    alert('Hóa đơn đã được lưu. (Chức năng giả lập)');
  }
  
  // Table row effects
  function setupTableRowEffects() {
    // This will be applied to all rows in the table, including future ones
    document.addEventListener('mouseover', (event) => {
      const row = event.target.closest('tr');
      if (row && row.parentElement.tagName === 'TBODY') {
        row.classList.add('hover-highlight');
      }
    }, true);
    
    document.addEventListener('mouseout', (event) => {
      const row = event.target.closest('tr');
      if (row) {
        row.classList.remove('hover-highlight');
      }
    }, true);
    
    // Enable tab navigation between cells
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        const activeElement = document.activeElement;
        const cell = activeElement.closest('td');
        
        if (cell && cell.parentElement.tagName === 'TR') {
          // Get the current row
          const row = cell.parentElement;
          
          // If it's the last cell in the row and not pressing shift, move to the next row
          if (!event.shiftKey && 
              cell === row.lastElementChild && 
              row.nextElementSibling) {
            event.preventDefault();
            const nextRow = row.nextElementSibling;
            const firstInput = nextRow.querySelector('input, select');
            
            if (firstInput) {
              firstInput.focus();
            }
          }
        }
      }
    });
  }
  
  // Form field animations and effects
  function setupFormFieldEffects() {
    // Focus/blur effects for input fields
    const inputFields = document.querySelectorAll('input, select, textarea');
    
    inputFields.forEach(field => {
      // Add focus class to parent on focus
      field.addEventListener('focus', () => {
        field.parentElement.classList.add('input-focused');
      });
      
      // Remove focus class on blur
      field.addEventListener('blur', () => {
        field.parentElement.classList.remove('input-focused');
      });
    });
    
    // Animate number inputs when they change
    const numericInputs = document.querySelectorAll('input[type="number"], .numeric-cell');
    
    numericInputs.forEach(input => {
      let prevValue = input.value;
      
      input.addEventListener('input', () => {
        const newValue = parseFloat(input.value) || 0;
        const oldValue = parseFloat(prevValue) || 0;
        
        if (newValue > oldValue) {
          input.classList.add('value-increased');
        } else if (newValue < oldValue) {
          input.classList.add('value-decreased');
        }
        
        prevValue = input.value;
        
        // Remove animation class after animation completes
        setTimeout(() => {
          input.classList.remove('value-increased', 'value-decreased');
        }, 1000);
      });
    });
  }
  
  // Handle the close button
  const closeButton = document.querySelector('.btn-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      if (confirm('Bạn có chắc muốn đóng trang này không?')) {
        // In a real application, this would close the page
        // For demo, show a message
        alert('Trang đã được đóng (chức năng giả lập)');
      }
    });
  }
  
  // Handle the "Phát hành" (Publish) button
  const publishButton = document.querySelector('.btn-primary[title="Phát hành"]');
  if (publishButton) {
    publishButton.addEventListener('click', () => {
      // Validate form before publishing
      const validationModule = require('./validation.js');
      const isValid = validationModule.validateForm();
      
      if (isValid) {
        // In a real application, this would publish the invoice
        // For demo, show a message
        alert('Hóa đơn đã được phát hành (chức năng giả lập)');
      }
    });
  }
}