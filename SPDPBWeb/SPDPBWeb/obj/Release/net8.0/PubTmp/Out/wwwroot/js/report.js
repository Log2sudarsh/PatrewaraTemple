document.addEventListener("DOMContentLoaded", function () {
    const filterMenuToggle = document.getElementById('filter-menu-toggle');
    const filterForm = document.getElementById('filter-form');
    const filterSection = document.getElementById('filter-section');
    const filterInputs = filterForm.querySelectorAll('input[type="text"]');
    const radioInputs = filterForm.querySelectorAll('input[type="radio"]');
    const cardsContainer = document.getElementById('cards-container');
    const clearFiltersBtn = document.getElementById('clearFilters');

    const totalDonorsElem = document.getElementById('totalDonors');
    const totalAmountPaidElem = document.getElementById('totalAmountPaid');
    const totalAmountPendingElem = document.getElementById('totalAmountPending');
    const totalAmountElem = document.getElementById('totalAmount');

    // Toggle filter form visibility
    filterMenuToggle.addEventListener('click', function () {
        filterForm.style.display = filterForm.style.display === 'none' ? 'block' : 'none';
        filterSection.style.display = filterSection.style.display === 'none' ? 'block' : 'none';
    });

    // Fetch and populate cards with data
    function loadData() {
        fetch('/api/donations/report')
            .then(response => response.json())
            .then(data => {
                populateCards(data);
                updateSummary(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Populate cards with data
    function populateCards(data) {
        cardsContainer.innerHTML = ''; // Clear existing data
        let i = 1;
        data.forEach(row => {
            const card = document.createElement('div');
            card.className = 'card col-md-6 ml-2 mr-2 bg-color-style';

            card.innerHTML = `
                <div class="card-body" style="line-height:28px;">
                    <h6 class="card-title">${i}. ${row.nameKn}</h6> 
                    <p class="card-text">  
                    ${row.nameEn}<br>
                        <strong>ಸ್ಥಳ:</strong> ${row.place}<br>
                        <strong>ಸಂಪರ್ಕ ಸಂಖ್ಯೆ:</strong> ${row.contactNo === 9999999999 ? '' : row.contactNo}<br>
                        <strong>ವಾಗ್ದಾನದ ಮೊತ್ತ:</strong> ${row.pledgeAmount === 0 ? '' : row.pledgeAmount}<br>
                        <strong>ದಾನಿಗಳ ವಿಧ:</strong> ${row.userType === 'F' ? 'Farmer' : 'Employee'}<br>
                        <strong>ದೇಣಿಗೆ ಮೊತ್ತ:</strong> ${row.donatedAmount}<br>
                        <strong>ರಶೀದಿ ಸಂಖ್ಯೆ:</strong> ${row.receiptNo}<br>
                        <strong>ಪಾವತಿ ಸ್ಥಿತಿ:</strong> ${row.paymentStatus === true ? 'Paid' : 'Pending'}<br>
                        <strong>ರಶೀದಿ ವಿಧ:</strong> ${row.receiptType}
                    </p>
                </div>
            `;
            cardsContainer.appendChild(card);
            i++;
        });
    }

    // Filter cards based on input values
    function filterCards() {
        const filters = Array.from(filterInputs).map(input => input.value.toLowerCase());
        const radioFilters = {
            userType: document.querySelector('input[name="userType"]:checked')?.value.toLowerCase(),
            paymentStatus: document.querySelector('input[name="paymentStatus"]:checked')?.value.toLowerCase(),
            receiptType: document.querySelector('input[name="receiptType"]:checked')?.value.toLowerCase(),
        };

        const filteredData = Array.from(cardsContainer.querySelectorAll('.card')).filter(card => {
            const cardText = card.innerText.toLowerCase();
            const matchesFilters = filters.every(filter => cardText.includes(filter));
            const matchesRadioFilters = Object.keys(radioFilters).every(key => {
                return !radioFilters[key] || cardText.includes(radioFilters[key]);
            });

            return matchesFilters && matchesRadioFilters;
        });

        filteredData.forEach(card => card.style.display = '');
        Array.from(cardsContainer.querySelectorAll('.card')).forEach(card => {
            if (!filteredData.includes(card)) card.style.display = 'none';
        });

        updateSummary(filteredData.map(card => card.dataset));
    }

    // Update summary based on filtered data
    function updateSummary(data) {
        const totalDonors = data.length;
        const totalAmountPaid = data.reduce((acc, item) => acc + (item.paymentStatus ? item.donatedAmount : 0), 0);
        const totalAmountPending = data.reduce((acc, item) => acc + (!item.paymentStatus ? item.donatedAmount : 0), 0);
        const totalAmount = data.reduce((acc, item) => acc + item.donatedAmount, 0);

        totalDonorsElem.textContent = totalDonors;
        totalAmountPaidElem.textContent = totalAmountPaid;
        totalAmountPendingElem.textContent = totalAmountPending;
        totalAmountElem.textContent = totalAmount;
    }

    // Clear filters
    clearFiltersBtn.addEventListener('click', function () {
        filterInputs.forEach(input => input.value = '');
        radioInputs.forEach(input => input.checked = false);
        filterCards();
    });

    // Filter cards when inputs change
    filterInputs.forEach(input => input.addEventListener('input', filterCards));
    radioInputs.forEach(input => input.addEventListener('change', filterCards));

    // Initial load
    loadData();
});
