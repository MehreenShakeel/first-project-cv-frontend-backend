// $(document).ready(function() {
//     $('#userForm').submit(function(event) {
//       event.preventDefault();
  
//       const formData = {
//         name: $('#name').val(),
//         address: $('#address').val(),
//         email: $('#email').val()
//       };
  
//       $.ajax({
//         type: 'POST',
//         url: '/submit',
//         data: formData,
//         dataType: 'json',
//         success: function(response) {
//           $('#message').text(response.message);
//           $('#userForm')[0].reset();
//         },
//         error: function(error) {
//           $('#message').text('Error: ' + error.responseJSON.error);
//         }
//       });
//     });
//   });
  