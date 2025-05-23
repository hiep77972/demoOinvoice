// Home page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize date inputs with current date range
  initializeDateRange();
  
  // Setup search functionality
  setupSearch();
  
  // Setup table functionality
  setupTable();
});

function initializeDateRange() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  document.getElementById('tu-ngay').value = formatDate(firstDay);
  document.getElementById('den-ngay').value = formatDate(lastDay);
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function setupSearch() {
  const searchBtn = document.getElementById('search-btn');
  
  searchBtn.addEventListener('click', () => {
    const searchParams = {
      mst: document.getElementById('mst').value,
      donViMua: document.getElementById('don-vi-mua').value,
      trangThai: document.getElementById('trang-thai').value,
      tuNgay: document.getElementById('tu-ngay').value,
      denNgay: document.getElementById('den-ngay').value
    };
    
    // In a real application, this would make an API call
    console.log('Searching with params:', searchParams);
    searchInvoices(searchParams);
  });
}

function searchInvoices(params) {
  // Simulate API call with sample data
  const sampleData = [
    {
      ngayHD: '21/05/2025',
      soHD: '00000034',
      trangThai: 'Đã phát hành',
      mst: '',
      donViMua: "MEN'S GINSENG ALL",
      hangHoa: "MEN'S GINSENG ALL",
      tongChuaVAT: 145048000,
      tienVAT: 0,
      tongThanhToan: 145048000,
      ttCQT: 'Kiểm tra hợp lệ',
      maCQT: 'M2-25-HN',
      httt: 'TM/CK',
      thayThe: '',
      diaChi: '',
      kyHieu: 'C25MKT',
      maTC: 'r1l3j67zg'
    },
    // Add more sample data here
  ];
  
  updateTable(sampleData);
}

function updateTable(data) {
  const tbody = document.querySelector('#invoice-table tbody');
  tbody.innerHTML = '';
  
  data.forEach(invoice => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox"></td>
      <td>${invoice.ngayHD}</td>
      <td>${invoice.soHD}</td>
      <td>${invoice.trangThai}</td>
      <td>${invoice.mst}</td>
      <td>${invoice.donViMua}</td>
      <td>${invoice.hangHoa}</td>
      <td class="numeric">${formatCurrency(invoice.tongChuaVAT)}</td>
      <td class="numeric">${formatCurrency(invoice.tienVAT)}</td>
      <td class="numeric">${formatCurrency(invoice.tongThanhToan)}</td>
      <td>${invoice.ttCQT}</td>
      <td>${invoice.maCQT}</td>
      <td>${invoice.httt}</td>
      <td>${invoice.thayThe}</td>
      <td>${invoice.diaChi}</td>
      <td>${invoice.kyHieu}</td>
      <td>${invoice.maTC}</td>
    `;
    tbody.appendChild(row);
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function setupTable() {
  const table = document.getElementById('invoice-table');
  
  // Setup sorting
  table.querySelectorAll('th').forEach(th => {
    th.addEventListener('click', () => {
      const index = Array.from(th.parentElement.children).indexOf(th);
      sortTable(table, index);
    });
  });
  
  // Setup row selection
  table.querySelector('tbody').addEventListener('click', event => {
    const row = event.target.closest('tr');
    if (row) {
      row.classList.toggle('selected');
    }
  });
}

function sortTable(table, column) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  rows.sort((a, b) => {
    const aValue = a.children[column].textContent;
    const bValue = b.children[column].textContent;
    return aValue.localeCompare(bValue);
  });
  
  tbody.innerHTML = '';
  rows.forEach(row => tbody.appendChild(row));
}