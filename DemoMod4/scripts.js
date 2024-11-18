document.getElementById('gradeForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get input values
    const studentName = document.getElementById('studentName').value;
    const subject = document.getElementById('subject').value;
    const grade = document.getElementById('grade').value;

    // Create a new list item
    const listItem = document.createElement('li');
    listItem.textContent = `${studentName} - ${subject}: ${grade}`;

    // Append the list item to the grades list
    const gradesList = document.getElementById('gradesList');
    gradesList.appendChild(listItem);

    // Save to Local Storage
    const grades = JSON.parse(localStorage.getItem('grades')) || []; // Get existing grades or initialize as empty array
    grades.push({ studentName, subject, grade }); // Add new grade
    localStorage.setItem('grades', JSON.stringify(grades)); // Save back to Local Storage

    // Reset the form
    this.reset();
});

// Load existing grades from Local Storage on page load
document.addEventListener('DOMContentLoaded', function () {
    const grades = JSON.parse(localStorage.getItem('grades')) || []; // Get existing grades or initialize as empty array
    const gradesList = document.getElementById('gradesList');

    // Populate the grades list
    grades.forEach(grade => {
        const listItem = document.createElement('li');
        listItem.textContent = `${grade.studentName} - ${grade.subject}: ${grade.grade}`;
        gradesList.appendChild(listItem);
    });
});
document.addEventListener('DOMContentLoaded', async function () {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const gradesList = document.getElementById('gradesList');

    // Display grades in the list
    if (grades.length === 0) {
        gradesList.innerHTML = "<li>No grades available</li>";
    } else {
        grades.forEach((grade, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${grade.studentName} - ${grade.subject}: ${grade.grade}</span>
                <div>
                    <button class="edit-btn" data-index="${index}">Edit</button>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            gradesList.appendChild(listItem);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteFromAPI); // Update function to new handler
        });

        // Send grades to API
        for (const grade of grades) {
            try {
                const response = await fetch('http://localhost:3000/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'Student Name': grade.studentName,
                        'Subject': grade.subject,
                        'Grade': grade.grade,
                    }),
                });

                if (!response.ok) {
                    console.error(`Failed to send data: ${response.statusText}`);
                } else {
                    const result = await response.json();
                    console.log(`Data sent successfully:`, result);
                }
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }
    }

    // Edit handler
    function handleEdit(event) {
        const index = event.target.dataset.index;
        const grade = grades[index];

        const newStudentName = prompt("Enter new Student Name:", grade.studentName);
        const newSubject = prompt("Enter new Subject:", grade.subject);
        const newGrade = prompt("Enter new Grade:", grade.grade);

        if (newStudentName && newSubject && newGrade) {
            grades[index] = {
                studentName: newStudentName,
                subject: newSubject,
                grade: newGrade,
            };
            localStorage.setItem('grades', JSON.stringify(grades));
            location.reload();
        }
    }

    // Delete handler with API integration
    function handleDeleteFromAPI(event) {
        const index = event.target.dataset.index;

        if (confirm("Are you sure you want to delete this entry?")) {
            const deletedGrade = grades[index]; // Simpan data yang akan dihapus
            grades.splice(index, 1); // Hapus dari Local Storage
            localStorage.setItem('grades', JSON.stringify(grades)); // Perbarui Local Storage

            // Kirim permintaan DELETE ke API
            fetch(`http://localhost:3000/products/${deletedGrade.id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete data: ${response.statusText}`);
                }
                console.log(`Data with ID ${deletedGrade.id} deleted successfully from API.`);
            })
            .catch(error => {
                console.error(`Error: ${error.message}`);
            });

            location.reload(); // Refresh halaman untuk memperbarui daftar
        }
    }
});