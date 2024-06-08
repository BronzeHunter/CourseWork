class Note {
    constructor(title, text, date_time, important, urgent, due_date, radio1, radio2, radio3, index) {
        this.title = title;
        this.text = text;
        this.date_time = date_time;
        this.important = important;
        this.urgent = urgent;
        this.due_date = due_date;
        this.radio1 = radio1;
        this.radio2 = radio2;
        this.radio3 = radio3;
        this.index = index;
    }

    render() {
        const noteContainer = document.getElementById("notes");

        const noteTemplate = (headerColor, headerText, dueDateDisplay, importantDisplay, urgentDisplay) => `
            <div class="noteCard" style="border-radius: 5px; margin: 7px; padding: 10px; background-color: white; border: none;">
                <h3 style="color: white; background-color: ${headerColor}; text-align: center; padding: 5px;">${headerText}</h3>
                <h2 style="margin: 5px 5px 0px; font-size: 28px; font-family: 'Oswald', cursive;">${this.title}</h2>
                <p style="font-size: 12px; font-family: 'PT Sans', sans-serif; color: gray; margin-left: 5px;">Изменено - ${this.date_time}</p>
                ${dueDateDisplay ? `<p style="font-size: 15px; font-family: 'PT Sans', sans-serif; color: black; margin-left: 5px;">Дата - ${this.due_date}</p>` : ''}
                <p class="text" style="margin: 5px; font-family: 'PT Sans', sans-serif; font-size: 16px;">${this.text}</p>
                <div style="display: flex;">
                    <p style="color: red; font-weight: bold; margin-left: 5px; ${importantDisplay ? '' : 'visibility: hidden;'}">Важное</p>
                    <p style="color: green; font-weight: bold; margin-left: 5px; ${urgentDisplay ? '' : 'visibility: hidden;'}">Срочное</p>
                </div>
                <button class="button" id="delete_note" onclick="NoteManager.deleteNote(${this.index})">Удалить</button>
                <button class="button" id="edit_note" onclick="NoteManager.editNote(${this.index})">Редактировать</button>
                <button class="button" id="markAsDone_${this.index}" onclick="NoteManager.markAsDone(${this.index})">Выполнить</button>
            </div>
        `;

        if (this.radio1) {
            if (!this.important && !this.urgent) {
                noteContainer.innerHTML += noteTemplate('#52f73c', 'Заметка', false, false, false);
            } else if (!this.important && this.urgent) {
                noteContainer.innerHTML += noteTemplate('#52f73c', 'Заметка', false, false, true);
            } else if (this.important && !this.urgent) {
                noteContainer.innerHTML += noteTemplate('#52f73c', 'Заметка', false, true, false);
            } else if (this.important && this.urgent) {
                noteContainer.innerHTML += noteTemplate('#52f73c', 'Заметка', false, true, true);
            }
        }

        if (this.radio2) {
            if (!this.important && !this.urgent) {
                noteContainer.innerHTML += noteTemplate('#ff4f00', 'Событие', true, false, false);
            } else if (!this.important && this.urgent) {
                noteContainer.innerHTML += noteTemplate('#ff4f00', 'Событие', true, false, true);
            } else if (this.important && !this.urgent) {
                noteContainer.innerHTML += noteTemplate('#ff4f00', 'Событие', true, true, false);
            } else if (this.important && this.urgent) {
                noteContainer.innerHTML += noteTemplate('#ff4f00', 'Событие', true, true, true);
            }
        }

        if (this.radio3) {
            if (!this.important && !this.urgent) {
                noteContainer.innerHTML += noteTemplate('#ffef00', 'Встреча', true, false, false);
            } else if (!this.important && this.urgent) {
                noteContainer.innerHTML += noteTemplate('#ffef00', 'Встреча', true, false, true);
            } else if (this.important && !this.urgent) {
                noteContainer.innerHTML += noteTemplate('#ffef00', 'Встреча', true, true, false);
            } else if (this.important && this.urgent) {
                noteContainer.innerHTML += noteTemplate('#ffef00', 'Встреча', true, true, true);
            }
        }
    }
}

