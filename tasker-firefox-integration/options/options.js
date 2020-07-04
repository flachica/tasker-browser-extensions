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
                    <input id="projectnewIndex" type="text" value="newPROJECT"/>
                </td>
                <td>
                    <input id="contextnewIndex" type="text" value="newCONTEXT"/>
                </td>
                <td>
                    <span id="delnewIndex"><a href="#" ><img src="../icons/trash.png" style="width: 12px; heigth: 12px;" /></a></span>
                </td>
            `;
const newItemElementHook = `<tr id="toNewItem" style="display: none"></tr>`

function updateUI() {
    var preferences = window.localStorage.getItem('preferences');
    if (preferences) {
        JSON.parse(preferences).forEach(item => addItem(item.url, item.xpath, item.project, item.context));
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
        var project = trs[i].children[2].children[0].value;
        var context = trs[i].children[3].children[0].value;

        items.push({'url': url, 'xpath': xpath, 'project': project, 'context': context});
    }
    window.localStorage.setItem('preferences', JSON.stringify(items));
    window.close();
}

function cancelShortcut() {
    window.close();
}

function addShortcut() {
    addItem('', '', '', '');
}

function delShortcut() {
    var elem = document.querySelector('#row' + this.id.slice(3));
    elem.parentNode.removeChild(elem);
}

function addItem(url, xpath, project, context) {
    if (checkIfEmpty()) return;

    var el = document.querySelector('#toNewItem');
    let newIndex = el.parentNode.childElementCount - 1;
    var newEl = document.createElement('tr');
    newEl.innerHTML = newItemTemplate.split('newIndex').join(newIndex).split('newURL').join(url).split('newXPATH').join(xpath).split('newPROJECT').join(project).split('newCONTEXT').join(context);
    newEl.id = "row" + newIndex;

    el.parentNode.replaceChild(newEl, el);
    document.querySelector('#' + newEl.id).insertAdjacentHTML("afterend", newItemElementHook);
    document.querySelector('#del' + newIndex).addEventListener('click', delShortcut)
}