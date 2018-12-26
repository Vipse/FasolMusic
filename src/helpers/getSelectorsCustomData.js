export function getSelectorValues(selector, englishMode) {
    if (selector && selector.length)
        return selector.map(item => englishMode ? item.nameEng : item.nameRus);
    else return [];
}

export function getSelectedIDs(selector, selectedValues, englishMode = false) {
    if (selectedValues && selectedValues.length && selector && selector.length) {
        const selectorValues = getSelectorValues(selector, englishMode);
        if (!Array.isArray(selectedValues)) return [selector[selectorValues.indexOf(selectedValues)].id];
        else return selectedValues.map(item => selector[selectorValues.indexOf(item)].id);
    }
    else return [];
}

export function getSelectorNestedObjs(selector, parentsArr, englishMode = false) {
    let targetChild = selector;
    if (selector && selector.length && parentsArr && parentsArr.length)
        if (parentsArr.every(parent => {
            return targetChild.some(item => {
                if (item.connect && item.connect.length && (englishMode ?
                    item.nameEng === parent : item.nameRus === parent)) {
                    targetChild = item.connect;
                    return true;
                }
                else return false;
            });
        })) return targetChild;
    return [];
}

export function getSelectorNestedValues(selector, parentsArr, englishMode = false) {
    if (parentsArr && parentsArr.length && selector && selector.length)
        return getSelectorValues(getSelectorNestedObjs(selector, parentsArr, englishMode));
    else return [];
}

export function getSelectedNestedIDs(selector, selectedValues, parentsArr, englishMode = false) {
    if (selectedValues && selectedValues.length && selector && selector.length && parentsArr && parentsArr.length)
        return getSelectedIDs(getSelectorNestedObjs(selector, parentsArr, englishMode), selectedValues, englishMode);
    else return [];
}

export function getNameFromObjArr(objArr) {
    if (objArr && objArr.length)
        return objArr[0].name;
    else return "";
}

export function getNamesFromObjArr(objArr) {
    if (objArr && objArr.length)
        return objArr.map(item => item.name);
    else return [];
}