class UIManager {
    static displayAllNotes() {
        let allNotes = JSON.parse(localStorage.getItem("notes"));
        if (allNotes == null) {
            document.getElementById("emptyNotes").style.display = "block";
        } else {
            document.getElementById("emptyNotes").style.display = "none";
            for (let index = 0; index < allNotes.length; index++) {
                let element = JSON.parse(allNotes[index]);
                new Note(element.noteTitle, element.noteText, element.date, element.important, element.urgent, element.due_date, element.radio1, element.radio2, element.radio3, index).render();
            }
        }

        allNotes.forEach((note, index) => {
            let noteObj = JSON.parse(note);
            if (noteObj.done) {
                let markAsDoneButton = document.getElementById(`markAsDone_${index}`);
                markAsDoneButton.innerText = "Выполнено"; // Устанавливаем текст кнопки
                markAsDoneButton.style.backgroundColor = "orange"; // Устанавливаем цвет кнопки
                markAsDoneButton.disabled = true;
            }
        });
    }

    static updateNote(index) {
        let noteTitle = document.getElementById("noteTitle").value.trim();
        let noteText = document.getElementById("noteText").value.trim();
        let important = document.getElementById("note-imp").checked;
        let urgent = document.getElementById("note-urgent").checked;
        let date_time = document.getElementById("date_time").value;
        let radio1 = document.getElementById("note1").checked;
        let radio2 = document.getElementById("event1").checked;
        let radio3 = document.getElementById("meet1").checked;
    
        var strTime = new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
    
        // Validate input
        if (noteTitle == null || noteTitle == undefined || noteTitle.length == 0 || noteText == null || noteText == undefined || noteText.length == 0) {
            alert("Поля должны быть заполнены!");
            return;
        }
    
        // Update the note
        let noteData = {
            noteTitle: noteTitle,
            noteText: noteText,
            date: strTime,
            important: important,
            urgent: urgent,
            due_date: date_time,
            radio1: radio1,
            radio2: radio2,
            radio3: radio3,
        };
    
        let allNotes = JSON.parse(localStorage.getItem("notes"));
        allNotes[index] = JSON.stringify(noteData);
        localStorage.setItem("notes", JSON.stringify(allNotes));
    
        document.getElementById("addNote").innerText = "Добавить";
        document.getElementById("addNote").removeEventListener("click", UIManager.updateNote);
        document.getElementById("addNote").addEventListener("click", NoteManager.addNote);
    
        // Очистить от полей
        document.getElementById("noteTitle").value = "";
        document.getElementById("noteText").value = "";
        $('#note-imp').prop('checked', false);
        $('#note-urgent').prop('checked', false);
        $('#note1').prop('checked', false);
        $('#event1').prop('checked', false);
        $('#meet1').prop('checked', false);
    
        // Очистить
        document.getElementById("notes").innerHTML = "";
        UIManager.displayAllNotes();
        // Перезагрузить страницу после обновления заметки
        location.reload();
    }
    

    static searchNote() {
        document.getElementById("notes_search").addEventListener("input", () => {
            let inputVal = document.getElementById("notes_search").value.toLowerCase();
            let allcards = document.getElementsByClassName("noteCard");
        
            Array.from(allcards).forEach(element => {
                const cardTitle = element.getElementsByTagName("h2")[0].innerText.toLowerCase();
                const cardContent = element.getElementsByClassName("text")[0].innerText.toLowerCase();
                if (cardContent.includes(inputVal) || cardTitle.includes(inputVal)) {
                    element.style.display = "block";
                }
                else {
                    element.style.display = "none";
                }
            });
        });
    }
}

class NoteManager {
    static addNote() {
        let noteTitle = document.getElementById("noteTitle").value.trim();
        let noteText = document.getElementById("noteText").value.trim();
        let important = document.getElementById("note-imp").checked;
        let urgent = document.getElementById("note-urgent").checked;
        let date_time = document.getElementById("date_time").value;
        let radio1 = document.getElementById("note1").checked;
        let radio2 = document.getElementById("event1").checked;
        let radio3 = document.getElementById("meet1").checked;

        let currentDate = new Date();
        let selectedDate = new Date(date_time);

        if (selectedDate < currentDate) {
            alert("Вы не можете установить заметку в прошедшее время.");
            return;
        }

        var strTime = new Date().toLocaleDateString()+" "+ new Date().toLocaleTimeString();

        let allNotes = localStorage.getItem("notes");

        if (noteTitle == null || noteTitle == undefined || noteTitle.length == 0 || noteText == null || noteTitle == undefined || noteText.length == 0) {
            alert("Поля должны быть заполнены!");
            return;
        }

        document.getElementById("noteTitle").value = "";
        document.getElementById("noteText").value = "";
        $('#note-imp').prop('checked',false);
        $('#note-urgent').prop('checked',false);
        $('#note1').prop('checked',false);
        $('#event1').prop('checked',false);
        $('#meet1').prop('checked',false);

        let noteData = {
            noteTitle: noteTitle,
            noteText: noteText,
            date: strTime,
            important: important,
            urgent: urgent,
            due_date: date_time,
            radio1: radio1,
            radio2: radio2,
            radio3: radio3,
        }

        if (allNotes == null || allNotes == undefined) {
            let notesArray = [];
            notesArray.push(JSON.stringify(noteData));
            localStorage.setItem("notes", JSON.stringify(notesArray));
        } else {
            let notesArray = JSON.parse(localStorage.getItem("notes"));
            notesArray.push(JSON.stringify(noteData));
            localStorage.setItem("notes", JSON.stringify(notesArray));
        }

        document.getElementById("notes").innerHTML = "";
        UIManager.displayAllNotes();
        location.reload();
    }

