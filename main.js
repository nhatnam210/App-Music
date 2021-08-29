/** 
 * 1. Render songs -----(Done)
 * 2. Scroll top -----(Done)
 * 3. Play/ Pause/ Seek  -----(Done)
 * 4. CD roatate -----(Done)
 * 5. Next/ Prev -----(Done)
 * 6. Random -----(Done)
 * 7. Next/ Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const header = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const singer = $('.singer h3');
const btnPlay = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnPrev = $('.btn-prev')
const btnNext = $('.btn-next')
const btnRandom = $('.btn-random')
const cdInnerThumb1 = $('.cd-thumb-inner-1');
const cdInnerThumb2 = $('.cd-thumb-inner-2');

const app = {
    currentIndex : 0,
    isPlaying :false,
    isRandom: false,
    songs : [
        {
            name: 'Advice',
            singer: 'Taemin',
            path: './assets/music/Advice-taemin.mp3',
            image: './assets/img/advice-taemin.jpg'
        },
        {
            name: 'Wolfgang',
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
        {
            name: 'Wonderland',
            singer: 'ATEEZ',
            path: './assets/music/wonderland-ateez.mp3',
            image: './assets/img/wonderland-ateez.jpg'
        },
        {
            name: 'God Menu',
            singer: 'Stray Kids',
            path: './assets/music/god menu - straykids.mp3',
            image: './assets/img/god-menu-straykids.jpg'
        },
        {
            name: 'Say My Name',
            singer: 'ATEEZ',
            path: './assets/music/Say My Name-ateez.mp3',
            image: './assets/img/say-my-name-ateez.jpg'
        },
        {
            name: 'Hala Hala',
            singer: 'ATEEZ',
            path: './assets/music/Hala hala - ateez.mp3',
            image: './assets/img/Halahala-ateez.jpg'
        },
        {
            name: 'Kit It x Thunderous',
            singer: 'NCT 127 x Stray Kids',
            path: './assets/music/kitit-thunderous-mashup.mp3',
            image: './assets/img/kitit-thunderous.jpg'
        },
    ],
    render() {
        const htmls = this.songs.map((song) => {
            return `
            <div class="song">
                    <div class="song-wrap">
                        <div class="thumb"
                            style=" background-image: url('${song.image}');">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>

                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties() {
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents() {
        const cdWidth = cd.offsetWidth

        var CdWidthThumb1 = cdWidth / 4;
        var CdWidthThumb2 = cdWidth / 6;

        cdInnerThumb1.style.width = CdWidthThumb1+ 'px'
        cdInnerThumb1.style.height = CdWidthThumb1 + 'px'
        cdInnerThumb2.style.width = CdWidthThumb2 + 'px'
        cdInnerThumb2.style.height = CdWidthThumb2 + 'px'

        cdInnerThumb1.style.left = 'calc(50% - '+CdWidthThumb1+'px / 2)'
        cdInnerThumb2.style.left = 'calc(50% - '+CdWidthThumb2+'px / 2)'

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration : 10000, //10s
            iterations: Infinity,
        }) // Trả vê một đối tượng animate

        cdThumbAnimate.pause()

        //Xử lý thu phóng Cd khi cuộn
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            // left: calc(50% - var(--width)/2);
            const newCdWidth = cdWidth - scrollTop;

           var newCdWidthThumb1 = newCdWidth / 4;
           var newCdWidthThumb2 = newCdWidth / 6;
            
            const realWidth = newCdWidth > 0 ? newCdWidth : 0;
            if(realWidth <= 20) {
                cd.style.padding = realWidth/2 + 'px'
            }else {
                cd.style.padding = '10px'
            }
            cd.style.width = realWidth + 'px';
            cd.style.opacity = newCdWidth / cdWidth;

            cdInnerThumb1.style.width = newCdWidthThumb1+ 'px'
            cdInnerThumb1.style.height = newCdWidthThumb1 + 'px'
            cdInnerThumb2.style.width = newCdWidthThumb2 + 'px'
            cdInnerThumb2.style.height = newCdWidthThumb2 + 'px'

            cdInnerThumb1.style.left = 'calc(50% - '+newCdWidthThumb1+'px / 2)'
            cdInnerThumb2.style.left = 'calc(50% - '+newCdWidthThumb2+'px / 2)'


        }

        //Xử lý khi click play/pause
        btnPlay.onclick = function() {
            if(app.isPlaying) {
                audio.pause();
            }else{
                audio.play();
            }
        }
        
        //Khi song được click play
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        console.log(cdThumbAnimate)

        //Khi song được click pause
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }
        
        //Khi tiến độ bài hát hay đổi
        audio.ontimeupdate = function () {
            const progressPercent = audio.currentTime / audio.duration *100;
            progress.value = progressPercent;
        }

        //Xử lý khi tua
        progress.onchange = function () {
            const seekTime = progress.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        //Khi next song 
        btnNext.onclick = function() {
            if(app.isRandom) {
                app.randomSong()
            }else{
                app.nextSong()
            }
            audio.play()
        }

        //Khi prev song 
        btnPrev.onclick = function() {
            if(app.isRandom) {
                app.randomSong()
            }else{
                app.prevSong()
            }
            audio.play()
        }
        
        //Xử lý bật tắt random
        btnRandom.onclick = function() {
            app.isRandom = !app.isRandom;
            btnRandom.classList.toggle('active',app.isRandom) // ko cần cũng được
            // app.randomSong()
        }

        //Xử lý next song khi audio ended
        audio.onended = function() {
            app.nextSong();
            audio.play()
        }

    },
    // getCurrentSong() {
    //     return this.songs[this.currentIndex]
    // },
    loadCurrentSong() {
        header.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        singer.textContent = this.currentSong.singer
    },
    nextSong() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1 ;
        }
        this.loadCurrentSong()
    },
    randomSong() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() *this.songs.length);
        }while(newIndex === this.currentIndex)   

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start() {
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        //Lắng nghe/ xử lý các sự kiện (DOM Events)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //Render playlist
        this.render()
    }
}

app.start()
console.log(app)