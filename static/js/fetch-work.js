document.addEventListener("DOMContentLoaded", ()=>{
    fetch("/get/results/")
    .then((res)=> { return res.json()})
    .then((Resultsdata) =>{
        console.log(Resultsdata)
        Resultsdata.Resultsdata.forEach(row =>{
            handleInformation(row, "results")
        })
    })
    fetch("/get/std_affairs/")
    .then((res)=> { return res.json()})
    .then((stdAffairsData) =>{
        console.log(stdAffairsData)
        stdAffairsData.stdAffairsData.forEach(row =>{
            handleInformation(row, "stdAffairs")
        })
    })
    
})
function handleInformation(row, className){
    let tableRow = `
        <tr>
            <th class="row" style="margin-left:1%">${row.query_id}</th>
            <td>${row.std_no}</td>
            <td>${row.module_name}</td>
            <td>${row.query_type}</td>
            <td>${row.datetime}</td>
            <td>${row.query_status}</td>
        </tr>
    `
    $(document.getElementsByClassName("tr-rows-"+className)).append(tableRow)
    
}