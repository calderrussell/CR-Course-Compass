document.getElementById('classForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const className = document.getElementById('className').value;
    const classTeacher = document.getElementById('classTeacher').value;
    addClass(className, classTeacher);
    document.getElementById('className').value = '';
    document.getElementById('classTeacher').value = '';
});

function addClass(name, teacher) {
    const list = document.getElementById('classList');
    const entry = document.createElement('li');
    entry.textContent = name + ' - ' + teacher;
    list.appendChild(entry);
}
