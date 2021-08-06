let queryValues = []
function setUpTabs(){
    document.querySelectorAll(".btn-tab").forEach(button =>{
        button.addEventListener("click",()=>{
            const SIDEBAR = button.parentElement;
            const PAGETABS = SIDEBAR.parentElement;
            const TABNUMBER  = button.dataset.forTab;
            const TabtoActivate = PAGETABS.querySelector(`.data-tabs[data-tab ="${TABNUMBER}"]`)
            SIDEBAR.querySelectorAll(".btn-tab").forEach(button=>{
                button.classList.remove("btn-active")
            })
            PAGETABS.querySelectorAll(".data-tabs").forEach(tabs =>{
                tabs.classList.remove("data-tabs-active")
            })
            button.classList.add("btn-active")
            TabtoActivate.classList.add("data-tabs-active")
        })
    })
}
function addValues(queryValues){
    document.querySelectorAll(".add").forEach(Element =>{
        const parentDiv = Element.parentElement;
        const queryCourse = parentDiv.parentElement.querySelector(".name").querySelector("h3").textContent;
        const scnSec = parentDiv.parentElement.parentElement.querySelector(".scn-sec")
        let value = parseInt(parentDiv.querySelector(".number").querySelector("input").value);
        Element.querySelectorAll("button").forEach(button =>{
            button.addEventListener("click",()=>{
                $(scnSec).fadeIn(200, ()=>{
                    $(this).show()
                })
                value = value + 1
                $(parentDiv.querySelector(".number")).empty() && $(parentDiv.querySelector(".number")).append('<input type="text" value="'+ value +'" name="query_numbers">')
            })
        })
        $(scnSec.querySelector(".form-control")).keydown(()=>{
            scnSec.querySelectorAll("input[type='radio']").forEach(radio =>{
                if(radio.checked === true){
                  radio.checked = false
                }
            })
        })
        scnSec.querySelector("button").addEventListener("click",()=>{
            scnSec.querySelectorAll("input[type='radio']").forEach(radio =>{
                if(radio.checked === true){
                    let queryVal = radio.value
                    let query = queryCourse+" : "+queryVal
                    queryValues.push(query)
                }
            })
            queryClass = scnSec.querySelector(".input-group").querySelector("input").value;
            if (queryClass.length > 0){
            let queryInput = queryCourse+" : "+queryClass
            queryValues.push(queryInput)
            }
            $(scnSec).fadeOut(200,()=>{
                $(this).hide()
            })
        })
    })
}
//SEND WORK
function sendWork(){
    let course_objs = wrapWorkSHC()
    let SHCValues = new Object;
    SHCValues.queries = course_objs,
    SHCValues.no_of_queries= queryValues.length,
    SHCValues.range_of_queries = queryValues
    SHCValues = JSON.stringify(SHCValues)
    fetch("/save/work/SHC", {
        method:"POST",
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Content-type":"application/json"
        },
        body:SHCValues
    })
    .then((res) => res.json())
    .then((data)=> {
        if (data.data === "success"){
            location.reload()
        }
    })
}

function wrapWorkSHC(){
    let course_values = {}  
    let TAB2= document.querySelector("button[name ='SHCWork']").parentElement.parentElement;
    let TAB1 = TAB2.parentElement.querySelector("#tabs-2");
    TAB1.querySelector(".container").querySelectorAll(".q_row").forEach(row =>{
        let name = row.querySelector(".fst-sec").querySelector(".name").querySelector("h3").textContent;
        let val = row.querySelector(".fst-sec").querySelector(".mth-ops").querySelector(".number").querySelector("input").value;
        if(val > 0){
        course_values[name] = val;
        }
    })
    TAB2.querySelector(".container").querySelectorAll(".q_row").forEach(row =>{
        let name = row.querySelector(".fst-sec").querySelector(".name").querySelector("h3").textContent;
        let val = row.querySelector(".fst-sec").querySelector(".mth-ops").querySelector(".number").querySelector("input").value;
        if (val > 0){
            course_values[name] = val;
        }
    })
    return course_values
}
function hideOptions(){
    $(".scn-sec").hide()
}
function validate(){
    let firstPassword =$(document.querySelector("form[id='change_password']").querySelector("input[id='scn_pass']")).val()
    let secondPassword =$(document.querySelector("form[id='change_password']").querySelector("input[id='thrd_pass']")).val()
    if (firstPassword === secondPassword){
        return true
    }
    else{
     $(".errPassMsg").fadeIn(200,function(){
         this.show()
     })   
     return false
    }
}
function checkPassword(){
    let template = `
    <form action="/change/password/" method="POST" id="change_password">
    <div class="form-group">
        <label for="username">Username</label>
        <input type="text" class="form-control" id="username" name="new_username">
    </div>
    <div class="form-group">
        <label for="scn_pass">Password</label>
        <input type="password" class="form-control" id="scn_pass" name ="new_password">
    </div>
     <div class="form-group">
        <label for="thrd_pass">Confirm Password</label>
        <input type="password" class="form-control" id="thrd_pass">
        <small class="form-text text-danger errPassMsg">Entered Password NOT matching</small>
    </div>
    <button type="submit" class="btn btn-danger" id="errPassBtn">Submit</button>
</form>
`
    let password = $(document.querySelector("input[id='admin_password']")).val()
    fetch("/check/user/", {
        method:"POST",
        headers:{
        "Accept":"application/json, text/plain, */*",
        "Content-type":"application/json"
        },
        body:JSON.stringify({password:password})
        })
        .then((res) => res.json())
        .then((data)=> {
            if (data.data === "success"){
                $(document.querySelector(".c-p-m")).empty()
                $(document.querySelector(".c-p-m")).append(template) && $(".errPassMsg").hide()
                document.querySelector("form[id='change_password']").addEventListener("submit", e=>{
                    if (!validate()){
                        e.preventDefault()
                    }
                })
                
            }
        })
}
function getWork(){
    fetch("/get/work/")
    .then((res)=> { return res.json()})
    .then((data) =>{
        data.data.forEach(row =>{
            handleWork(row)
        })
    })
}
function handleWork(row){
    let details = JSON.parse(row.detailed_queries).details
    const OPEN_TAG ="<ul class='details"+row.query_id+" listed overflow-auto'>"
    const CLOSING_TAG ="</ul>" 
    let tableRow = `
        <tr>
            <th class="row">${row.date_made}</th>
            <td>${row.no_of_queries}</td>
            <td>${OPEN_TAG} ${CLOSING_TAG} </td>
        </tr>
    `
    $(document.getElementsByClassName("tr-rows")).append(tableRow)
    details.forEach(item =>{
        if (item != ""){
            $(document.getElementsByClassName("details"+row.query_id)).append(`<li>${item}</li>`)
        }
    })
}
document.addEventListener("DOMContentLoaded",()=>{
    setUpTabs()
    hideOptions()
    addValues(queryValues)
    
})
$("document").ready(function (){
    $("#tabs").tabs()
})