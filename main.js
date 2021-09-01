/** 
 * 1. Render songs -----(Done)
 * 2. Scroll top -----(Done)
 * 3. Play/ Pause/ Seek  -----(Done)
 * 4. CD roatate -----(Done)
 * 5. Next/ Prev -----(Done)
 * 6. Random -----(Done)
 * 7. Next/ Repeat when ended -----(Done)
 * 8. Active song -----(Done)
 * 9. Scroll active song into view -----(Done)
 * 10. Play song when click -----(Done)
 * 11. Bonus lưu cấu hình
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'NAW_PLAYER'

const header = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const singer = $('.singer h3');
const title = $('header h2');
const btnPlay = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const volume = $('#volume')
const btnVolume = $('.btn-toggle-volume')
const btnPrev = $('.btn-prev')
const btnNext = $('.btn-next')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const cdInnerThumb1 = $('.cd-thumb-inner-1');
const cdInnerThumb2 = $('.cd-thumb-inner-2');
const playlist = $('.playlist');
const currentTime = $('.current-time');
// const totalTime = $('.total-time');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMute: false,
    countSong: 0,
    arrayRandomSongIndex: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}, //Mặc định không có thì lấy Object rỗng
    songs: [
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
        {
            name: 'Inception',
            singer: 'ATEEZ',
            path: './assets/music/Inception-ateez.mp3',
            image: './assets/img/inception-ateez.jpg'
        },
    ],
    setConfig(key, value) {
        this.config[key] = value;
        //lưu object có key và value vừa tạo vào localStorage
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div id="song-${index}" class="song">
                    <div class="song-wrap ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
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
        playlist.innerHTML = htmls.join('')
    },
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents() {
        //Các giá trị mặc định ban đầu
        const cdWidth = cd.offsetWidth

        const CdWidthThumb1 = cdWidth / 4;
        const CdWidthThumb2 = cdWidth / 6;

        cdInnerThumb1.style.width = CdWidthThumb1 + 'px'
        cdInnerThumb1.style.height = CdWidthThumb1 + 'px'
        cdInnerThumb2.style.width = CdWidthThumb2 + 'px'
        cdInnerThumb2.style.height = CdWidthThumb2 + 'px'

        cdInnerThumb1.style.left = 'calc(50% - ' + CdWidthThumb1 + 'px / 2)'
        cdInnerThumb2.style.left = 'calc(50% - ' + CdWidthThumb2 + 'px / 2)'

        //Xử lý thu phóng Cd khi cuộn
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            const realWidth = newCdWidth > 0 ? newCdWidth : 0;
            if (realWidth <= 10) {
                cd.style.padding = realWidth / 2 + 'px'
                cd.style.borderWidth = realWidth / 4 + 'px'
                singer.style.padding = realWidth / 2 + 'px'

                if (realWidth === 0) {
                    singer.style.color = 'var(--second-color)'
                    singer.style.letterSpacing = '4px'
                    title.style.textShadow = '0px 0px 2px var(--second-dark-color)'
                } else {
                    singer.style.letterSpacing = '2px'
                    singer.style.color = '#999'
                    title.style.textShadow = '0px 0px 2px transparent'
                }
            } else {
                cd.style.padding = '5px'
                cd.style.borderWidth = '5px'
                singer.style.letterSpacing = '2px'
                singer.style.color = '#999'
                singer.style.padding = '5px'
                title.style.textShadow = '0px 0px 2px transparent'
            }
            cd.style.width = realWidth + 'px';
            cd.style.opacity = newCdWidth / cdWidth;

            const newCdWidthThumb1 = newCdWidth / 4;
            const newCdWidthThumb2 = newCdWidth / 6;

            cdInnerThumb1.style.width = newCdWidthThumb1 + 'px'
            cdInnerThumb1.style.height = newCdWidthThumb1 + 'px'
            cdInnerThumb2.style.width = newCdWidthThumb2 + 'px'
            cdInnerThumb2.style.height = newCdWidthThumb2 + 'px'

            cdInnerThumb1.style.left = 'calc(50% - ' + newCdWidthThumb1 + 'px / 2)'
            cdInnerThumb2.style.left = 'calc(50% - ' + newCdWidthThumb2 + 'px / 2)'
        }

        //Xử lý khi click play/pause
        btnPlay.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //Xử lý animate xoay cd
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10s
            iterations: Infinity,
        }) // Trả vê một đối tượng animate
        cdThumbAnimate.pause()

        //Xử lý UI khi song được click play
        audio.onplay = function () {
            app.isPlaying = true;
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //Xử lý UI khi song được click pause
        audio.onpause = function () {
            app.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi next song 
        btnNext.onclick = function () {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        //Khi prev song 
        btnPrev.onclick = function () {
            if (app.isRandom) {
                app.randomSong()
            } else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        //Xử lý bật tắt Random
        btnRandom.onclick = function () {
            app.isRandom = !app.isRandom;
            this.classList.toggle('active', app.isRandom) // ko cần cũng được

            app.setConfig('isRandom', app.isRandom)
        }

        //Xử lý bật tắt Repeat
        btnRepeat.onclick = function () {
            app.isRepeat = !app.isRepeat;
            this.classList.toggle('active', app.isRepeat)

            app.setConfig('isRepeat', app.isRepeat)
        }

        //Khi tiến độ bài hát hay đổi
        audio.ontimeupdate = function () {
            const progressPercent = audio.currentTime / audio.duration * 100;
            progress.value = progressPercent;

            var total = app.changeToTime(Math.floor(audio.duration));
            // totalTime.textContent = total === 'NaN:NaN:NaN' ? '00:00' : total;

            var totalBehind = total === 'NaN:NaN:NaN' ? '00:00' : total;
            currentTime.textContent = app.changeToTime(Math.floor(audio.currentTime)) + ` / ${totalBehind}`
        }

        //Xử lý khi tua
        progress.oninput = function () {
            const seekTime = progress.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        var volumeRage = 1;
        //Xử lý tăng giảm âm lượng
        volume.oninput = function () {
            volumeRage = volume.value;
            audio.volume = volumeRage;

            if (volumeRage == 0)
                app.isMute = true
            else app.isMute = false
            btnVolume.classList.toggle('going-up', !app.isMute)
        }

        //Xử lý tắt/mở âm thanh
        btnVolume.onclick = function () {
            app.isMute = !app.isMute
            btnVolume.classList.toggle('going-up', !app.isMute)
            if (app.isMute) {
                volume.value = 0;
                audio.volume = volume.value;
            } else {
                volume.value = volumeRage;
                audio.volume = volume.value;
            }
        }

        //Xử lý next song khi audio ended
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play()
            } else {
                btnNext.click();
            }
        }

        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            //Xử lý khi click vào đúng song
            const songNotActive = e.target.closest('.song-wrap:not(.active)');
            const option = e.target.closest('.option')
            // console.log(e.target)
            // console.log(songNotActive )
            if (songNotActive || option) {
                // console.log(e.target)
                if (songNotActive && !option) {
                    // console.log(songNotActive.getAttribute('data-index')) //C1
                    // console.log(songNotActive.dataset.index) //C2
                    app.currentIndex = Number(songNotActive.dataset.index);
                    app.loadCurrentSong();
                    audio.play();
                    app.render();
                }
                //else vẫn được
                if (option) {
                    console.log('Option')
                }
            }
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
    loadConfig() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

        //Hiển thị trạng thái ban đầu của btnRandom và btnRepeat
        btnRandom.classList.toggle('active', this.isRandom)
        btnRepeat.classList.toggle('active', this.isRepeat)
    },
    nextSong() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    randomSong() {
        let newIndex;

        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
            var isInclude = this.arrayRandomSongIndex.includes(newIndex)
        } while (isInclude)

        this.arrayRandomSongIndex.push(newIndex);
        this.countSong++;

        this.currentIndex = newIndex;
        this.loadCurrentSong()

        if (this.countSong === this.songs.length) {
            this.arrayRandomSongIndex = [];
            this.countSong = 0;
        }
    },
    scrollToActiveSong() {
        setTimeout(() => {
            if (this.currentIndex <= 2) {
                $('.song-wrap.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            } else {
                $('.song-wrap.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
        }, 300)
    },
    changeToTime(secs) {
        var sec_num = parseInt(secs, 10)
        var hours = Math.floor(sec_num / 3600)
        var minutes = Math.floor(sec_num / 60) % 60
        var seconds = sec_num % 60

        return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")
    },
    start() {
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        //Lắng nghe/ xử lý các sự kiện (DOM Events)
        this.handleEvents()

        //Load thông tin bài hát đầu tiên khi chạy ứng dụng
        this.loadCurrentSong()

        //Load thông tin cấu hình khi chạy ứng dụng
        //Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        //Render playlist
        this.render()
    }
}

app.start()
