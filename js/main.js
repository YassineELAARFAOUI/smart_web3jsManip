import { ABI,smartContractAddr } from "../js/config.js";
//////////////////////
let amountDiv = document.getElementById("amountDiv")
let amountInput = document.getElementById("amountInput")
amountInput.addEventListener("input",()=>{
    if(!parseInt(amountInput.value))
        amountDiv.innerText="0 ETH"
    else
        amountDiv.innerText = parseFloat(amountInput.value)/10**18 +" ETH"
})
//  execution  des taches
let web3;
let yourAddress;
const init = async ()=>{
    connectMetaMaskBtn.addEventListener("click", async ()=>{
        try{
            //demande de connection 
            await window.ethereum.request({method:"eth_requestAccounts"});
            // recuperation d'addresse actuel 
            yourAddress = await window.ethereum.request({method:"eth_accounts"});
            //ajouter element aux html element
            yourAddressElm.innerText = yourAddress;
            //la  partie de configiration 
            web3 = new Web3(window.ethereum);
            let contract = new web3.eth.Contract(ABI,smartContractAddr);
            //faire appelle status
            let status = await contract.methods.status().call();
            statusElement.innerText=status;
             //faire appelle de receipient
             let receipient = await contract.methods.receipient().call();
             receipientElement.innerText=receipient;
             //faire l'appelle de seuil
             let seuil = await contract.methods.seuil().call();
            seuilElement.innerText =  parseFloat(seuil)/10**18 +" ETH";
           
            //retourner des informations sur le core de smartContract like blance value
            let blance = await web3.eth.getBalance(smartContractAddr);
            blanceElement.innerText = parseFloat(blance)/10**18 +" ETH";

            ///////////////////////
            // donate operation
          
            donateBtn.addEventListener("click",async()=>{
                try {
                   let result= await contract.methods.donate().send({
                        from : yourAddress[0],
                        value: amountInput.value
                    })  
                    console.log(result);
                    alert("donate success"); 
                } catch (error) {
                   console.log(error); 
                }
            });
            
            //recuperation des elements de tableau 
              //recuperttion de length 
              let mytbody = document.getElementById("mytbody");
              let donaterEnJs = {};
              let nombreDonaters = await contract.methods.nbr_donations().call();
              for(let i = 0; i < nombreDonaters;i++){
                let donaters = await contract.methods.donaters(i).call();
                let donations = await contract.methods.donations(donaters).call();
                donaterEnJs[donaters]=donations;
                let newtr = document.createElement("tr");
                let newtd = document.createElement("td");
                let newth = document.createElement("th");
                newtd.textContent = donaters;
                newth.textContent =parseFloat(donations)/10**18 +" ETH"
                newtr.appendChild(newtd);
                newtr.appendChild(newth);
                mytbody.appendChild(newtr);
              }

        }catch(e){
            console.log(e);
        }
    })  
}
init();