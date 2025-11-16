$(document).ready(function () {
    $('#donationForm').on('submit', function (e) {
        e.preventDefault();

        // Get the date input value and convert it to UTC
        const payDate = new Date($('#payDate').val());
        const utcPayDate = new Date(Date.UTC(payDate.getFullYear(), payDate.getMonth(), payDate.getDate()));

        const donation = {
            user_Id: $('#userId').val(),
            name_En: $('#nameEn').val(),
            name_Kn: $('#nameKn').val(),
            place: $('#place').val(),
            contact_No: $('#contactNo').val(),
            pledge_Amount: $('#pledgeAmount').val(),
            donated_Amount: $('#donatedAmount').val(),
            receipt_No: $('#receiptNo').val(),
            pay_Date: utcPayDate.toISOString(), // Send date as UTC ISO string
            pay_Mode: $('#payMode').val(),
            transaction_Ref_No: $('#transactionRefNo').val(),
            createdBy: 'Sudrashan',
            createdOn: utcPayDate.toISOString(), // Send date as UTC ISO string
        };
        console.log(JSON.stringify(donation));
        $.ajax({
            url: '/api/donations',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(donation),
            success: function (response) {
                alert('Donation added successfully');
                $('#donationForm')[0].reset();
            },
            error: function (error) {
                console.error('Error adding donation:', error);
                alert('Failed to add donation');
            }
        });
    });
});
