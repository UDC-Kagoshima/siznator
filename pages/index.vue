<template>
  <head>
    <title>シズネーター</title>
  </head>
    <div class="app-name app-Link">
      シズネーター
    </div>

  <div class="search-rerative d-flex">
    <div class="search-section ">
      <h2>観戦日もしくは、競技名を入力してね！</h2>
      <form class="search-form" @submit.prevent="search">
        <div class="search-row">
          <label for="competitionName">競技名：</label>
          <input
            id="competitionName"
            v-model="competitionName"
            type="text"
            class="form-control form-control-lg"
            placeholder="競技名を入力"
          />
        </div>

        <div class="search-row">
          <label for="date">日付：</label>
          <input
            id="date"
            v-model="date"
            type="date"
            class="form-control form-control-lg"
            name="date"
          />
        </div>
        <div class="search-row">
          <label for="date">直近の開催日：</label>
        </div>
        <div class="d-grid gap-2 d-md-block col-sm-4 mb-3 list-group-horizontal">
          <button
            type="button"
            class="btn btn-secondary btn-lg "
            @click="setToday"
          >
            今日
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-lg mx-lg-3"
            @click="setTomorrow"
          >
            明日
          </button>
        </div>
        <div class="search-row">
          <div class="text-center">
            <button type="submit" class="btn btn-primary btn-lg col-6" @click="filterCompetitions">
              検索
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <div class="row">
    <div v-for="competition in filteredCompetitions" :key="competition.id" class="col-md-4">
      <div class="competition-card text-center ">
        <h3 class="competition-title">{{ competition.competition_name }}</h3>
        <p>市町村名: {{ competition.municipality }}</p>
        <p>開始日: {{ competition.start_date }}</p>
        <p>終了日: {{ competition.finish_date }}</p>
        <p>会場: {{ competition.venue }}</p>
        <div class="button-row">
            <button class="directions-button round-button" @click="redirectToDirections(competition.latitude,competition.longitude)">
              ルート表示
            </button>
            <button class="directions-button round-button" @click="redirectToRestaurants(competition.Restaurants_URL)">
              会場周辺の飲食店情報
            </button>
        </div>
      </div>
    </div>
  </div>

  
<a id="scrollToTopButton" href="#" class="scroll-to-top-button" @click="scrollToTop">
  検索ボックスへ戻る
</a>
  
<div class="footer footer-shape">
  <div class="row">
    <div class="col-md-12 footer-content">
      <div class="footer-links">
        <h2>関連リンク</h2>
        <a href="https://kagoshimakokutai2020.jp/" target="_blank">燃ゆる感動かごしま国体・かごしま大会 – 特別国民体育大会</a>
        <a href="https://infarmation.org" target="_blank">鹿児島インファーメーション</a>
        <a href="https://forms.gle/q9aaxCiSnNam8zxP9" target="_blank">HPのご意見・ご感想はこちら</a>
      </div>
    </div>
  </div>
  <div class="col-md-12 text-center footer-content">
    <p class="footer-text">&copy; Kagoshima Infamation All Rights Reserved.</p>
  </div>
</div>
  
</template>

<script>
const competitions = [];
export default defineComponent({
  data() {
    return {
      competitions: [],
      competitionName: '',
      date: '',
      filteredCompetitions: [],
    };
  },

  async setup() {
    const config = useRuntimeConfig()
    const { data: competition_json } = await useFetch("https://script.google.com/macros/s/AKfycbxcFrw-p2wod6Cj4ludXiuSTuKGQbwG5wjQetAaDsGPDsSCGmCTfbmkej9BaxOlepho/exec")
    const competition_values = competition_json.value;
    for(let i = 0; i < competition_values.length; i++) {
      const competition = {
        id: competition_values[i].id,
        competition_name: competition_values[i].CompetitionName,
        municipality: competition_values[i].Municipality,
        start_date: competition_values[i].StartDate,
        finish_date: competition_values[i].FinishDate,
        venue: competition_values[i].Venue,
        latitude: competition_values[i].Latitude,
        longitude: competition_values[i].Longitude,
        address: competition_values[i].Address,
        Restaurants_URL: competition_values[i].RestaurantsURL,
      };
      competitions.push(competition);
    };
    return {
      competitions
    }
  },
  methods: {
    redirectToDirections(VenueLatitude, VenueLongitude) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const directionsUrl = 'https://www.google.com/maps/dir/' + latitude + ',' + longitude + '/' + VenueLatitude + ',' + VenueLongitude;
          window.open(directionsUrl, '_blank')
        });
      } else {
        alert("このブラウザではジオロケーションがサポートされていません。");
      }
    },

    formatDate(date) {
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      return year + "-" + month + "-" + day;
    },

    setToday() {
      const today = new Date();
      const formattedDate = this.formatDate(today);
      this.date = formattedDate;
      this.filterCompetitions();
    },

    setTomorrow() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // 明日の日付を設定
      const formattedDate = this.formatDate(tomorrow);
      this.date = formattedDate;
      this.filterCompetitions();
    },

    filterCompetitions() {
      let filtered = this.competitions;
      if (this.date) { 
        const selectedDate = new Date(this.date); 
        filtered = filtered.filter((competition) => {
          const startDate = new Date(competition.start_date);
          const finishDate = new Date(competition.finish_date);
          return startDate <= selectedDate && finishDate >= selectedDate;
        });
      }

      if (this.competitionName) { 
        const competitionName = this.competitionName.toLowerCase(); 
        filtered = filtered.filter((competition) => {
          const lowerCaseCompetition = competition.competition_name.toLowerCase();
          return lowerCaseCompetition.includes(competitionName);
        });
      }

      this.filteredCompetitions = filtered;
    },

    redirectToRestaurants(url) {
      window.open(url, '_blank');
    },
  },
})
</script>

