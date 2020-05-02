function dataObjectUpdate() {
    localStorage.setItem('remembrall', JSON.stringify(data))
}

var data = (localStorage.getItem('remembrall')) ? JSON.parse(localStorage.getItem('remembrall')) : {}

//{"notes":[["High Hopes","Had to have high high hopes for a livin'"],["I want it that way",
//"Tell me why\nAin't nothing but a heartache\nTell my why\nAin't nothing but a mistake\nNow number five\nI never wanna hear you say\nI want it that way"]
//,["Immigrant Song","We come from the land of the ice and snow \nWhere the midnight suns and the hot springs glow\nHammer of the gods\n"],["Galway Gril","She played the fiddle in an Irish band\nBit she fell in love with an English band\nKissed her on the neck and the I took her by the hand\nSaid baby I just wanna dance"],["HEy nOw",""],["All star",""],["Get your game on",""],["The world is gonna roll me",""]]}

const title = $('.title')
const editWindow = $('.edit-window')
const inputs = $('.input')
const inputTitle = $('#title')
const inputContent = $('#content')
const notesList = $('.notes-list')

const btnEdit = $('#edit-btn')
const btnAdd = $('#add-btn')
const btnSave = $('#save-btn')
const btnDelete = $('#delete-btn')

let state = 'home' //display, edit, home
let editMode = false
let prevTitle = ''

renderNotesList()
updateNotesList()

function addItem() {
    let title = inputTitle.val()
    let content = inputContent.val()

    if (title || content) {
        inputTitle.val('')
        inputContent.val('')

        data[title] = content

        let li = document.createElement('li')
        li.innerText = title
        notesList.prepend(li)

        dataObjectUpdate()
        updateNotesList()
    }
}

function renderNotesList() {
    if (data) {
        $.each(data, function (title, c) {
            let li = document.createElement('li')
            li.innerText = title

            notesList.prepend(li)
        })
    } else {
        // SHOW NO NOTES EXIST
    }
}

function saveExistingNote(prevTitle) {
    if (prevTitle == inputTitle.val()) {
        data[prevTitle] = inputContent.val()
        inputTitle.val('')
        inputContent.val('')
    } else {
        deleteNote(prevTitle)
        addItem()
    }
}

function displayNote(title) {
    content = data[title]
    inputTitle.val(title)
    inputContent.val(content)
}

function deleteNote(title) {
    delete data[title]
    dataObjectUpdate()

    notesList.empty()
    renderNotesList()
    updateNotesList()
}

const changeState = state => {
    if (state == 'home') {
        btnEdit.hide()
        btnSave.hide()
        btnAdd.show()
        btnDelete.hide()
        editWindow.hide()
    } else if (state == 'edit') {
        btnEdit.hide()
        btnSave.show()
        btnAdd.hide()
        btnDelete.show()
        editWindow.show()
        inputs.removeAttr('readonly')

    } else if (state == 'display') {
        btnEdit.show()
        btnSave.hide()
        btnAdd.hide()
        btnDelete.show()
        editWindow.show()
        inputs.attr('readonly', 'readonly')
    }
}

function updateNotesList() {
    notesListItems = $('li')
    notesListItems.click(e => {
        changeState('display')
        displayNote(e.target.innerText)
    })
}

btnEdit.click(_ => {
    changeState('edit')
    prevTitle = inputTitle.val()
    editMode = true
})

btnAdd.click(_ => {
    changeState('edit')
    editMode = false
})

btnSave.click(_ => {
    changeState('home')
    if (editMode) {
        saveExistingNote(prevTitle)
    } else {
        addItem()
    }
})

btnDelete.click(_ => {
    changeState('home')
    deleteNote(inputTitle.val())
})

//btnSave.click(addItem)
changeState('home')

// BACKDOOR
$('.title').click(_ => {
    inputTitle.val('')
    inputContent.val('')
    changeState('home')
})