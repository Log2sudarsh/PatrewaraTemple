document.addEventListener('DOMContentLoaded', function () {
    fetchAndRenderDonations();

    // Function to fetch and render donations
    function fetchAndRenderDonations() {
        fetch('/api/donations')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('donationsTable').getElementsByTagName('tbody')[0];
                tableBody.innerHTML = ''; 

                data.forEach(user => {
                    if (user.donations.length > 0) {
                        const firstDonation = user.donations[0];
                        const row = tableBody.insertRow();
                        row.innerHTML = `
                        <td>${user.userId}</td>
                        <td><a href="#" class="donation-link" data-user-id="${user.userId}">${user.nameEn}</a></td>
                        <td>${user.nameKn}</td>
                        <td>${user.place}</td>
                        <td>${user.contactNo}</td>
                        <td>${user.pledgeAmount}</td>
                        <td>
                            <button class="btn btn-primary btn-sm edit-button" data-user-id="${user.userId}">Edit</button>
                        </td>`;
                    }
                });

                // Add event listener for donation links
                document.querySelectorAll('.donation-link').forEach(link => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                        const userId = this.getAttribute('data-user-id');
                        const user = data.find(user => user.userId == userId);

                        // Set user details in the modal
                        document.getElementById('modalNameKn').textContent = user.nameKn;
                        document.getElementById('modalPlace').textContent = user.place;
                        document.getElementById('modalContactNo').textContent = user.contactNo;
                        document.getElementById('modalPledgeAmount').textContent = user.pledgeAmount;

                        // Populate donation details in the modal
                        const detailedTableBody = document.getElementById('detailedDonationsTable').getElementsByTagName('tbody')[0];
                        detailedTableBody.innerHTML = ''; // Clear previous details

                        var i = 1;
                        user.donations.forEach(donation => {
                            const row = detailedTableBody.insertRow();
                            row.innerHTML = `
                                <td>ಕಂತು ${i}</td>
                                <td>${donation.donatedAmount}</td>
                                <td>${donation.receiptNo}</td>
                                <td>${new Date(donation.payDate).toLocaleDateString()}</td>
                                <td>${donation.payMode}</td>
                                <td>${donation.transactionNo}</td>`;
                            i++;
                        });

                        $('#donationsModal').modal('show');
                    });
                });

                // Add event listener for edit buttons
                document.querySelectorAll('.edit-button').forEach(button => {
                    button.addEventListener('click', function () {
                        const userId = this.getAttribute('data-user-id');
                        const user = data.find(user => user.userId == userId);

                        // Populate the edit form with user details
                        document.getElementById('editUserId').value = user.userId;
                        document.getElementById('editUserNameEn').value = user.nameEn;
                        document.getElementById('editUserNameKn').value = user.nameKn;
                        document.getElementById('editUserPlace').value = user.place;
                        document.getElementById('editUserContactNo').value = user.contactNo;
                        document.getElementById('editUserPledgeAmount').value = user.pledgeAmount;
                        document.getElementById('editUserId').value = user.userId;

                        $('#editUserModal').modal('show');
                    });
                });
            })
            .catch(error => console.error('Error fetching donations:', error));
    }

    // Save edited user details
    document.getElementById('saveEditUser').addEventListener('click', function () {
        const userId = document.getElementById('editUserId').value;
        const updatedUser = {
            userId: userId,
            nameEn: document.getElementById('editUserNameEn').value,
            nameKn: document.getElementById('editUserNameKn').value,
            place: document.getElementById('editUserPlace').value,
            contactNo: document.getElementById('editUserContactNo').value,
            pledgeAmount: document.getElementById('editUserPledgeAmount').value,
            createdBy: 'Admin',
            createdOn: new Date(),   
            modifiedBy: 'Admin',
            modifiedOn: new Date(),
            userType: document.getElementById('editUserType').value,
            donations: []
        };

        console.log(JSON.stringify(updatedUser));

        fetch(`/api/donations/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
            .then(response => response.json())
            .then(updatedUser => {
                // Hide the modal
                $('#editUserModal').modal('hide');

                // Reload the table data
                fetchAndRenderDonations();
            })
            .catch(error => console.error('Error updating user:', error));
    });



});

function searchTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toLowerCase();
    table = document.getElementById("donationsTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}