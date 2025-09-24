const apiBase = "/api/BilvaUser";

$(document).ready(function () {
    loadUsers();
    $('#userForm input, #userForm select').on('input change', validateForm);
    validateForm(); // Initial validation

    $('#saveBtn').click(function () {
        if (!validateForm()) return;

        const user = {
            firstName: $('#firstName').val().trim(),
            lastName: $('#lastName').val().trim(),
            gender: $('#gender').val(),
            contactNumber: $('#contactNumber').val().trim(),
            place: $('#place').val().trim(),
            address: $('#address').val().trim(),
            designation: $('#designation').val().trim(),
            institution: $('#institution').val().trim(),
            plantsNeeded: $('#plantsNeeded').val().trim(),
            variety: $('#variety').val() || "Any Variety",
            deliveryStatus: $('#deliveryStatus').val() || "Order Pending"
        };

        const id = $('#userId').val();
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiBase}/updateuser/${id}` : `${apiBase}/adduser`;

        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: JSON.stringify(user),
            success: function () {
                resetForm();
                loadUsers();
                $('#userModal').modal('hide');
            },
            error: function () {
                alert("Something went wrong. Please try again.");
            }
        });
    });
});

function validateForm() {
    let isValid = true;

    // First Name
    const firstName = $('#firstName');
    if (!firstName.val().trim()) {
        showError(firstName, "First Name is required.");
        isValid = false;
    } else {
        clearError(firstName);
    }

    // Place
    const place = $('#place');
    if (!place.val().trim()) {
        showError(place, "Place is required.");
        isValid = false;
    } else {
        clearError(place);
    }

    // Contact Number
    const contactNumber = $('#contactNumber');
    if (!/^\d{10}$/.test(contactNumber.val().trim())) {
        showError(contactNumber, "Valid 10-digit contact number is required.");
        isValid = false;
    } else {
        clearError(contactNumber);
    }

    // Plants Needed
    const plantsNeeded = $('#plantsNeeded');
    if (!plantsNeeded.val().trim() || isNaN(plantsNeeded.val().trim())) {
        showError(plantsNeeded, "Valid number of plants is required.");
        isValid = false;
    } else {
        clearError(plantsNeeded);
    }

    const gender = $('#gender');
    if (!gender.val()) {
        showError(gender, "Please select a gender.");
        isValid = false;
    } else {
        clearError(gender);
    }

    $('#saveBtn').prop('disabled', !isValid);
    return isValid;
}

function showError(element, message) {
    element.addClass('is-invalid');
    element.next('.invalid-feedback').text(message).show();
}

function clearError(element) {
    element.removeClass('is-invalid');
    element.next('.invalid-feedback').hide();
}


function loadUsers() {
    $.get(`${apiBase}/all`, function (data) {
        const tbody = $("#userTable tbody");
        tbody.empty();

        let totalPlants = 0;

        data.forEach((user, index) => {
            const name = `${user.firstName} ${user.lastName ?? ""}`;
            const rowId = `details-${index}`;

            const plantsNeeded = user.plantsNeeded || 0;
            totalPlants += parseInt(plantsNeeded);

           const row = `
              <tr>
                <td style="width: 40px;">${index + 1}</td>
                <td>${name}</td>
                <td>${user.place}</td>
                <td>${user.plantsNeeded}</td>
                <td class="text-center">
                  <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-sm btn-outline-info" onclick="toggleDetails('${rowId}')" title="Details">
                      <i class="bi bi-info-circle"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary" onclick='editUser(${JSON.stringify(user)})' title="Edit">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr id="${rowId}" class="details-row" style="display: none;">
                <td colspan="5">
                  <strong>Gender:</strong> ${user.gender || "-"}<br>
                  <strong>Contact:</strong> ${user.contactNumber || "-"}<br>
                  <strong>Address:</strong> ${user.address || "-"}<br>
                  <strong>Occupation :</strong> ${user.designation || "-"}<br>
                  <strong>Institution:</strong> ${user.institution || "-"}<br>
                  <strong>Variety:</strong> ${user.variety || "-"}<br>
                  <strong>Status:</strong> ${user.deliveryStatus || "-"}
                </td>
              </tr>
            `;
            tbody.append(row);
        });
        $("#totalPlants").text(`Total Grafts Needed: ${totalPlants}`);
    });
}

function toggleDetails(id) {
    $(`#${id}`).slideToggle();
}

function editUser(user) {
    $("#userId").val(user.userId);
    $("#firstName").val(user.firstName);
    $("#lastName").val(user.lastName);
    $("#gender").val(user.gender);
    $("#contactNumber").val(user.contactNumber);
    $("#place").val(user.place);
    $("#address").val(user.address);
    $("#designation").val(user.designation);
    $("#institution").val(user.institution);
    $("#plantsNeeded").val(user.plantsNeeded);
    $("#variety").val(user.variety || "Any Variety");
    $("#deliveryStatus").val(user.deliveryStatus || "Order Pending");

    $("#addUserModalLabel").text("Update User");
    $("#userModal").modal("show");
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        $.ajax({
            url: `${apiBase}/deleteuser/${id}`,
            type: 'DELETE',
            success: function () {
                loadUsers();
            }
        });
    }
}

function resetForm() {
    $('#formTitle').text('Add New User');
    $('#userId').val('');
    $('#userForm')[0].reset();
    $('#variety').val('Any Variety');
    $('#deliveryStatus').val('Order Pending');
}
