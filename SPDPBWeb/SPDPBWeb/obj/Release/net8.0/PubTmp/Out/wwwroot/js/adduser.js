$(document).ready(function () {
    $("#addUserForm").on("submit", function (event) {
        event.preventDefault();

        var user = {
            Name_Kn: $("#name_Kn").val(),
            Name_En: $("#name_En").val(),
            Place: $("#place").val(),
            Contact_No: $("#contact_No").val(),
            Pledge_Amount: $("#pledge_Amount").val(),
            created_By: 'Admin',
            created_On: Date.now,
            modified_By: 'Admin',
            modified_On: Date.now
        };

        $.ajax({
            url: '/api/donations/adduser', // API endpoint to handle the data insertion
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(user),
            success: function (response) {
                alert('User added successfully!');
                $("#addUserForm")[0].reset(); // Reset the form
            },
            error: function (xhr, status, error) {
                alert('Error: ' + xhr.responseText);
            }
        });
    });
});
