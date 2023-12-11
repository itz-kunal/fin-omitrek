let sections=document.querySelectorAll('.secShow')
let willAct=document.querySelectorAll('.willAct')
sections.forEach((i)=>{
    i.style.display='none'
})
sections[0].style.display='block';
function showSection(e){
    sections.forEach((i)=>{
        i.style.display='none';
    })
    sections[e].style.display='block';
    willAct.forEach((i)=>{
        i.classList.remove('active')
    })
    if (window.innerWidth <=1025){
    document.body.classList.add('sidebar-gone')
    document.body.classList.remove('sidebar-show')
    }
    willAct[e].classList.add('active')
}

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Fetch data on DOMContentLoaded
        const response = await fetch('/updatePage');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // Update user information on the dashboard and profile
        updateUserInfo(data.name, data.phone, data.email, data.referralCode, data.registrationDate, data.position, data.address, data.country, data.state, data.userInfo, data.earning, data.balance,data.referrals);

        // Create withdrawal cards
        console.log('hey')
        data.withdrawls.forEach((withdrawData) => {
            createCard(withdrawData.date, withdrawData.amount, withdrawData.status);
        });

        // Create referral cards
        createRefcards(data.referrals);
        console.log(data.coupons)
        createCopuns(data.coupons);
        console.log(data.coupons)
    } catch (error) {
        console.error('Error:', error);
    }
});
let isUpdatingPass=false;
function saveChanges(){
    if(isUpdatingPass){
        updatePassword()
    }else{
        updateProfile()
    }
}
document.getElementById('forupdProfile').addEventListener('click', function() {
    isUpdatingPass = false;
});
document.getElementById('forupdPass').addEventListener('click', function() {
    isUpdatingPass = true;
});


// Function to update user information on the dashboard and profile
function updateUserInfo(name, dphone, demail, refcode, date, leg, adrs, cntry, ste, msg,earning,walletAmount,refs) {
    let position = document.getElementById('position');
    let actregisteredDate = document.getElementById('actregisteredDate');
    let dashboardName = document.getElementById('dashboardName');
    let referralCode = document.getElementById('mypeppyrefurlid');
    let referralUrl = document.getElementById('myrefurlid');
    let firstName = document.getElementById('firstname');
    let lastName = document.getElementById('lastname');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let address = document.getElementById('address');
    let country = document.getElementById('country');
    let state = document.getElementById('state');
    let userInfo = document.getElementById('mbr_intro');
    document.getElementById('balanceW').textContent='₹'+ earning;
    document.getElementById('dashboardEarn').firstChild.textContent ='₹'+ earning;
    document.getElementById('dashboardWallet').innerHTML ='₹'+ walletAmount;

    // Update variables for the dashboard
    position.textContent = leg;
    actregisteredDate.textContent = date;
    dashboardName.textContent = name;
    referralCode.value = refcode;
    referralUrl.value = 'https://omitrek.com?ref='+refcode;

    // Update variables for the profile
    firstName.value = name.split(' ')[0];
    lastName.value = name.split(' ').slice(1).join(' ');
    email.value = demail;
    phone.value = dphone;
    address.value = adrs;
    country.value = cntry;
    state.value = ste;
    userInfo.value = msg;
    document.getElementById('refs').firstChild.textContent=refs.length;
    document.querySelector('#refs span').textContent=refs.filter(obj => obj.name == 1).length;
}

// Function to send withdrawal request
function sendWithdrawalReq(event) {
    event.preventDefault();
    let upiId = document.getElementById('upiId');
    let withdrawAmount = document.getElementById('txamount');

    // Sending withdrawal request
    const withdrawalReqdata = {
        upi: upiId.value,
        amount: withdrawAmount.value
    };

    fetch('/withdrawlsReq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(withdrawalReqdata)
    })
    .then(response => response.json())
    .then(data => alert('Request Sent Successfully'))
    .catch(error => alert('Something went wrong'));
}

