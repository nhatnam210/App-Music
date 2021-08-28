/** 
 * 1. Render songs
 * 2. Scroll top
 * 3. Play/ Pause/ Seek
 * 4. CD roatate
 * 5. Next/ Prev
 * 6. Random
 * 7. Next/ Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const app = {
    songs : [
        {
            name: 'Advice',
            singer: 'Taemin',
            path: './assets/music/Advice-taemin.mp3',
            image: './assets/img/advice-taemin.jpg'
        },
        {
            name: 'Woflgang',
            singer: 'Stray Kids',
            path: './assets/music/Wolfgang-StrayKid.mp3',
            image: './assets/img/wolfgang-straykid.jpg'
        },
        {
            name: 'Thunderous',
            singer: 'Stray Kids',
            path: './assets/music/Thunderous-StrayKid.mp3',
            image: './assets/img/thunderous-straykids.jpeg'
        },
    ],
    render: function() {
        console.log(12)
    },
    start : function() {
        this.render()
    }
}

app.start()