<style>
.app-name {
  font-family:  
              "秀英角ゴシック銀 M JIS2004",
              "Noto Sans JP",
              "-apple-system",
              "BlinkMacSystemFont",
              "Yu Gothic Medium",
              "游ゴシック Medium",
              "YuGothic",
              "游ゴシック体",
              "ヒラギノ角ゴ Pro W3",
              "メイリオ",
              "sans-serif";
  font-size: 36px;
  font-weight: bold;
  color: #2458BF;
  background-color: #fff;
}

.app-Link {
  border: 2px solid #000;
  border-radius: 60px;
  padding: 20px 20px;
  text-decoration: none;
  font-weight: bold;
  text-align: center;
  margin: 1.5em 30px 1.5em 30px;
}
.header{
  background-color:#8049e7;
}

.search-rerative{
  position: relative;
}

.search-section {
  background-color: #B3E0F2;
  margin-bottom: 20px;
  border-radius: 20px;
  position: relative;
  display: inline-block;
  margin: 1.5em 15px 1.5em 30px;
  padding: 10px 20px;
  min-width: 50%;
  max-width: 100%;
  color: #555;
  font-size: 16px;
  border: solid 3px #555;
  box-sizing: border-box;
}

.faceicon img {
  max-width: 400px;
  min-width: 50px;
  height: 400px;
  margin: 20px;
}

.faceicon p{
  text-align: center;
}

.search-section:before {
  content: "";
  position: absolute;
  top: 70%;
  right: -24px;
  margin-top: -12px;
  border: 12px solid transparent;
  border-left: 12px solid #B3E0F2;
  z-index: 2;
}

.search-section:after {
  content: "";
  position: absolute;
  top: 70%;
  right: -30px;
  margin-top: -14px;
  border: 14px solid transparent;
  border-left: 14px solid #555;
  z-index: 1;
}

.search-row {
  align-items: center;
  margin-bottom: 10px;
}

.search-row label {
  flex: 0 0 120px;
  font-size: 18px;
  font-weight: bold;
}

.search-row .input-field {
  flex: 1;
  margin-left: 10px;
}

.search-row input[type="text"],
.search-row input[type="date"] {
  width: 100%;
  height: 40px;
  padding: 6px 12px;
  font-size: 18px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.search-button {
  align-items: center;
  font-size: 100%;
  padding-right: 120px;
  padding-left: 120px;
  margin: auto;
}
.search-button-row{
  padding-top: 20px;
  display: flex;
  justify-content: space-evenly;
}

@media (max-width: 800px) {
  .search-section {
    background-color: #B3E0F2;
    margin-bottom: 20px;
    border-radius: 20px;
    position: relative;
    display: inline-block;
    margin: 1.5em 15px 1.5em 30px;
    padding: 10px 20px;
    min-width: 50%;
    max-width: 100%;
    color: #555;
    font-size: 16px;
    border: solid 3px #555;
    box-sizing: border-box;
  }

  .search-section:before {
    content: "";
    position: absolute;
    bottom:205%; left: 20px;
    margin-left: 0;
    display: block;
    width: 30px;
    height: 30px;
    background: #19283C;
    border-radius: 0 30px 0 30px;
    z-index: -1;
  }

  .search-section:after {
    content: "";
    position: absolute;
    bottom: 105%; left: 30px;
    margin-left: 0;
    display: block;
    width: 30px;
    height: 30px;
    background: #FFF;
    border-radius: 0 30px 0 30px;
    z-index: -1;
    -webkit-transform: rotate(30deg);
      -moz-transform: rotate(30deg);
        -ms-transform: rotate(30deg);
        -o-transform: rotate(30deg);
            transform: rotate(30deg);
  }

  .faceicon img{
    width: 100px;    /* 横幅を割合で指定 */
    height: 100px;  /* 高さは自動指定 */
    border-radius: 60%;
    object-fit: cover;
    object-position:50% 50%;
  }
  
  .btn-lg {
    white-space: nowrap;
    width: 100%;
    padding: 0.5rem;
  }

}

.competition-card h3 {
  font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic ProN", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", sans-serif !important;
  font-weight: bold;
  font-size: 24px;
}

.competition-card p {
  font-family: "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic ProN", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", sans-serif !important;
  font-size: 16px;
}

.competition-card {
  background-color: #B3E0F2;
  color: #2458BF;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  border-radius: 30px;
  margin: 1.5em 15px 1.5em 30px;
}

.competition-card:hover {
  background-color: #2B88D9;
  color: #fff;
}

.competition-title {
  font-weight: bold;
  text-align: center;
  font-size: 24px;
}

.round-button {
  display: inline-block;
  border: 2px solid #000;
  border-radius: 60px;
  padding: 20px 70px;
  color: #000;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  margin: 1.5em 5px 1.5em 2px;
}

.scroll-to-top-button:hover {
  background-color: #2B88D9;
}

.scroll-to-top-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #fff;
  color: #2458BF;
  font-size: 16px;
  text-decoration: none;
  z-index: 999;
  border: solid 3px #555;
  border-radius: 60px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  color: #fff;
}

.footer-links a {
  margin-bottom: 10px;
  color: #fff;
}

.footer-content {
  position: relative;
  z-index: 1;
}

.footer-shape {
  position: absolute;
  bottom: -100px;
  left: 0;
  width: 100%;
  height: 300px;
  background-image: linear-gradient(135deg, rgba(0, 123, 255, 0.5), #14568B);
  animation: footerShapeAnimation 10s ease-in-out infinite;
  transform-origin: bottom;
}

.footer {
  background-color: #299cbc90;
  padding: 20px;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  color: #fff;
}

</style>