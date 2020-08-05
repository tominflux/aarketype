const { validateArchetype } = require("../archetype")
const { validateField, createField, FIELD_TYPE } = require("ffield")


const validateItem = (item, archetype) => {
    const validationErr = (msg) => new Error(
        `Item validation error: ${msg}\n`
    )
    //
    const {
        archetypeId,
        identifier,
        properties,
        variationFactors,
        derivedProperties
    } = item
    //Validate archetype identifier
    if (archetypeId !== archetype.identifier) {
        throw validationErr(
            `archetypeId "${archetypeId} does not `
            `match specified archetype's identifier `
            `${archetype.identifier}.`
        )
    }
    //Validate identifier field
    try {
        validateField(identifier)
    } catch (err) {
        throw validationErr(err.message)
    }
    if (identifier.type !== FIELD_TYPE.STRING) {
        throw validationErr(
            `identifier.type is "${identifier.type}", ` +
            `expected "STRING"`
        )
    }
    //Validate properties
    // - Ensure it's an object.
    if (typeof properties !== "object") {
        throw validationErr(
            `typeof properties is "${typeof properties}", ` +
            `expected "object".`
        )
    }
    // - Check keys match archetype
    const itemPropKeys = JSON.stringify(Object.keys(properties))
    const archPropKeys = JSON.stringify(Object.keys(archetype.properties))
    if (itemPropKeys !== archPropKeys) {
        throw validationErr(
            `Properties do not match up to archetype properties.\n` +
            `Item properties: ${itemPropKeys}\n` +
            `Archetype properties: ${archPropKeys}`
        )
    }
    // - Check properties are valid fields
    for (const key in properties) {
        const val = properties[key]
        validateField(val)
    }
    // - Check property field types match archetype
    for (const key in properties) {
        const itemVal = properties[key]
        const archVal = archetype.properties[key]
        if (itemVal.type !== archVal) {
            throw validationErr(
                `Field type of properties.${key}="${itemVal.type}" ` +
                `does not match type specified in archetype ` +
                `"${archVal}".`
            )
        }
    }
    //Validate variation factors
    // - Ensure it's an object.
    if (typeof variationFactors !== "object") {
        throw validationErr(
            `typeof variationFactors is "${typeof variationFactors}", ` +
            `expected "object".`
        )
    }
    // - Check keys match 
    const itemVarsKeys = JSON.stringify(Object.keys(variationFactors))
    const archVarsKeys = JSON.stringify(Object.keys(archetype.variationFactors))
    if (itemVarsKeys !== archVarsKeys) {
        throw validationErr(
            `Item variationFactors do not match up to archetype variationFactors.\n` +
            `Item variationFactors: ${itemVarsKeys}\n` +
            `Archetype variationFactors: ${archVarsKeys}`
        )
    }
    // - Check each variation is an array.
    for (const key in variationFactors) {
        const val = variationFactors[key]
        if (!Array.isArray(val)) {
            throw validationErr(
                `variationFactors.${key} is not an array.`
            )
        }
    }
    // - Check each entry of each variation is a valid field.
    for (const key in variationFactors) {
        const val = variationFactors[key]
        for (const entry of val) {
            validateField(entry)
        }
    }
    // - Check each field type of each entry 
    //   matches that of the archetype.
    for (const key in variationFactors) {
        const itemVal = variationFactors[key]
        const archVal = archetype.variationFactors[key]
        for (const itemEntry of itemVal) {
            if (itemEntry.type !== archVal) {
                const index = itemVal.indexOf(itemEntry)
                throw validationErr(
                    `Field type of variationFactors.${key}[${index}] is ` +
                    `"${itemEntry.type}" and does not entry field ` +
                    `type specified in archetype "${archVal}".`
                )
            } 
        }
    }
    //Validate derived properties.
    if (derivedProperties === null) {
        // - If null, ensure archetype derived props
        //   is also null.
        if (archetype.derivedProperties !== null) {
            throw validationErr(
                `Since typeof derivedProperties is "null", ` + 
                `expected typeof archetype.derivedProperties to ` +
                `also be "null", instead found ` +
                `"${archetype.derivedProperties}".`
            )
        }
    } else {
        // - Otherwise... Ensure it's an object.
        if (typeof derivedProperties !== "object") {
            throw validationErr(
                `typeof derivedProperties is "${typeof derivedProperties}", ` +
                `expected "object".`
            )
        }
        // - Check keys match archetype
        const itemDerPropKeys = JSON.stringify(Object.keys(derivedProperties))
        const archDerPropKeys = JSON.stringify(Object.keys(archetype.derivedProperties))
        if (itemDerPropKeys !== archDerPropKeys) {
            throw validationErr(
                `Derived properties do not match up to archetype derived properties.\n` +
                `Item derivedProperties: ${itemDerPropKeys}\n` +
                `Archetype derivedProperties: ${archDerPropKeys}`
            )
        }
        // - Check derived properties are valid fields
        for (const key in derivedProperties) {
            const val = derivedProperties[key]
            validateField(val)
        }
        // - Check derivedProperty field types match archetype
        for (const key in derivedProperties) {
            const itemVal = derivedProperties[key]
            const archVal = archetype.derivedProperties[key]
            if (itemVal.type !== archVal) {
                throw validationErr(
                    `Field type of derivedProperties.${key}="${itemVal.type}" ` +
                    `does not match type specified in archetype ` +
                    `"${archVal}".`
                )
            }
        }
    }
    //Run archetype validators
    for (const validator of archetype.validators) {
        const isValid = validator(item)
        if (isValid !== true) {
            const index = archetype.validators.indexOf(validator)
            throw validationErr(
                `Archetype validator failed. [index=${index}]`
            )
        }
    }
}