// Function to create a card for withdrawals
function createCard(date, amount, status) {
    const cardContainer = document.getElementById('withdrawlcardContainer');
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('col-12', 'col-md-4', 'col-lg-4');

    const pricingDiv = document.createElement('div');
    pricingDiv.classList.add('pricing');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('pricing-title', 'bg-light');
    titleDiv.textContent = date;

    const paddingDiv = document.createElement('div');
    paddingDiv.classList.add('pricing-padding');

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('pricing-price');
    iconSpan.dataset.toggle = 'tooltip';
    iconSpan.title = 'manualpayname';
    iconSpan.dataset.originalTitle = 'manualpayname';
    iconSpan.innerHTML = '<i class="fa fa-handshake fa-fw"></i>';

    const amountDiv = document.createElement('div');
    amountDiv.classList.add('pricing-price');
    const amountHeading = document.createElement('h4');
    amountHeading.textContent = '₹' + amount + 'INR';
    amountDiv.appendChild(amountHeading);

    const statusBadge = document.createElement('span');
    statusBadge.classList.add('badge', 'badge-secondary');
    statusBadge.textContent = status;

    // Append elements to build the card
    paddingDiv.appendChild(iconSpan);
    paddingDiv.appendChild(amountDiv);
    paddingDiv.appendChild(statusBadge);

    pricingDiv.appendChild(titleDiv);
    pricingDiv.appendChild(paddingDiv);

    cardDiv.appendChild(pricingDiv);
    cardContainer.appendChild(cardDiv);
}

// Function to create referral cards
function createRefcards(data) {
    const appendRefdata = document.querySelector('#appendrefdata');
    data.forEach((eachData, index) => {
        console.log(eachData)
        // Create a table row element
        const tableRow = document.createElement('tr');

        // Add data to the table row
        const tableData1 = document.createElement('th');
        tableData1.scope = 'row';
        tableData1.textContent = index + 1;
        tableRow.appendChild(tableData1);

        const tableData2 = document.createElement('td');
    tableData2.setAttribute('data-toggle', 'tooltip');
    tableData2.title = eachData.date;
    tableData2.setAttribute('nowrap', '');
    tableData2.textContent = eachData.date;
    tableRow.appendChild(tableData2);

    const tableData3 = document.createElement('td');
    tableData3.setAttribute('data-toggle', 'tooltip');
    tableData3.title =eachData.name;
    tableData3.textContent = eachData.name;
    tableRow.appendChild(tableData3);

    const tableData4 = document.createElement('td');
    tableData4.setAttribute('data-toggle', 'tooltip');
    tableData4.title = eachData.email;
    tableData4.textContent = eachData.email;
    tableRow.appendChild(tableData4);

    const tableData5 = document.createElement('td');
    tableData5.setAttribute('align', 'center');
    tableData5.setAttribute('nowrap', '');

    const avatarFigure = document.createElement('figure');
    avatarFigure.className = 'avatar mr-2 avatar-sm';

    const avatarImg = document.createElement('img');
    avatarImg.src = '/images/referrallogo.jpg';
    avatarImg.alt = '...';
    avatarFigure.appendChild(avatarImg);

    const avatarIcon = document.createElement('i');
    avatarIcon.className = 'fa fa-id-badge text-success avatar-icon';
    avatarIcon.setAttribute('data-toggle', 'tooltip');
    avatarIcon.title = 'Account - Active';
    avatarFigure.appendChild(avatarIcon);

    tableData5.appendChild(avatarFigure);

    const badgeSpan = document.createElement('span');
    badgeSpan.className = 'badge badge-success';
    badgeSpan.setAttribute('data-toggle', 'tooltip');
    badgeSpan.title = 'Regular - Active';

    const badgeIcon = document.createElement('i');
    badgeIcon.className = 'fa fa-fw fa-check';
    badgeSpan.appendChild(badgeIcon);

    tableData5.appendChild(badgeSpan);
    tableRow.appendChild(tableData5);

    const tableData6 = document.createElement('td');
    tableData6.setAttribute('align', 'center');
    tableData6.setAttribute('nowrap', '');
    tableData6.textContent=eachData.position;
    
    tableRow.appendChild(tableData6);

        // Append the table row to the body
        appendRefdata.appendChild(tableRow);
    });
}

