const cl = console.log;

const inputform = document.getElementById('inputform')
const title = document.getElementById('title')
const body = document.getElementById('body')
const UserId = document.getElementById('UserId')
const Addpostbtn = document.getElementById('Addpostbtn')
const Updatepostbtn = document.getElementById('Updatepost')
const postcontainer = document.getElementById('postcontainer')
const spinner = document.getElementById('spinner')



let postArr =[]

let Base_Url = 'https://jsonplaceholder.typicode.com'




function snackbar(msg,icon){
  swal.fire({
    title : msg,
    icon:icon,
    timer :3000
  })
}

function fetchposts(){
  spinner.classList.remove('d-none')
  let Post_url =`${Base_Url}/posts`

  let xhr = new XMLHttpRequest()

  xhr.open('GET',Post_url)

  xhr.send(null)
  
  xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status <= 299){
      let postArr = JSON.parse(xhr.response)

      createCard(postArr.reverse())

    }
    
    spinner.classList.add('d-none')


  }

  spinner.classList.add('d-none')



}

fetchposts()

function createCard(arr){
  let result =``

  arr.forEach(ele => {
    result+=`<div class="col-md-3 my-4" id='${ele.id}'>
					<div class="card h-100">
						<div class="card-header">
							<h2>${ele.title}</h2>
						</div>
						<div class="card-body">
							<p>${ele.body}</p>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<button class="btn btn-sm btn-primary" id="editBtn" onclick ='onEdit(this)'>Edit</button>
							<button class="btn btn-sm btn-danger" id="Deletebtn" onclick ='onRemove(this)'>Delete</button>

						</div>
					</div>
				</div>`
  });
  
  postcontainer.innerHTML = result


  
}


function onsubmit(ele){
  spinner.classList.remove('d-none')

  ele.preventDefault()

  let newObj ={
    title : title.value,
    body : body.value,
    userId : UserId.value,
  }


  let post_Url =`${Base_Url}/posts`

  let xhr = new XMLHttpRequest()

  xhr.open('POST',post_Url)

  xhr.send(JSON.stringify(newObj))

  xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status <= 299){
      let response = JSON.parse(xhr.response)

      Addpost(newObj,response)
    }
   
    spinner.classList.add('d-none')


  }


  spinner.classList.add('d-none')

}


function Addpost(newObj,response){

  let div = document.createElement('div')
  div.className = 'col-md-3 my-4'
  div.id = response.id

  div.innerHTML =`<div class="card h-100">
						<div class="card-header">
							<h2>${newObj.title}</h2>
						</div>
						<div class="card-body">
							<p>${newObj.body}</p>
						</div>
						<div class="card-footer d-flex justify-content-between">
							<button class="btn btn-sm btn-primary" id="editBtn" onclick ='onEdit(this)'>Edit</button>
							<button class="btn btn-sm btn-danger" id="Deletebtn" onclick ='onRemove(this)'>Delete</button>

						</div>
					</div>` 


  postcontainer.prepend(div)

  inputform.reset()
  spinner.classList.add('d-none')

  snackbar(`The New Post ${response.id} is added Successfully!!!`,'success')

}



function onEdit(ele){
  spinner.classList.remove('d-none')


  let editId = ele.closest('.col-md-3').id

  localStorage.setItem('EditId',editId)

  let getUrl = `${Base_Url}/posts/${editId}`

  let xhr = new XMLHttpRequest()
  xhr.open('GET',getUrl)

  xhr.send(null)

  xhr.onload = function(){
    if(xhr.status >=200 && xhr.status <=299){
     let editObj = JSON.parse(xhr.response)

     title.value = editObj.title
     body.value = editObj.body
     UserId.value = editObj.userId

     Addpostbtn.classList.add('d-none')
     Updatepostbtn.classList.remove('d-none')


    }


  spinner.classList.add('d-none')

  }

  spinner.classList.add('d-none')


}

function onupdate(){

  spinner.classList.remove('d-none')

  let updateId = localStorage.getItem('EditId')

  let updateObj  = { 
    title : title.value,
    body : body.value,
    userId : UserId.value,
    id : updateId
  }

  let PUT_Url = `${Base_Url}/posts/${updateId}`

  let xhr = new XMLHttpRequest()

  xhr.open('PUT',PUT_Url)

  xhr.send(JSON.stringify(updateObj))

  xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status <=299){

      let div = document.getElementById(updateId)

      let h2 = div.querySelector('.card-header h2')

      h2.innerText = updateObj.title

      let p = div.querySelector('.card-body p')
      p.innerText = updateObj.body


      inputform.reset()
      Addpostbtn.classList.remove('d-none')
     Updatepostbtn.classList.add('d-none')
     snackbar(`The Post ${updateId} is Updated Successfully!!!`,'success')

    }




    spinner.classList.add('d-none')

  }

  spinner.classList.add('d-none')


}


function onRemove(ele){
  spinner.classList.add('d-none')

  let removeId = ele.closest('.col-md-3').id
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      
      let Delete_url = `${Base_Url}/posts/${removeId}`

      let xhr = new XMLHttpRequest()

      xhr.open('DELETE',Delete_url)

      xhr.send(null)

      xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <=299){
          ele.closest('.col-md-3').remove()


          snackbar(`The  Post ${removeId} is Deleted Successfully!!!`,'success')

        }

        spinner.classList.add('d-none')
        
      }
    }
  });
  spinner.classList.add('d-none')

}






inputform.addEventListener('submit',onsubmit)
Updatepostbtn.addEventListener('click',onupdate)