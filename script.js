const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length]");
const PasswordDispaly = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copymsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=chckbox]");
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
setIndicator("#ccc")

//set password length
function handleSlider (){               //reflects passwordLength in UI
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%" 
    //to change color of slider according to password length
}

function setIndicator (color){              //sets color according to input
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger (min,max){
    return Math.floor(Math.random() * (max - min)) + min;//floor does roundoff number
}

function generateRandomNumber () {
    return getRndInteger(0,9)
}

function generateLowerCase () {
    return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase () {
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol () {
    const randNum = getRndInteger(0,symbol.length);
    return symbol.charAt(randNum);
}

function calStrength () {       //check which checkboxes are checked
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upperCaseCheck.checked){hasUpper = true;}
    if(lowerCaseCheck.checked){hasLower = true;}
    if(numbersCheck.checked){hasNum=true;}
    if(symbolsCheck.checked){hasSym=true;}

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0f0");   //green
    }else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >=6
    ) {
        setIndicator("#ff0");   //yellow
    } else {
        setIndicator("#f00");   //red
    }
}

async function copyContent () {     //copies content to clipboard
    try{
        await navigator.clipboard.writeText(PasswordDispaly.value);//keyboard api to copy text to clipboard
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed"
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout(() =>{
        copyMsg.classList.remove("active");
    }, 2000 )
}

function shufflePassword (array) {
    //Fisher Yates Method to shuffle an array
    for(let i = array.length - 1; i > 0; i--){
        const j =  Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str
}

function handleCheckBoxChange () {  
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach ((checkbox) =>{
    checkbox.addEventListener('change' , handleCheckBoxChange); //checks how many checkboxes are checked
})  

inputSlider.addEventListener('input' , (e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() =>{
    if(PasswordDispaly.value){  //or if(passwordLength >0)
        copyContent();
    }
})

generateBtn.addEventListener('click',() =>{
    //none of the checkbox are selected
    if(checkCount == 0){
        return;
    }
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //let's start the journey to find new password
    
    console.log("Starting the Journey");

    //remove old passsword
    password = "";

    //let's put the stuffs requested by checkboxes
    // if(upperCaseCheck.checked){             //if uppercase checkbox is checked
    //     password += generateUpperCase();
    // }
    // if(lowerCaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(upperCaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowerCaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsory addition
    for(let i=0;i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("Compulsory Addition Done");

    //remaining addition
    for(let i=0;i<(passwordLength - funcArr.length); i++){
        let randomIndex = getRndInteger(0 , funcArr.length);
        console.log("randomIndex " + randomIndex);
        password += funcArr[randomIndex]();
    }
    console.log("Remaining Addition Done");

    //shuffle the password randomly
    password = shufflePassword(Array.from(password));
    console.log("Shuffling Done");

    //show in UI
    PasswordDispaly.value = password;
    console.log("UI Addition Done");

    //calculate strength
    calStrength();
});