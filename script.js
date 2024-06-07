document.addEventListener('DOMContentLoaded', () => {   // Adds an event listener to the DOMContentLoaded event
                                                        // This event is fired when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
    const registrationForm = document.getElementById('registrationForm');
    const studentTableBody = document.querySelector('#studentTable tbody');
    let students = JSON.parse(localStorage.getItem('students')) || []; // this line will get students value from browser local storage and JSON.parse will parse/resolve that string into a JS array and returns it, incase there is no value an empty array will get assigned to students as written with ||('OR') Operator

    const renderStudents = () => {
        studentTableBody.innerHTML = ''; // Clears any existing content in the table body
        students.forEach((student, index) => { // Loops through each student in the students array
            const row = document.createElement('tr'); // Creates a new table row (<tr>) for each student

            Object.values(student).forEach(value => { // Iterates over the values of the student object
                const cell = document.createElement('td'); // Creates a table cell (<td>) for each value
                cell.textContent = value; // Populates the row with the student's data (e.g., name, ID, email, contact)
                row.appendChild(cell);
            });

            const actionsCell = document.createElement('td'); // Creates a new table cell to hold the action buttons (edit and delete)
            actionsCell.classList.add('actions');

            // Creates an "Edit" button and attaches an event listener to it
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editStudent(index));
            actionsCell.appendChild(editButton);

            // Creates a "Delete" button and attaches an event listener to it
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteStudent(index));
            actionsCell.appendChild(deleteButton);

            // Appends the actions cell (containing the edit and delete buttons) to the row, and then appends the row to the table body
            row.appendChild(actionsCell);
            studentTableBody.appendChild(row);
        });
    };

    const addStudent = (student) => {
        students.push(student); // Adds the new student object to the end of the students array
        localStorage.setItem('students', JSON.stringify(students)); // Converts the updated students array to a JSON string and stores it in the browser’s local storage under the key 'students'
        renderStudents(); // Updates the displayed list of students on the webpage
    };

    const editStudent = (index) => {
        const student = students[index]; // Retrieves the student object from the students array at the specified index
        // Sets the values of the form fields (studentName, studentID, emailID, contactNo) to the corresponding properties of the student object
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentID').value = student.id;
        document.getElementById('emailID').value = student.email;
        document.getElementById('contactNo').value = student.contact;
        registrationForm.dataset.index = index; // Adds a data-index attribute to the registrationForm element and sets its value to the index of the student being edited
    };

    const deleteStudent = (index) => {
        students.splice(index, 1); // This line removes one element from the students array at the specified index
        localStorage.setItem('students', JSON.stringify(students)); // This line updates the local storage to reflect the modified students array after the deletion
        renderStudents(); // Updates the displayed list of students on the webpage
    };

    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevents the form from being submitted in the traditional way

        // Retrieves the values from the form fields and trims any leading or trailing whitespace
        const name = document.getElementById('studentName').value.trim();
        const id = document.getElementById('studentID').value.trim();
        const email = document.getElementById('emailID').value.trim();
        const contact = document.getElementById('contactNo').value.trim();

        if (!name || !id || !email || !contact) { // Checks if any of the form fields are empty. Although I used required in HTML, added this to follow guidelines
            alert('All fields are required!'); // Alerts the user if any fields are missing
            return; // stops the submission process by returning early from the function
        }

        const newStudent = { name, id, email, contact }; // Creates an object representing the new student using the form values

        if (registrationForm.dataset.index) { // Checks if the registrationForm has a data-index attribute. If it does, this means the form is being used to edit an existing student
            students[registrationForm.dataset.index] = newStudent; // Updates the existing student in the students array at the specified index
            delete registrationForm.dataset.index; // Deletes the data-index attribute from the form
        } else { // If there is no data-index attribute, it means a new student is being added
            addStudent(newStudent); // Calls the addStudent(newStudent) function to add the new student to the students array
        }

        registrationForm.reset(); // Clears the form fields after the student is added or updated
        localStorage.setItem('students', JSON.stringify(students)); // Saves the updated students array to local storage
        renderStudents(); // Updates the displayed list of students on the webpage
    });

    renderStudents(); // Updates the displayed list of students on the webpage
});

// Input validation for student name (only alphabets)
function validateInputText(inputField) {
    var inputValue = inputField.value;
    var regex = /^[a-zA-Z\s]*$/; // Only allow letters and spaces
    if (!regex.test(inputValue)) {
        alert('Student Name can only contain alphabets.'); // // Display message on input of invalid character
        inputField.value = ''; // Make input field empty
    }
}