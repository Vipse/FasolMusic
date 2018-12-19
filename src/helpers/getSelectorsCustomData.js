export function getSelectorValues(selector, englishMode) {
    if (selector && selector.length)
        return selector.map(item => englishMode ? item[0].nameEng : item[0].nameRus);
    else return [];
}

export function getSelectorNestedValues(selector) {
    let nestedValuesObj = {};
    if (selector && selector.length)
        selector.forEach(item => {
            if (item[0].connect)
                nestedValuesObj[item[0].nameRus] = item[0].connect[0].map(item => item[0].nameRus);
        });
    return nestedValuesObj;
}

export function getSelectorIDs(selector, selectedValues) {
    if (selectedValues && selectedValues.length && selector && selector.length) {
        const selectorValues = getSelectorValues(selector);
        if (!Array.isArray(selectedValues)) return [selector[selectorValues.indexOf(selectedValues)][0].id];
        else return selectedValues.map(item => selector[selectorValues.indexOf(item)][0].id);
    }
    else return [];
}

export function getSelectorNestedIDs(selector, selectedValues, parentName) {
    if (selectedValues && selectedValues.length && selector && selector.length) {
        const indexOfParent = getSelectorValues(selector).indexOf(parentName);
        const selectorValues = getSelectorNestedValues(selector)[parentName];
        if (!Array.isArray(selectedValues)) return [selector[indexOfParent][0].connect[0][selectorValues.indexOf(selectedValues)][0].id];
        else return selectedValues.map(item => selector[indexOfParent][0].connect[0][selectorValues.indexOf(item)][0].id);
    }
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