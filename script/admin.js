document.addEventListener('DOMContentLoaded', async function () {
    const response = await fetch('/updAdmin');
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    createAdminCards(data)
    // console.log(data)
    data.forEach((i) => {
        console.log(i)
        i.coupons.forEach((ic) => {
            if (ic.status == 'pending') {
                createCards(i, ic, 1)
                console.log('working', ic, i)
            }
        })
        i.withdrawls.forEach(iw => {
            console.log('hehe', iw)
            if (iw.status == 'Processing') {
                createCards(i, iw, 0)
                console.log('hiha', iw)
            }
        })
    })
})

function createCards(data, payment, i) {
    // Create a new table row element
    const tableRow = document.createElement('tr');

    // Create a table header cell with scope "row"
    const th = document.createElement('th');
    th.setAttribute('scope', 'row');
    th.textContent = payment._id;
    tableRow.appendChild(th);

    // Create table data cells with the specified data
    const td1 = document.createElement('td');
    td1.textContent = payment.date;
    td1.setAttribute('data-toggle', 'tooltip');
    td1.setAttribute('title', payment.date);
    td1.setAttribute('data-original-title', payment.date);
    tableRow.appendChild(td1);

    const td2 = document.createElement('td');
    td2.textContent = data.name;
    td2.setAttribute('data-toggle', 'tooltip');
    td2.setAttribute('title', 'rr rr');
    td2.setAttribute('data-original-title', 'rr rr');
    tableRow.appendChild(td2);

    const td3 = document.createElement('td');
    td3.textContent = data.phone;
    td3.setAttribute('data-toggle', 'tooltip');
    td3.setAttribute('title', data.email);
    td3.setAttribute('data-original-title', data.email);
    tableRow.appendChild(td3);
    
    const upitd = document.createElement('td');
    upitd.textContent = payment.upi;
    upitd.setAttribute('data-toggle', 'tooltip');
    upitd.setAttribute('title', payment.upi);
    upitd.setAttribute('data-original-title', payment.upi);
    tableRow.appendChild(upitd);

    const td4 = document.createElement('td');
    td4.textContent = payment.amount;
    tableRow.appendChild(td4);

    const td5 = document.createElement('td');
    td5.setAttribute('align', 'center');
    td5.setAttribute('nowrap', '');

    const divProcessing = document.createElement('div');
    divProcessing.className = 'paymentStat';
    divProcessing.textContent = 'Processing';

    td5.appendChild(divProcessing);

    const divDone = document.createElement('div');
    divDone.className = 'paymentStat';
    divDone.textContent = 'Approve';
    if (i == 0) {
        divDone.onclick = function () {
            changeStat('withdrawls', this);
        };
    } else if (i == 1) {
        divDone.onclick = function () {
            changeStat('coupons', this);
        };
    }
    td5.appendChild(divDone);

    tableRow.appendChild(td5);

    // Append the table row to the table (replace 'tableId' with the ID of your table)
    document.querySelectorAll('.Paymentdata')[i].appendChild(tableRow);

}

async function changeStat(findIn, element) {
    const transitionIdctnr = element.parentNode;
    console.log('calling',transitionIdctnr)
    const data = {
        findIn: findIn,
        Id: transitionIdctnr.parentNode.firstChild.textContent,
        stat: 'approved'
    }
    console.log(data.Id)
    fetch('/updStat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    transitionIdctnr.querySelector('.paymentStat').style.display = 'none'
}

function createAdminCards(data) {
    // Create a new table row element
    data.forEach((user, index) => {
        const tableRow = document.createElement('tr');

        // Create a table header cell with scope "row"
        const th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.textContent = index + 1;
        tableRow.appendChild(th);

        // Create table data cells with the specified data
        const td1 = document.createElement('td');
        td1.textContent = user.name;
        td1.setAttribute('data-toggle', 'tooltip');
        td1.setAttribute('title', user.name);
        td1.setAttribute('data-original-title', user.name);
        tableRow.appendChild(td1);

        const td2 = document.createElement('td');
        td2.textContent = user.phone;
        td2.setAttribute('data-toggle', 'tooltip');
        td2.setAttribute('title', user.phone);
        td2.setAttribute('data-original-title', user.phone);
        tableRow.appendChild(td2);

        const td3 = document.createElement('td');
        td3.textContent = user.email;
        td3.setAttribute('data-toggle', 'tooltip');
        td3.setAttribute('title', user.email);
        td3.setAttribute('data-original-title', user.email);
        tableRow.appendChild(td3);
        
        const td4 = document.createElement('td');
        td4.textContent = user.earning;
        td4.setAttribute('data-toggle', 'tooltip');
        td4.setAttribute('title', user.earning);
        td4.setAttribute('data-original-title', user.earning);
        tableRow.appendChild(td4);

        // const td4 = document.createElement('td');
        // td4.textContent = payment.amount;
        // tableRow.appendChild(td4);
        const td5 = document.createElement('td');
        td5.setAttribute('align', 'center');
        td5.setAttribute('nowrap', '');

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

        td5.appendChild(avatarFigure);

        const badgeSpan = document.createElement('span');
        badgeSpan.className = 'badge badge-success';
        badgeSpan.setAttribute('data-toggle', 'tooltip');
        badgeSpan.title = 'Regular - Active';

        const badgeIcon = document.createElement('i');
        badgeIcon.className = 'fa fa-fw fa-check';
        badgeSpan.appendChild(badgeIcon);

        td5.appendChild(badgeSpan);

        tableRow.appendChild(td5);

        // Append the table row to the table (replace 'tableId' with the ID of your table)
        // document.getElementById('addAdmindata').appendChild(tableRow);
        document.querySelector('#addAdmindata').appendChild(tableRow);
    })
}