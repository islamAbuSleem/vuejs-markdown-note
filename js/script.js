//Register this filter with the Vue.filter global method

Vue.filter('date', time => moment(time).format('DD/MM/YYYY, HH:mm'))


var app = new Vue({
    el: '#note',
    data: {
        content: '',
        notes: JSON.parse(localStorage.getItem('notes')) || [],
        // Id of the selected note
        selectedId: localStorage.getItem('selected-id') || null,
        show: false,
    },
    
     //here is the computed functions
    computed: {
        notePreview () {
            return this.selectedNote ? (this.selectedNote.content) : ''
        },
        
        selectedNote () {
            // We return the matching note with selectedId
            
             return this.notes.find(note => note.id === this.selectedId) 
            
        },
        
        sortedNotes (){
            return this.notes.slice()
            .sort((a,b) => a.created - b.created)
            .sort((a,b) => (a.favorite === b.favorite) ? 0 
                  : a.favorite ? -1 
                  : 1)
        },
        
        linesCount (){
            if (this.selectedNote){
                // Count the number of new line characters
                return this.selectedNote.content.split(/\r\n|\r|\n/).length
            }
        },
        
        wordsCount (){
            if (this.selectedNote) {
                var s = this.selectedNote.content
                // Turn new line cahracters into white-spaces
                s = s.replace(/\n/g, ' ')
                // Exclude start and end white-spaces
                s = s.replace(/(^\s*)|(\s*$)/gi, '')
                // Turn 2 or more duplicate white-spaces into1
                s = s.replace(/\s\s+/gi, ' ')
                // Return the number of spaces
                return s.split(' ').length
                }
            },
        
            charactersCount () {
                if (this.selectedNote) {
                return this.selectedNote.content.split('').length
                }
            },
    },
    methods: {
        saveNotes(val){    // save note to browser localstorage
                          //  Since we can't save an array of objects
                         // directly into the localStorage API (it only accepts strings), we need to convert
                        // it to JSON first with JSON.stringify:
            localStorage.setItem('notes', JSON.stringify(this.notes))
            
        },
        addNote(){
            const time = Date.now();
            const note = {
                id: String(time),
                title: 'new note ' + (this.notes.length + 1),
                content: 'Hi to Colored note',
                created: time,
                favorite: false
            }
            // Add to the list
            this.notes.push(note)
        },
        selectNote (note) {
            this.selectedId = note.id;
        },
        hideInput(){
            this.show = false;
        },
        removeNote(){
            if(this.selectedNote && confirm('Delete ' + this.selectedNote.title + ' ?')){
                const index = this.notes.indexOf(this.selectedNote);
                if(index !== -1){
                    this.notes.splice(index, 1);
                }
            }
        },
        favoriteNote () {
        this.selectedNote.favorite = !this.selectedNote.favorite
        },
//        This can be nicely shortened, as follows:
//        favoriteNote () {
//        this.selectedNote.favorite ^= true // ^ mean XOR
//        },
    },
    // here is the watch handlers to track changes
    watch: {
        notes: {
                // The method name
                
            handler: 'saveNotes',
                
                // We need this to watch each note's properties inside the array

            deep: true
            },

        // Let's save the selection too

        selectedId: function(val) {
            localStorage.setItem('selected-id',val)
        }
            
    },
//     This will be called when the instance is ready
//    created (){
//        // Set the content to the stored value
//        // or to a default string if nothing was saved
//        
//        this.content = localStorage.getItem('content') || 'You can write anything you want !'
//    }
});
