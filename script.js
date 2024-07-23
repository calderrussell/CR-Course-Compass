let classes = [];
let currentClassId = null;

document.getElementById('classForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const className = document.getElementById('className').value;
    const classTeacher = document.getElementById('classTeacher').value;
    const classPeriod = document.getElementById('classPeriod').value;
    const classSubject = document.getElementById('classSubject').value;
    const classYear = document.getElementById('classYear').value;

    addClass(className, classTeacher, classPeriod, classSubject, classYear);
    document.getElementById('classForm').reset();
});

document.getElementById('assignmentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const assignmentName = document.getElementById('assignmentName').value;
    const assignmentDate = document.getElementById('assignmentDate').value;
    const assignmentType = document.getElementById('assignmentType').value;
    const assignmentDescription = document.getElementById('assignmentDescription').value;

    if (currentClassId !== null) {
        addAssignment(currentClassId, assignmentType, assignmentName, assignmentDate, assignmentDescription);
        document.getElementById('assignmentForm').reset();
        displayCalendar(currentClassId);
    } else {
        alert("Please select a class first.");
    }
});

document.getElementById('clearClassesButton').addEventListener('click', function() {
    localStorage.removeItem('classes');
    classes = [];
    document.getElementById('classList').innerHTML = '';
    document.getElementById('assignmentFormSection').style.display = 'none';
    document.getElementById('calendarSection').style.display = 'none';
});

function addClass(name, teacher, period, subject, year) {
    const newClass = {
        id: Date.now(),
        name: name,
        teacher: teacher,
        period: period,
        subject: subject,
        year: year,
        assignments: []
    };
    classes.push(newClass);
    saveClasses();
    displayClasses();
}

function addAssignment(classId, type, name, date, description) {
    const classObject = classes.find(c => c.id === classId);
    const newAssignment = {
        id: Date.now(),
        type: type,
        name: name,
        date: date,
        description: description
    };
    classObject.assignments.push(newAssignment);
    saveClasses();
}

function saveClasses() {
    localStorage.setItem('classes', JSON.stringify(classes));
}

function loadClasses() {
    const storedClasses = JSON.parse(localStorage.getItem('classes'));
    if (storedClasses) {
        classes = storedClasses;
    }
    displayClasses();
}

function displayClasses() {
    const classList = document.getElementById('classList');
    classList.innerHTML = '';
    classes.forEach(classObject => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${classObject.name} - ${classObject.teacher} <button onclick="deleteClass(${classObject.id})">Delete</button>`;
        listItem.addEventListener('click', () => {
            currentClassId = classObject.id;
            document.getElementById('assignmentFormSection').style.display = 'block';
            document.getElementById('calendarSection').style.display = 'block';
            displayCalendar(currentClassId);
        });
        classList.appendChild(listItem);
    });
}

function displayCalendar(classId) {
    const classObject = classes.find(c => c.id === classId);
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    classObject.assignments.forEach(assignment => {
        const assignmentDiv = document.createElement('div');
        assignmentDiv.className = 'assignment';
        assignmentDiv.innerHTML = `
            <strong>${assignment.name}</strong> (${assignment.type}) - ${assignment.date}
            <p>${assignment.description}</p>
            <button onclick="deleteAssignment(${classId}, ${assignment.id})">Delete</button>
        `;
        calendar.appendChild(assignmentDiv);
    });
}

function deleteClass(classId) {
    classes = classes.filter(c => c.id !== classId);
    saveClasses();
    displayClasses();
    document.getElementById('assignmentFormSection').style.display = 'none';
    document.getElementById('calendarSection').style.display = 'none';
}

function deleteAssignment(classId, assignmentId) {
    const classObject = classes.find(c => c.id === classId);
    classObject.assignments = classObject.assignments.filter(a => a.id !== assignmentId);
    saveClasses();
    displayCalendar(classId);
}

window.onload = loadClasses;
