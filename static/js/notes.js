function onEdit(){
    document.querySelectorAll(".buttons-inline").forEach(btnInline =>{
        btnInline.querySelector("button[value='Edit']").addEventListener("click",()=>{
            ancestorElement = btnInline.parentElement
            let noteID = document.querySelector("button[value='Edit']").id
            let noteName = ancestorElement.querySelector("h5").textContent
            let noteBody =ancestorElement.querySelector("p").textContent
            updateTextField(noteBody,noteName, noteID)
        })
    })
    
} 
function showConfirmation(id){
    document.querySelector("#over-lay").classList.add("active")    
    document.querySelector(".model").classList.add("active")
    let modelBody = document.querySelector(".model-body")
    let ids = {}
    modelBody.querySelectorAll("button").forEach(btn =>{
        btn.addEventListener("click",()=>{
            if (btn.value === "confirm"){
                ids.note_id = id
                ids = JSON.stringify(ids)
                fetch("/delete/task/", {
                    method:"POST",
                    headers:{
                    "Accept":"application/json, text/plain, */*",
                    "Content-type":"application/json"
                    },
                    body:ids
                })
                .then((res) => res.json())
                .then((data)=> {
                    if (data.data === "success"){
                        location.reload()
                    }
                })
            }
            else{
                hideConfirmation()
            }
        })
    })
}

function hideConfirmation(){
    document.querySelector("#over-lay").classList.remove("active")    
    document.querySelector(".model").classList.remove("active")
}
function updateTextField(noteBody, noteName, noteID){
    document.querySelector("form[method = 'POST']").action = "/update/"+noteID+"/task/"
    $(document.querySelector(".edit-note").querySelector("h6")).replaceWith(" <h6><i>"+noteName+"</i></h6>")
    $(document.querySelector(".edit-note").querySelector(".text-area").querySelector("textarea")).replaceWith('<textarea name="new_note" id="" class="form-control" cols="50" rows="10">'+noteBody+'</textarea>')
    
}
document.addEventListener("DOMContentLoaded",()=>{
    onEdit()
})