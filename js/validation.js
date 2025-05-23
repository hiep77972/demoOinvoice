// Form validation functionality
export function setupValidation() {
  const requiredFields = [
    { id: 'ten-don-vi', name: 'Tên đơn vị' },
    { id: 'ngay-hd', name: 'Ngày hóa đơn' },
    { id: 'ma-so-thue', name: 'Mã số thuế' }
  ];
  
  const formElements = {
    tenDonVi: document.getElementById('ten-don-vi'),
    maSoThue: document.getElementById('ma-so-thue'),
    nguoiMua: document.getElementById('nguoi-mua'),
    diaChi: document.getElementById('dia-chi'),
    dienThoai: document.getElementById('dien-thoai'),
    email: document.getElementById('email'),
    ngayHD: document.getElementById('ngay-hd')
  };
  
  // Validate a specific field
  function validateField(field) {
    if (!field.element) return true;
    
    const value = field.element.value.trim();
    
    if (field.required && value === '') {
      showError(field.element, `${field.name} không được để trống`);
      return false;
    }
    
    if (field.type === 'email' && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(field.element, 'Email không hợp lệ');
        return false;
      }
    }
    
    if (field.type === 'phone' && value !== '') {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
        showError(field.element, 'Số điện thoại không hợp lệ');
        return false;
      }
    }
    
    if (field.type === 'taxcode' && value !== '') {
      const taxCodeRegex = /^[0-9]{10,13}$/;
      if (!taxCodeRegex.test(value.replace(/\s+/g, ''))) {
        showError(field.element, 'Mã số thuế không hợp lệ');
        return false;
      }
    }
    
    if (field.type === 'date' && value !== '') {
      const dateRegex = /^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/;
      if (!dateRegex.test(value)) {
        showError(field.element, 'Ngày không hợp lệ (dd/mm/yyyy)');
        return false;
      }
      
      const matches = value.match(dateRegex);
      const day = parseInt(matches[1], 10);
      const month = parseInt(matches[2], 10);
      const year = parseInt(matches[3], 10);
      
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        showError(field.element, 'Ngày không hợp lệ');
        return false;
      }
    }
    
    clearError(field.element);
    return true;
  }
  
  // Show error message
  function showError(element, message) {
    // Remove any existing error
    clearError(element);
    
    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    errorMessage.style.color = 'var(--error)';
    errorMessage.style.fontSize = '0.75rem';
    errorMessage.style.marginTop = '4px';
    
    // Add error styling to input
    element.style.borderColor = 'var(--error)';
    
    // Insert error message after the input element
    element.parentNode.appendChild(errorMessage);
  }
  
  // Clear error message
  function clearError(element) {
    const parent = element.parentNode;
    const errorMessage = parent.querySelector('.error-message');
    
    if (errorMessage) {
      parent.removeChild(errorMessage);
    }
    
    element.style.borderColor = '';
  }
  
  // Validate all fields in a form
  function validateForm(form) {
    let isValid = true;
    
    // Validate required fields
    for (const field of validationFields) {
      if (!validateField(field)) {
        isValid = false;
      }
    }
    
    return isValid;
  }
  
  // Set up validation fields with their rules
  const validationFields = [
    { 
      element: formElements.tenDonVi, 
      name: 'Tên đơn vị', 
      required: true 
    },
    { 
      element: formElements.maSoThue, 
      name: 'Mã số thuế', 
      required: true, 
      type: 'taxcode' 
    },
    { 
      element: formElements.nguoiMua, 
      name: 'Người mua', 
      required: false 
    },
    { 
      element: formElements.diaChi, 
      name: 'Địa chỉ', 
      required: false 
    },
    { 
      element: formElements.dienThoai, 
      name: 'Điện thoại', 
      required: false, 
      type: 'phone' 
    },
    { 
      element: formElements.email, 
      name: 'Email', 
      required: false, 
      type: 'email' 
    },
    { 
      element: formElements.ngayHD, 
      name: 'Ngày hóa đơn', 
      required: true, 
      type: 'date' 
    },
  ];
  
  // Add focus out event listeners to validate fields when user leaves them
  validationFields.forEach(field => {
    if (field.element) {
      field.element.addEventListener('blur', () => {
        validateField(field);
      });
      
      // Clear error on input
      field.element.addEventListener('input', () => {
        clearError(field.element);
      });
    }
  });
  
  // Add submit handler to action buttons
  document.querySelectorAll('.action-buttons .btn').forEach(button => {
    button.addEventListener('click', (event) => {
      // Only validate for certain actions
      if (button.textContent.includes('Phát hành') || 
          button.textContent.includes('Lưu HĐ')) {
        const isValid = validateForm();
        
        if (!isValid) {
          event.preventDefault();
          alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
        }
      }
    });
  });
  
  return {
    validateField,
    validateForm,
    showError,
    clearError
  };
}