    static markAsDone(index) {
        let allNotes = JSON.parse(localStorage.getItem("notes"));
        if (allNotes) {
            let noteToMarkAsDone = JSON.parse(allNotes[index]);
            noteToMarkAsDone.done = true;
            allNotes[index] = JSON.stringify(noteToMarkAsDone);
            localStorage.setItem("notes", JSON.stringify(allNotes));
            // Обновляем кнопку "Выполнить"
            let markAsDoneButton = document.getElementById(`markAsDone_${index}`);
            markAsDoneButton.innerText = "Выполнено"; // Изменяем текст кнопки
            markAsDoneButton.style.backgroundColor = "orange";
            markAsDoneButton.disabled = true;
        }
    }
    
    static deleteNote(index) {
        let allNotes = JSON.parse(localStorage.getItem("notes"));
        if (allNotes !== null && allNotes !== undefined) {
            allNotes.splice(index, 1);
            localStorage.setItem("notes", JSON.stringify(allNotes));
            document.getElementById("notes").innerHTML = "";
            UIManager.displayAllNotes();
        }
    }
    

    static editNote(index) {
        let allNotes = JSON.parse(localStorage.getItem("notes"));
        let noteToEdit = JSON.parse(allNotes[index]);
    
        document.getElementById("noteTitle").value = noteToEdit.noteTitle;
        document.getElementById("noteText").value = noteToEdit.noteText;
        document.getElementById("note-imp").checked = noteToEdit.important;
        document.getElementById("note-urgent").checked = noteToEdit.urgent;
        document.getElementById("date_time").value = noteToEdit.due_date;
        if (noteToEdit.radio1) {
            document.getElementById("note1").checked = true;
        } else if (noteToEdit.radio2) {
            document.getElementById("event1").checked = true;
        } else if (noteToEdit.radio3) {
            document.getElementById("meet1").checked = true;
        }
    
        document.getElementById("addNote").innerText = "Обновить";
        document.getElementById("addNote").removeEventListener("click", NoteManager.addNote);
        document.getElementById("addNote").addEventListener("click", function() {
            UIManager.updateNote(index);
        });
    }
}

class ReminderManager {
    static remindAfterDueTime() {
        let allNotes = JSON.parse(localStorage.getItem("notes"));
        if (allNotes) {
            allNotes.forEach((note, index) => {
                let noteObj = JSON.parse(note);
                let due_date = new Date(noteObj.due_date);
                let currentTime = new Date();
                let timeDifference = due_date.getTime() - currentTime.getTime();
                let reminderShown = noteObj.reminderShown || false;

                if (timeDifference <= 0 && !reminderShown) {
                    ReminderManager.playNotificationSound(() => {
                        let title = noteObj.noteTitle;
                        alert(`Напоминание: не забудьте выполнить ${title}!`);
                        
                        noteObj.reminderShown = true; // Обновляем поле reminderShown
                        allNotes[index] = JSON.stringify(noteObj);
                        localStorage.setItem("notes", JSON.stringify(allNotes));
                    });
                }
            });
        }
    }

    static playNotificationSound(callback) {
        let audio = new Audio('notification.mp3');
        audio.onended = callback; 
        audio.play();
    }
}

// Event Listeners
document.getElementById("addNote").addEventListener("click", NoteManager.addNote);
window.onload = UIManager.displayAllNotes();
setInterval(ReminderManager.remindAfterDueTime, 1000);
UIManager.searchNote();

// Utility Functions
function displayDueDate() {
    $('#due_date').css("visibility", "visible");
}

function removeDueDate() {
    $('#due_date').css("visibility", "hidden");
}

function onClickMenu() {
    document.getElementById("menu").classList.toggle("change");
    document.getElementById("nav").classList.toggle("change");
    document.getElementById("menu-bg").classList.toggle("change-bg");
}