const createItem = (
    archetype, 
    identifier,
    properties, 
    variationFactors
) => {
    //Perform basic validation on archetype.
    validateArchetype(archetype)
    //Build item.
    // - Fieldify properties, assiging field types based on archetype.
    let itemProperties = {}
    for (const key in properties) {
        const property = properties[key]
        const fieldType = archetype.properties[key]
        const field = createField(fieldType, property)
        itemProperties = {
            ...itemProperties,
            [key]: field
        }
    }
    // - Fieldify variation entries, assigning 
    //   field types based on archetype.
    let itemVariationFactors = {}
    for (const key in variationFactors) {
        const variation = variationFactors[key]
        const fieldType = archetype.variationFactors[key]
        const fieldArray = []
        for (const entry of variation) {
            const field = createField(fieldType, entry)
            fieldArray.push(field)
        }
        itemVariationFactors = {
            ...itemVariationFactors,
            [key]: fieldArray
        }
    }
    // - Build intermediate item.
    let item = {
        archetypeId: archetype.identifier,
        identifier: createField(FIELD_TYPE.STRING, identifier),
        properties: itemProperties,
        variationFactors: itemVariationFactors
    }
    // - If derived properties exist in archetype, derive them,
    //   and then fieldify them.
    let itemDerivedProperties = {}
    if (archetype.derivedProperties !== null) {
        const intermediateItem = { ...item }
        const derivedProperties = archetype.deriver(intermediateItem)
        for (const key in derivedProperties) {
            const derivedProperty = derivedProperties[key]
            const fieldType = archetype.derivedProperties[key]
            const field = createField(fieldType, derivedProperty)
            itemDerivedProperties = {
                ...itemDerivedProperties,
                [key]: field
            }
        }
    }
    // - Finish building item.
    item = {
        ...item,
        derivedProperties: itemDerivedProperties
    }
    //Validate item.
    validateItem(item, archetype)
    //Return item.
    const newItem = { ...item }
    return newItem
}

exports.validateItem = validateItem
exports.createItem = createItem