function updateProfile() {
    console.log('hi')
    let firstName = document.getElementById('firstname');
    let lastName = document.getElementById('lastname');
    let email = document.getElementById('email');
    let userInfo = document.getElementById('mbr_intro');
    let address = document.getElementById('address');
    let state = document.getElementById('state');
    let country = document.getElementById('country');
    let phone = document.getElementById('phone');

    let updateProfiledata = {
        name: firstName.value + ' ' + lastName.value,
        phone: phone.value,
        email: email.value,
        address: address.value,
        userInfo: userInfo.value,
        state: state.value,
        country: country.value
    };

    fetch('/updateProfile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateProfiledata)
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response as needed
        console.log(data);
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
    console.log('heyy')
}

function updatePassword() {
    let oldPassword = document.getElementById('password21').value;
    let newPassword = document.getElementById('password12').value;

    fetch('/updatePassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword })
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response as needed
        console.log(data);
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
    console.log('hey')
}

// function buyCopun(price){
//     const paymentWindow = window.open('/payment', '_blank');
//     paymentWindow.onload = function () {
//         paymentWindow.document.getElementById('payableAmount').textContent = '₹' + price;
//     };
//     fetch('/buyCopun', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({copunPrice:price})
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Handle the response as needed
//         console.log(data);
//     })
//     .catch(error => {
//         // Handle errors
//         console.error('Error:', error);
//     });
// }

function buyCopun(price) {
    const paymentWindow = window.open(`/paymentAmount?amount=${price}`, '_blank');
    
    // Wait for the paymentWindow to load
    // paymentWindow.onload = /getElementById('amount').value = '₹' + price;

        // try {
        //     const response = await fetch('/buyCopun', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ copunPrice: price })
        //     });

        //     const data = await response.text();
        //     // Handle the response as needed
        //     console.log(data);

        //     // You can also close the payment window if needed
        //     // paymentWindow.close();
        // } catch (error) {
        //     // Handle errors
        //     console.error('Error:', error);
        // }
    // };
};



// create copuns
function createCopuns(data){
    data.forEach((copunWorth)=>{
        if(copunWorth.status=='approved'){
    // Create a new div element
    var outerDiv = document.createElement('div');
    outerDiv.className = 'col-sm-12 col-md-6 p-4';

    // Create the card div
    var cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    // Create the card body div
    var cardBodyDiv = document.createElement('div');
    cardBodyDiv.className = 'card-body';

    // Create the first flex container
    var flexContainer1 = document.createElement('div');
    flexContainer1.className = 'd-flex justify-content-between';

    // Create the card title element
    var cardTitle = document.createElement('h1');
    cardTitle.className = 'card-title';
    cardTitle.textContent = 'Redeem Coupon';

    // Create the image element
    var imgElement = document.createElement('img');
    imgElement.src = '/images/omilogo.png';
    imgElement.className = 'img-fluid w-25';
    imgElement.alt = '';

    // Append card title and image to the first flex container
    flexContainer1.appendChild(cardTitle);
    flexContainer1.appendChild(imgElement);

    // Create the second flex container
    var flexContainer2 = document.createElement('div');
    flexContainer2.className = 'd-flex justify-content-between mt-4';

    // Create the price and discounted price elements
    var priceElement = document.createElement('p');
    priceElement.className = 'card-text';
    priceElement.innerHTML ='₹'+copunWorth.amount;



    // Append price and order button to the second flex container
    flexContainer2.appendChild(priceElement);
    // flexContainer2.appendChild(orderButton);

    // Append the two flex containers to the card body
    cardBodyDiv.appendChild(flexContainer1);
    cardBodyDiv.appendChild(flexContainer2);

    // Append the card body to the card
    cardDiv.appendChild(cardBodyDiv);

    // Append the card to the outer div
    outerDiv.appendChild(cardDiv);

    // Append the outer div to the body
    document.getElementById('copunCtnr').appendChild(outerDiv);
        }
 })
}
