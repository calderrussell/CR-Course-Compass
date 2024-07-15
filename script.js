document.getElementById('classForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const className = document.getElementById('className').value;
    const classTeacher = document.getElementById('classTeacher').value;
    const classPeriod = document.getElementById('classPeriod').value;
    const classSubject = document.getElementById('classSubject').value;
    const classYear = document.getElementById('classYear').value;

    if (className && classTeacher && classPeriod && classSubject && classYear) {
        addClass(className, classTeacher, classPeriod, classSubject, classYear);
        document.getElementById('className').value = '';
        document.getElementById('classTeacher').value = '';
        document.getElementById('classPeriod').value = '';
        document.getElementById('classSubject').value = '';
        document.getElementById('classYear').value = '';
    }
});

function addClass(name, teacher, period, subject, year) {
    const list = document.getElementById('classList');
    const entry = document.createElement('li');
    entry.innerHTML = `${name} - ${teacher} - ${period} - ${subject} - ${year} <button onclick="deleteClass(this)">Delete</button>`;
    list.appendChild(entry);
    saveClasses();
}

function saveClasses() {
    const classes = [];
    document.querySelectorAll('#classList li').forEach(item => {
        classes.push(item.innerHTML);
    });
    localStorage.setItem('classes', JSON.stringify(classes));
}

function loadClasses() {
    const classes = JSON.parse(localStorage.getItem('classes'));
    if (classes) {
        classes.forEach(html => {
            const list = document.getElementById('classList');
            const entry = document.createElement('li');
            entry.innerHTML = html;
            list.appendChild(entry);
        });
    }
}

function deleteClass(button) {
    const password = prompt("Enter the password to delete this class:");
    if (password === "SuGaRgLiDe26!") {
        const entry = button.parentElement;
        entry.remove();
        saveClasses();
    } else {
        alert("Incorrect password. Class not deleted.");
    }
}

function clearClasses() {
    localStorage.removeItem('classes'); // Clear local storage
    const list = document.getElementById('classList');
    while (list.firstChild) {
        list.removeChild(list.firstChild); // Remove all list items from the DOM
    }
}

document.getElementById('clearClassesButton').addEventListener('click', clearClasses);


window.onload = loadClasses;
