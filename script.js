document.getElementById('classForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const className = document.getElementById('className').value;
    const classTeacher = document.getElementById('classTeacher').value;
    if (className && classTeacher) {
        addClass(className, classTeacher);
        document.getElementById('className').value = '';
        document.getElementById('classTeacher').value = '';
    }
});

function addClass(name, teacher) {
    const list = document.getElementById('classList');
    const entry = document.createElement('li');
    entry.textContent = name + ' - ' + teacher;
    list.appendChild(entry);
    saveClasses();
}

function saveClasses() {
    const classes = [];
    document.querySelectorAll('#classList li').forEach(item => {
        classes.push(item.textContent);
    });
    localStorage.setItem('classes', JSON.stringify(classes));
}

function loadClasses() {
    const classes = JSON.parse(localStorage.getItem('classes'));
    if (classes) {
        classes.forEach(text => {
            const list = document.getElementById('classList');
            const entry = document.createElement('li');
            entry.textContent = text;
            list.appendChild(entry);
        });
    }
}

window.onload = loadClasses;
