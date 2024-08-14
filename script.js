let classes = [];
let currentClassId = null;
let calendar = null; // Initialize calendar as null

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
    if (calendar) {
        calendar.destroy();
        calendar = null;
    }
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
            initializeCalendar(); // Ensure the calendar is initialized here
            displayCalendar(currentClassId); // Call displayCalendar after initializing
        });
        classList.appendChild(listItem);
    });
}

function initializeCalendar() {
    if (calendar) {
        calendar.destroy();
    }
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        editable: true,
        eventClick: function(info) {
            if (confirm('Are you sure you want to delete this assignment?')) {
                deleteAssignment(currentClassId, info.event.id);
            }
        }
    });
    calendar.render();
}

function displayCalendar(classId) {
    const classObject = classes.find(c => c.id === classId);
    if (calendar) {
        calendar.removeAllEvents();
        classObject.assignments.forEach(assignment => {
            calendar.addEvent({
                id: assignment.id.toString(),
                title: `${assignment.name} (${assignment.type})`,
                start: assignment.date,
                description: assignment.description
            });
        });
    } else {
        console.error("Calendar is not initialized.");
    }
}

function deleteClass(classId) {
    classes = classes.filter(c => c.id !== classId);
    saveClasses();
    displayClasses();
    document.getElementById('assignmentFormSection').style.display = 'none';
    document.getElementById('calendarSection').style.display = 'none';
    if (calendar) {
        calendar.destroy();
        calendar = null;
    }
}

function deleteAssignment(classId, assignmentId) {
    const classObject = classes.find(c => c.id === classId);
    classObject.assignments = classObject.assignments.filter(a => a.id !== parseInt(assignmentId));
    saveClasses();
    displayCalendar(classId);
}

window.onload = loadClasses;
