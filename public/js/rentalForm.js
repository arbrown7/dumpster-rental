 document.addEventListener('DOMContentLoaded', () => {
  flatpickr('#deliveryDate', {
    minDate: new Date().fp_incr(1),
    disable: [
      date => {
        const day = date.getDay();
        return day !== 1 && day !== 4;
      }
    ],
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: 'Y-m-d',
    onChange: async (selectedDates, dateStr) => {
      const size = document.querySelector('input[name="size"]:checked')?.value;
      if (!size) return;

      const res = await fetch(`/availability?date=${dateStr}&size=${size}`);
      const { available } = await res.json();
      document.getElementById('submitBtn').disabled = !available;
      document.getElementById('schedule-warning').style.display = available ? 'none' : 'block';
      const delivery = new Date(dateStr);
      const pickup = new Date(dateStr);

      if (delivery.getDay() === 0) {
        pickup.setDate(pickup.getDate() + 3);
      } else if (delivery.getDay() === 3) {
        pickup.setDate(pickup.getDate() + 4);
      } else {
        pickup;
      }

      document.getElementById('pickupDate').value = pickup.toISOString().split('T')[0];
    }
  });

  document.querySelectorAll('input[name="size"]').forEach(radio => {
    radio.addEventListener('change', async () => {
      const date = document.getElementById('deliveryDate').value;
      const size = radio.value;
      if (!date) return;

      const res = await fetch(`/availability?date=${date}&size=${size}`);
      const { available } = await res.json();
      document.getElementById('submitBtn').disabled = !available;
      document.getElementById('schedule-warning').style.display = available ? 'none' : 'block';

      const delivery = new Date(date);
      const pickup = new Date(date);

      if (delivery.getDay() === 0) {
        pickup.setDate(pickup.getDate() + 3);
      } else if (delivery.getDay() === 3) {
        pickup.setDate(pickup.getDate() + 4);
      } else {
        pickup;
      }

      document.getElementById('pickupDate').value = pickup.toISOString().split('T')[0];
    });
  });

  document.getElementById('rentalSearch').addEventListener('input', function () {
      const term = this.value.toLowerCase();
      const rows = document.querySelectorAll('tr[data-name]');
      console.log('Search term:', term);
      console.log('Rows found:', rows.length);
      rows.forEach(row => {
          console.log('Row data-name:', row.dataset.name, 'data-address:', row.dataset.address);
          const name = row.dataset.name.toLowerCase();
          const address = row.dataset.address.toLowerCase();
          row.style.display = (name.includes(term) || address.includes(term)) ? '' : 'none';
      });
  });
});