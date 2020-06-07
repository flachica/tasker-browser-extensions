document.addEventListener('DOMContentLoaded', updateUI);

document.querySelector('#save').addEventListener('click', saveShortcut);
document.querySelector('#cancel').addEventListener('click', cancelShortcut);
document.querySelector('#addItem').addEventListener('click', addShortcut);

const newItemTemplate = `
                <td>
                    <input id="urlnewIndex" type="text" value="newURL"/>
                </td>
                <td>
                    <input id="xpathnewIndex" type="text" value="newXPATH"/>
                </td>
                <td>
                    <span id="delnewIndex"><i class="fas fa-trash"></i></span>
                </td>
            `;
const newItemElementHook = `<tr id="toNewItem" style="display: none"></tr>`

function updateUI() {
    var preferences = window.localStorage.getItem('preferences');
    if (preferences) {
        JSON.parse(preferences).forEach(item => addItem(item.url, item.xpath));
    }
}

function checkIfEmpty() {
    var trs = document.querySelectorAll('tbody tr'), i;
    for(i = 0; i < trs.length - 2; ++i) {
        if (trs[i].children[0].children[0].value == "") return true;
        if (trs[i].children[1].children[0].value == "") return true;
    }
}

function saveShortcut() {
    if (checkIfEmpty()) return;
    var trs = document.querySelectorAll('tbody tr'), i;
    var items = [];
    for(i = 0; i < trs.length - 2; ++i) {
        var url = trs[i].children[0].children[0].value;
        var xpath = trs[i].children[1].children[0].value;

        items.push({'url': url, 'xpath': xpath});
    }
    window.localStorage.setItem('preferences', JSON.stringify(items));
    window.close();
}

function cancelShortcut() {
    window.close();
}

function addShortcut() {
    addItem('', '');
}

function delShortcut() {
    var elem = document.querySelector('#row' + this.id.slice(3));
    elem.parentNode.removeChild(elem);
}

function addItem(url, xpath) {
    if (checkIfEmpty()) return;

    var el = document.querySelector('#toNewItem');
    let newIndex = el.parentNode.childElementCount - 1;
    var newEl = document.createElement('tr');
    newEl.innerHTML = newItemTemplate.split('newIndex').join(newIndex).split('newURL').join(url).split('newXPATH').join(xpath);
    newEl.id = "row" + newIndex;

    el.parentNode.replaceChild(newEl, el);
    document.querySelector('#' + newEl.id).insertAdjacentHTML("afterend", newItemElementHook);
    document.querySelector('#del' + newIndex).addEventListener('click', delShortcut)
}