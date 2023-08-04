/* 전역변수 */
const wrap = document.querySelector('.wrap')  // 컨텐츠 전체를 감싸고 있는 wrap
const foodList = document.querySelector('.foodlist')  // 카드이미지 보이는 section

/* 전역변수 - 입력창에 검색어가 없을 경우 - 시작 */
const isEmpty = (inputKeyword) => { 
    if(
        typeof inputKeyword === 'undefined' ||  // undefinde 타입
        inputKeyword === null || // null 값
        inputKeyword === '' || // 빈 문자열 
        inputKeyword === 'null' || // 문자열 null
        inputKeyword.length === 0 || // 빈 배열
        (typeof inputKeyword === 'object' && !Object.keys(inputKeyword).length) // 빈 객체 / Object.keys(obj) 
    ) {
        return true
    }
    else return false
}
/* 입력창에 검색어가 없을경우 - 끝 */

let inputKeyword = null  // 검색어 업데이트를 위한 전역변수
let defalutReults = []  // 처음에 보이는 화면의 데이터를 담는 변수
let searchResults = []  // 검색내용 업데이트를 위한 전역변수
let updateResult = [] // 검색내용 업데이트를 위한 전역변수 2 / 뭔가 잘못된듯.. 2개가 필요할거같지는 않은데
let newResult = []  // 모달윈도우용..

/* food리스트 생성 마운트 함수  - 시작 */
function displayElement(data){
    for (let i = 0; i < data.length; i++) {
    let foodDiv = document.createElement('div')
    foodDiv.className = 'food-card'
    foodDiv.id = `${data[i].idMeal}`
    
    let imgFrame = document.createElement('div')
    imgFrame.className = 'img-frame'

    let foodImg = document.createElement('img')
    foodImg.className = 'food-img'
    foodImg.src = data[i].strMealThumb
    
    let foodText = document.createElement('div')
    foodText.className = 'food-text'
    foodText.innerHTML = `<h3>${data[i].strMeal}</h3> <br/> <button class=modal-open>Get Recipe</button>`

    foodList.appendChild(foodDiv)
    foodDiv.append(imgFrame, foodText)
    imgFrame.appendChild(foodImg)
}
}
/* food리스트 생성 마운트 함수  - 끝 */

/* 모달윈도우 생성 마운트 함수 - 시작 */
function createModal(serverData, dataId){
  for(let i =0; i < serverData.length; i++){  
  if(serverData[i].idMeal == dataId){
let showModal = document.createElement('div')
showModal.className = 'modal-window'
showModal.innerHTML = `<button class='modal-close'>X</button>`
     
let modalText = document.createElement('div')
modalText.className = 'modal-text'
modalText.innerHTML = `<h3>${serverData[i].strMeal}</h3> <br/> <h4>${serverData[i].strCategory}</h4> <br/> <h5>Instructions:</h5> <br/> <p>${serverData[i].strInstructions}</p>` 

let modalImgBox = document.createElement('div')
modalImgBox.className = 'modal-imgbox'
modalImgBox.innerHTML = `<img src=${serverData[i].strMealThumb} class ='modal-img' alt='thumbnailImg'> <br/> <h5 class='watch-video'>Watch Video</h5>`

wrap.appendChild(showModal)
showModal.append(modalText, modalImgBox)

// 모달 내 watch 비디오 기능
const watchvideoBtns = document.querySelectorAll('.modal-imgbox h5')
for (const btn of watchvideoBtns){
    btn.addEventListener('click', (event) => { // foodList로 이벤트 위임하니까 console.log(event.target)자체가 먹지를 않는다, 모달 오픈 버튼에서 이미 사용해서 그런가? 
    console.log(event.target)

 let videoFrame = document.createElement('div')
 videoFrame.className = 'video-frame'
 videoFrame.innerHTML = `<iframe id="player" type="text/html" width="550" height="360" src=${serverData[i].strYoutube} frameborder="0"></iframe>`
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
    // console.log(results, results.meals) // 디버깅용
    // 데이터 보여주기
     displayElement(results.meals)    

    // 서버데이터 변수 업데이트
     defalutReults = results.meals
     searchResults = [...results.meals]    

/* GetReipe클릭시 모달창 나오는 기능 - 시작 */
// const modalOpenBtn = document.querySelectorAll('.food-text button')
        foodList.addEventListener('click', (e)=> { // 버튼 클릭이벤트
        if(e.target.className = 'modal-open') {   
        let dataId = e.target.parentElement.parentElement.id
            createModal(defalutReults, dataId)
        
            //   모달닫기 버튼 기능
            const modalWindows = document.querySelectorAll('.modal-window')
            for(const modalWindow of modalWindows){ 
                console.log(modalWindow)
            if(modalWindow){ 
                const modalCloseBtn = document.querySelector('.modal-window button') // 이건 한창이 열려있을때는 닫기버튼은 한개이므로 All을 안썼다, 맞는지는 모름..                
                modalCloseBtn.addEventListener('click',(e) => {
                e.stopPropagation()
                modalWindow.remove() 
            }) 
                }
            }    
        }
        })
/* GetReipe클릭시 모달창 나오는 기능 - 끝 */
}
getServerData()
/* 서버 API 가져오기 - 끝 */

/* 검색기능 - 시작 */
const inputWindow = document.querySelector('.search-word input') // 전역변수
// 재검색할때는 이미 검색된 화면 기준에서 검색을 하기 떄문에 아이템이 나오지 않는다 => 해결이 됐는데 왜 된건지 모르겠다 뭘 한게없는데?
function findFoods(food){
    if(inputKeyword){
        return food.strMeal.toLowerCase().includes(inputKeyword.toLowerCase())
    } else if(isEmpty) return food
  }

function searchFood(e){
  e.stopPropagation() 
  inputKeyword = e.target.value.trim()
  console.log(inputKeyword.toLowerCase())
  updateResult = searchResults.filter(findFoods)

  // 기존 내용 초기화
  foodList.innerHTML = ''
  e.target.value = '' 

  // 검색내용 마운트해서 보여주기
    displayElement(updateResult)
}
inputWindow.addEventListener('change', searchFood)
/* 검색창이 비어있을 때 enter키 입력시 처음화면으로 보여준다 - 시작 */
inputWindow.addEventListener('keydown', (e) => { 
    // keydown으로 하니까 해결됨, keyup은 change와 충돌함. 
    // keydown은 누르는 순간 인식해서 먼저 발생하고, change는 나중에 입력되므로 덮어씌워진다
    console.log(e.keyCode)
    if(e.keyCode == 13) {
        console.log(e.keyCode) 
        // e.stopPropagation()
        foodList.innerHTML = ''
        displayElement(searchResults)
}
})
/* 검색창이 비어있을 때 enter키 입력시 처음화면으로 보여준다 - 끝 */

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
        if(inputKeyword) { displayElement(updateResult)} 
        else if(isEmpty()) { displayElement(searchResults)}
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
