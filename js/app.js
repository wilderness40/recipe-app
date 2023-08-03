/* 전역변수 */
const wrap = document.querySelector('.wrap')  // 컨텐츠 전체를 감싸고 있는 wrap
const foodList = document.querySelector('.foodlist')  // 카드이미지 보이는 section

let inputKeyword = null  // 검색어 업데이트를 위한 전역변수
let defalutReults = []  // 처음에 보이는 화면의 데이터를 담는 변수
let searchResults = []  // 검색내용 업데이트를 위한 전역변수
let newResult = []  // 모달윈도우용..

/* food리스트 생성 마운트 함수  - 시작 */
function displayElement(data){
    let foodDiv = document.createElement('div')
    foodDiv.className = 'food-card'
    foodDiv.id =`${data.idMeal}` // 실제로 부여를 해줘야하는구나..
   
    let imgFrame = document.createElement('div')
    imgFrame.className = 'img-frame'

    let foodImg = document.createElement('img')
    foodImg.className = 'food-img'
    foodImg.src = data.strMealThumb
    
    let foodText = document.createElement('div')
    foodText.className = 'food-text'
    foodText.innerHTML = `<h3>${data.strMeal}</h3> <br/> <button class=modal-open>Get Recipe</button>`

    foodList.appendChild(foodDiv)
    foodDiv.append(imgFrame, foodText)
    imgFrame.appendChild(foodImg)
}
/* food리스트 생성 마운트 함수  - 끝 */

/* 모달윈도우 생성 마운트 함수 - 시작 */
function createModal(data, clickID){
// console.log(data, dataId)
for(let i = 0; i < data.length; i++){
if( data[i].idMeal == clickID ){
    let showModal = document.createElement('div')
    showModal.className = 'modal-window'
    showModal.innerHTML = `<button>X</button>`
         
    let modalText = document.createElement('div')
    modalText.className = 'modal-text'
    modalText.innerHTML = `<h3>${data[i].strMeal}</h3> <br/> <h4>${data[i].strCategory}</h4> <br/> <h5>Instructions:</h5> <br/> <p>${data[i].strInstructions}</p>` 
    
    let modalImgBox = document.createElement('div')
    modalImgBox.className = 'modal-imgbox'
    modalImgBox.innerHTML = `<img src=${data[i].strMealThumb} class ='modal-img' alt='thumbnailImg'> <br/> <h5>Watch Video</h5>`
    
    wrap.appendChild(showModal)
    showModal.append(modalText, modalImgBox)

    // 모달 내 watch 비디오 기능
    const watchvideo = document.querySelectorAll('.modal-imgbox h5')
    console.log(watchvideo)
    for (let video of watchvideo) {
    video.addEventListener('click', (e) => {
    e.stopPropagation()
    console.log(watchvideo, e.target)

    let videoFrame = document.createElement('div')
    videoFrame.className = 'video-frame'
    videoFrame.innerHTML = `<iframe width="560" height="315" src=${data[i].strYoutube} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` // corb오류 -> video태그가 아니라 iframe 태그를 활용?
   
    showModal.appendChild(videoFrame)
    
})
}
}
}
}

/* 모달윈도우 생성 마운트 함수 - 끝 */

/* 서버 API 가져오기 - 시작*/
async function getServerData() {
    let results = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=egg')
    .then(reponse => reponse.json())
    console.log(results, results.meals)

    // 데이터 보여주기
    for(let i = 0; i < results.meals.length; i++){
    displayElement(results.meals[i])    
}
defalutReults = results.meals
searchResults = [...results.meals]    

/* GetReipe클릭시 모달창 나오는 기능 - 시작 */
/* 문제점 : 반복문의 문제? / 이벤트 위임?
1. 버튼 8개가 전부 호출된다.
2. modal-windwo 8개가 전부 호출된다
3. 서버 data 전부가 한 모달창에 입력이 된다
4. 검색이후 결과에 대한 모달도 따로 작업이 필요하다?
*/
const modalOpenBtn = document.querySelectorAll('.food-text button')
const foodName = document.querySelector('.food-text h3')

    for (const btn of modalOpenBtn){
        btn.addEventListener('click', (e)=> { // 버튼 클릭이벤트
        e.stopPropagation()

        // console.log(e.target.parentElement.firstElementChild.innerText) // 디버깅용
        // e.target.parentElement.parentElement.id
       createModal(defalutReults, e.target.parentElement.parentElement.id)
        //   console.log(clickId)    

        //   모달닫기 버튼 기능
      const modalWindow = document.querySelectorAll('.modal-window')

        if(modalWindow){
            const modalCloseBtn = document.querySelector('.modal-window button') // 이건 한창이 열려있을때는 닫기버튼은 한개이므로 All을 안썼다, 맞는지는 모름..
            modalCloseBtn.addEventListener('click',() => {
            modalWindow[0].remove() 
            console.log(modalWindow) // 왜 Nodelist로 출력이되는거지, queryselectroAll은 원래 유사배열을 가져온다
            }) 
            }
})  
    }    
/* GetReipe클릭시 모달창 나오는 기능 - 끝 */
}
getServerData()
/* 서버 API 가져오기 - 끝 */

/* 검색기능 - 시작 */
const inputWindow = document.querySelector('.search-word input') // 전역변수

function searchFood(e){
  inputKeyword = e.target.value.trim()
  console.log(inputKeyword.toLowerCase())
  
  function findFoods(food){
    if(inputKeyword){
        return food.strMeal.toLowerCase().includes(inputKeyword.toLowerCase())
    }
  }
  searchResults = searchResults.filter(findFoods)

  // 기존 내용 초기화
  foodList.innerHTML = ''
  e.target.value = '' 

  // 검색내용 마운트해서 보여주기
  for(let i = 0; i < searchResults.length; i++){
    displayElement(searchResults[i])
    createModal(searchResults[i])
  }
}
inputWindow.addEventListener('change', searchFood)
/* 검색기능 - 끝 */

/* 무한스크롤 기능 - 시작 */
window.addEventListener('scroll', () => {
    const scrollHeight = Math.max(   // 전체문서 높이 (스크롤이벤트 내부에 있어야 함)
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
    );
    
    if(Math.abs(window.scrollY + document.documentElement.clientHeight - scrollHeight) < 100){
        // console.log('스크롤 바닥') // 디버깅용
        if(inputKeyword) {
            for(let i = 0; i < searchResults.length; i++){
                displayElement(searchResults[i])
              }
        } else{
            for(let i = 0; i < defalutReults.length; i++){
                displayElement(defalutReults[i])
          }
        }
    }
}
)
/* 무한스크롤 기능 - 끝 */

/* 다크모드 - 시작*/
const navbar = document.querySelector('header nav')
const mode = document.querySelector('.mode') // 이벤트 위임
const modeBtns = document.querySelectorAll('.material-symbols-outlined')

mode.addEventListener('click', (event) => {
    document.body.classList.toggle('dark')
    navbar.classList.toggle('dark')

    for (const modeBtn of modeBtns){
        if(modeBtn.classList.contains('show')){
         modeBtn.classList.remove('show')
        }else{
            modeBtn.classList.add('show')
        }
    }
})
/* 다크모드 - 끝*/
