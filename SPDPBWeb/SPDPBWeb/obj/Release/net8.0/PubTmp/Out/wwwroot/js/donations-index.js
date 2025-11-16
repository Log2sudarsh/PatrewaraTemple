let donationData = [];
document.addEventListener('DOMContentLoaded', function () {
    const loading = document.getElementById('loading');
    const tableBody = document.getElementById('donationsTable').getElementsByTagName('tbody')[0];
    const totalPaidElement = document.getElementById('totalPaid');
    const totalPendingElement = document.getElementById('totalPending');
    const totalAmountElement = document.getElementById('totalAmount');
    const generateReceiptBtn = document.getElementById('generateReceiptBtn');
    const sortIcon = document.getElementById('sortIcon');
    const sortIcon2 = document.getElementById('sortIcon2');

    let isAscending = true;
    //let donationData = [];

    const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-IN') : '-');

    function showLoading() { if (loading) loading.style.display = 'block'; }
    function hideLoading() { if (loading) loading.style.display = 'none'; }

    function calculateTotals(data) {
        let totalPaid = 0;
        let totalPending = 0;
        let totalAmount = 0;
        let totalPledge = 0;

        (data || []).forEach(user => {
            totalPledge += Number(user.pledgeAmount) || 0;
            (user.donations || []).forEach(donation => {
                const amt = Number(donation.donatedAmount) || 0;
                totalAmount += amt;
                if (donation.paymentStatus) totalPaid += amt;
                else totalPending += amt;
            });
        });

        updateTotalsUI({ totalPaid, totalPending, totalAmount, totalPledge });
    }

    function updateTotalsUI({ totalPaid, totalPending, totalAmount, totalPledge }) {
        if (totalPaidElement) totalPaidElement.textContent = fmt(totalPaid);
        if (totalPendingElement) totalPendingElement.textContent = fmt(totalPledge);
        if (totalAmountElement) totalAmountElement.textContent = fmt(totalPledge - totalPaid); // Show pending pledge
    }

    function createRow(user, index) {
        const donations = user.donations || [];
        const firstDonation = donations[0];
        const allPaid = donations.length > 0 && donations.every(d => !!d.paymentStatus);
        const anyPaid = donations.some(d => !!d.paymentStatus);

        const statusClass =
            donations.length === 0 ? 'background-color:#888;color:white;border-radius:300px;padding:5px;text-align:center;'
                : allPaid ? 'background-color:green;color:white;border-radius:300px;padding:5px;text-align:center;'
                    : anyPaid ? 'background-color:#ff9800;color:white;border-radius:300px;padding:5px;text-align:center;'
                        : 'background-color:red;color:white;border-radius:300px;padding:5px;text-align:center;';

        const noOfDonationStyle = 'width:35px; margin-left:3px;margin-top:4px; background-color:#1044c2;padding:1px;border-radius:5px;text-align:center;color:white; font-size:7pt;';
        const row = tableBody.insertRow();

        row.innerHTML = `
            <td>${index}</td>
            <td><a href="#" class="donation-link" data-user-id="${user.userId}">${user.nameKn}</a></td>
            <td>${user.pledgeAmount === 0 ? '' : fmt(user.pledgeAmount)}</td>
            <td>
                <a href="#" class="donation-link" style="${statusClass}" data-user-id="${user.userId}">
                    ${fmt(user.totalDonatedAmount)}
                </a>
                <div style="${noOfDonationStyle}">${donations.length} ಕಂತು</div>
            </td>
            <td style="display:none;">${user.nameEn}</td>
        `;
    }

    function renderTable(data) {
        tableBody.innerHTML = '';
        let i = 0;
        (data || []).forEach(user => {
            if (user.userId === 2404) return; // Skip user with userId 2 for Interest and other amount
            
            const hasOnlyPanchayatDonations = user.donations?.every(d => d.donationType === "PANCHAYAT");
            const isAggregatedPanchayat = user.nameEn === "PANCHAYAT_CONTRIBUTION" || user.userId === 9999;

            if (hasOnlyPanchayatDonations && !isAggregatedPanchayat) {
                return; // skip rendering individual Panchayat donors
            }

            i++;
            createRow(user, i);
        });

        calculateTotals(data);
        setupModalLinks();
    }

    function setupModalLinks() {
        document.querySelectorAll('.donation-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const userId = this.getAttribute('data-user-id');
                const user = donationData.find(u => String(u.userId) === String(userId));
                if (user) {
                    fillModal(user);
                    $('#donationsModal').modal('show');
                }
            });
        });
    }

    function fillModal(user) {
        document.getElementById('modalUserId').textContent = user.userId;
        document.getElementById('modalNameKn').textContent = user.nameKn;
        document.getElementById('modalPlace').textContent = user.place || '-';
        document.getElementById('modalPledgeAmount').textContent = user.pledgeAmount ? fmt(user.pledgeAmount) : '-';

        const detailedTable = document.getElementById('detailedDonationsTable');
        const detailedTableBody = detailedTable.getElementsByTagName('tbody')[0];
        const detailedTableHead = detailedTable.getElementsByTagName('thead')[0];
        detailedTableBody.innerHTML = '';
        detailedTableHead.innerHTML = '';

        let donations = user.donations || [];
        const isPanchayat =
            user.nameEn === "PANCHAYAT_CONTRIBUTION" ||
            user.nameKn === "ಗ್ರಾಮ ಪಂಚಾಯತ್ ಸದಸ್ಯರು" ||
            user.userId === 9999;

        // For Panchayat aggregate, show only PANCHAYAT donations
        if (isPanchayat) {
            donations = donations.filter(d => d.donationType?.toUpperCase() === "PANCHAYAT");
        }

        //  Build header row
        let headerRow = '<tr><th>ವಿವರಗಳು</th>';
        if (!isPanchayat) {
            donations.forEach((_, idx) => headerRow += `<th>ಕಂತು ${idx + 1}</th>`);
        } else {
            headerRow += '<th>ದಾತರ ಹೆಸರು</th><th>ರಶೀದಿ ಸಂಖ್ಯೆ</th><th>ದಿನಾಂಕ</th><th>ಮೊತ್ತ</th><th>ಪಾವತಿ ರೀತಿ</th>';
        }
        headerRow += '</tr>';
        detailedTableHead.innerHTML = headerRow;

        // Regular users
        if (!isPanchayat) {
            const rows = {
                amount: ['<tr><td>ದೇಣಿಗೆ ಮೊತ್ತ</td>'],
                receipt: ['<tr><td>ರಶೀದಿ ಸಂಖ್ಯೆ</td>'],
                date: ['<tr><td>ಪಾವತಿ ದಿನಾಂಕ</td>'],
                mode: ['<tr><td>ಪಾವತಿ ರೀತಿ</td>'],
                txn: ['<tr><td>ಹಳೆಯ/ಹೊಸ ರಸೀದಿ</td>'],
                status: ['<tr><td>ಪಾವತಿ ಸ್ಥಿತಿ</td>'],
                print: ['<tr><td>ರಶೀದಿ ಮುದ್ರಿಸು</td>'],
            };

            donations.forEach(d => {
                rows.amount.push(`<td>${fmt(Number(d.donatedAmount) || 0)}</td>`);
                rows.receipt.push(`<td>${d.receiptNo || '-'}</td>`);
                rows.date.push(`<td>${d.payDate ? new Date(d.payDate).toLocaleDateString() : '-'}</td>`);
                rows.mode.push(`<td>${d.payMode || '-'}</td>`);
                rows.txn.push(`<td>${d.receiptType?.toLowerCase() === 'o' ? 'Old Receipt' :
                        d.receiptType?.toLowerCase() === 'n' ? 'New Receipt' : '-'
                    }</td>`);
                rows.status.push(`<td>${d.paymentStatus ? 'Paid' : 'Pending'}</td>`);
                rows.print.push(`
                <td><button style="font-size:11px; background-color:green;color:white;"
                    class="print-receipt-btn"
                    data-user-id="${user.userId}"
                    data-donation-id="${d.receiptNo}">
                    Print <i class="fas fa-print" style="cursor:pointer;color:white;"></i>
                </button></td>
            `);
            });

            detailedTableBody.innerHTML =
                rows.amount.join('') + '</tr>' +
                rows.receipt.join('') + '</tr>' +
                rows.date.join('') + '</tr>' +
                rows.mode.join('') + '</tr>' +
                rows.txn.join('') + '</tr>' +
                rows.status.join('') + '</tr>' +
                rows.print.join('') + '</tr>';

            // Print buttons setup
            document.querySelectorAll('.print-receipt-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const userId = this.getAttribute('data-user-id');
                    const receiptNo = this.getAttribute('data-donation-id');
                    const u = donationData.find(x => String(x.userId) === String(userId));
                    const d = u?.donations?.find(x => String(x.receiptNo) === String(receiptNo));
                    if (u && d) generateReceiptForSingleDonation(u, d);
                });
            });

            // Show Generate All button
            if (generateReceiptBtn) {
                generateReceiptBtn.style.display = donations.length > 0 ? 'block' : 'none';
                generateReceiptBtn.onclick = () => generateReceipt(user);
            }
        }
        //  Panchayat Members Contributions
        else {
            let rowsHtml = '';
            donations.forEach(d => {
                rowsHtml += `
                <tr>
                    <td></td>
                    <td>${d.nameKn || '-'}</td>
                    <td>${d.receiptNo || '-'}</td>
                    <td>${d.payDate ? new Date(d.payDate).toLocaleDateString() : '-'}</td>
                    <td>${fmt(Number(d.donatedAmount) || 0)}</td>
                    <td>${d.payMode || '-'}</td>
                </tr>
            `;
            });
            detailedTableBody.innerHTML = rowsHtml;

            // Hide Generate All button for Panchayat
            if (generateReceiptBtn) generateReceiptBtn.style.display = 'none';
        }
    }


    function generateReceiptForSingleDonation(user, donation) {
        fillReceiptTemplate(user, donation);
        openReceiptInNewWindow();
    }

    function convertNumberToKannadaWords(amount) {
        const units = ["", "ಒಂದು", "ಎರಡು", "ಮೂರು", "ನಾಲ್ಕು", "ಐದು", "ಆರು", "ಏಳು", "ಎಂಟು", "ಒಂಬತ್ತು", "ಹತ್ತು",
            "ಹನ್ನೊಂದು", "ಹನ್ನೆರಡು", "ಹದಿಮೂರು", "ಹದಿನಾಲ್ಕು", "ಹದಿನೈದು", "ಹದಿನಾರು", "ಹದಿನೇಳು", "ಹದಿನೆಂಟು", "ಹತ್ತೊಂಬತ್ತು"];
        const tens = ["", "", "ಇಪ್ಪತ್ತು", "ಮುವತ್ತು", "ನಲವತ್ತು", "ಐವತ್ತು", "ಅರವತ್ತು", "ಎಪ್ಪತ್ತು", "ಎಂಬತ್ತು", "ತೊಂಬತ್ತು"];
        const scales = ["", "ಸಾವಿರ", "ಲಕ್ಷ", "ಕೋಟಿ", "ಬಿಲಿಯನ್"];

        function convertHundreds(num) {
            const hundred = Math.floor(num / 100);
            const remainder = num % 100;
            let result = "";
            if (hundred) result += units[hundred] + " ನೂರು ";
            if (remainder) {
                if (remainder < 20) result += units[remainder];
                else {
                    const ten = Math.floor(remainder / 10);
                    const unit = remainder % 10;
                    result += tens[ten] + " " + units[unit];
                }
            }
            return result.trim();
        }

        if (!amount) return "ಶೂನ್ಯ";
        let words = "", scaleIndex = 0, n = Math.floor(Math.abs(Number(amount) || 0));

        while (n > 0) {
            const part = n % 1000;
            if (part !== 0) {
                const scaleWord = scales[scaleIndex] ? " " + scales[scaleIndex] : "";
                words = convertHundreds(part) + scaleWord + " " + words;
            }
            n = Math.floor(n / 1000);
            scaleIndex++;
        }
        return words.trim();
    }

    function generateReceipt(user) {
        (user.donations || []).forEach(donation => {
            // Requires jsPDF to be included on the page
            const doc = new jsPDF();
            doc.setFont("helvetica");
            doc.setFontSize(12);

            doc.text("॥ ಶ್ರೀ ಪತ್ರೇಶ್ವರ ಪ್ರಸನ್ನ ॥", 105, 20, { align: "center" });
            doc.addImage("Images/Gavi_Logo.png", "PNG", 15, 25, 40, 40);
            doc.text("ಶ್ರೀ ಪತ್ರೇಶ್ವರ ದೇವಸ್ಥಾನದ ಸೇವಾ ಟ್ರಸ್ಟ್ (ರಿ), ಯರೇಹಂಚಿನಾಳ", 105, 50, { align: "center" });
            doc.text("Shree Patreshwar Devastana Seva Trust, Ⓡ, Yarehanchinal", 105, 60, { align: "center" });
            doc.text("ತಾ: ಕುಕನೂರು, ಜಿ: ಕೊಪ್ಪಳ", 105, 70, { align: "center" });
            doc.text("Receipt/ದೇಣಿಗೆ ರಸೀದಿ", 105, 80, { align: "center" });
            doc.addImage("Images/Patreswara-Icon.png", "PNG", 155, 25, 40, 40);

            doc.text(`Receipt No: ${donation.receiptNo}`, 15, 100);
            doc.text(`Date: ${donation.payDate ? new Date(donation.payDate).toLocaleDateString() : '-'}`, 155, 100);

            doc.text(`ಶ್ರೀ/ಶ್ರೀಮತಿ: ${user.nameKn}`, 15, 120);
            doc.text(`ಇವರಿಂದ ಶ್ರೀ ಪತ್ರೇಶ್ವರ ಹೊಸ ದೇವಸ್ಥನಾದ ನಿರ್ಮಾಣಕ್ಕೆ`, 15, 130);
            doc.text(`${convertNumberToKannadaWords(donation.donatedAmount)} ರೂಪಾಯಿಗಳನ್ನು ಕೃತಜ್ಞತೆಯಿಂದ ಸ್ವೀಕರಿಸಲಾಗಿದೆ.`, 15, 140);

            doc.text(`ರೂ: ${fmt(Number(donation.donatedAmount) || 0)}/-`, 105, 160, { align: "center" });

            doc.text("SHREE PATRESWARA DEVASTANA SEVA TRUST YAREHANCHINAL", 15, 180);
            doc.text("CANARA BANK (KUKANOOR BRANCH)", 15, 190);
            doc.text("A/C NO: 120025858210, IFSC CODE: CNRB0011810", 15, 200);
            doc.text("ಶ್ರೀ ಪತ್ತೇಶ್ವರ ದೇವಸ್ತಾನಕ್ಕೆ ಆನ್‌ಲೈನ್ ಮೂಲಕ ದೇಣಿಗೆ ಸಲ್ಲಿಸುವ ಭಕ್ತಾದಿಗಳು", 15, 210);
            doc.text("ಮೇಲಿನ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮಾ ಮಾಡಲು ವಿನಂತಿಸಲಾಗಿದೆ.", 15, 220);

            doc.text("ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಸಂಪರ್ಕಿಸಿ: 9741892360, 9591710959, 9590015540, 8660947202", 105, 240, { align: "center" });
            doc.text("Email: Log2ppss@gmail.com", 105, 250, { align: "center" });
            doc.text("ಧನ್ಯವಾದಗಳು", 105, 270, { align: "center" });

            doc.save(`Receipt_${donation.receiptNo}.pdf`);
        });
    }

    function fillReceiptTemplate(user, donation) {
        document.getElementById("receiptNo").textContent = donation.receiptNo || '-';
        document.getElementById("receiptDate").textContent = donation.payDate ? new Date(donation.payDate).toLocaleDateString() : '-';
        document.getElementById("donorName").textContent = user.nameKn || '-';
        document.getElementById("donationAmount").textContent = fmt(Number(donation.donatedAmount) || 0);
        document.getElementById("donationAmountInWords").textContent = convertNumberToKannadaWords(donation.donatedAmount);
        document.getElementById("donorAddress").textContent = user.place || '-';
    }

    function openReceiptInNewWindow() {
        const receiptHtml = document.getElementById("receiptTemplate").innerHTML;
        const newWindow = window.open("", "Receipt", "width=800,height=600");
        newWindow.document.write(receiptHtml);
        newWindow.document.close();
        newWindow.print();
    }

    function sortTableByAmount() {
        donationData.sort((a, b) => isAscending
            ? a.totalDonatedAmount - b.totalDonatedAmount
            : b.totalDonatedAmount - a.totalDonatedAmount
        );
        isAscending = !isAscending;
        sortIcon.textContent = isAscending ? '▲' : '▼';
        renderTable(donationData);
    }

    function fetchDataAndRenderTable() {
        showLoading();
        fetch('/api/donations')
            .then(r => r.json())
            .then(data => {
                donationData = Array.isArray(data) ? data : [];
                renderTable(donationData);
            })
            .catch(err => {
                console.error('Error fetching donations:', err);
                updateTotalsUI({ totalPaid: 0, totalPending: 0, totalAmount: 0 });
            })
            .finally(hideLoading);

        //sortIcon.addEventListener('click', sortTableByAmount);
        //sortIcon2.addEventListener('click', sortTableByPledge);

    }
    window.renderTable = renderTable;
    fetchDataAndRenderTable();
});

function searchTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toLowerCase();
    const table = document.getElementById("donationsTable");
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        const td = tr[i].getElementsByTagName("td");
        for (let j = 0; j < td.length; j++) {
            if (td[j]) {
                const txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}


function sortTableByPledge(columnIndex, order) {
    donationData.sort((a, b) => {
        return order === 'asc'
            ? a.pledgeAmount - b.pledgeAmount
            : b.pledgeAmount - a.pledgeAmount;
    });
    renderTable(donationData);
}

function sortTableByAmount(columnIndex, order) {
    donationData.sort((a, b) => {
        return order === 'asc'
            ? a.totalDonatedAmount - b.totalDonatedAmount
            : b.totalDonatedAmount - a.totalDonatedAmount;
    });
    renderTable(donationData);
}
