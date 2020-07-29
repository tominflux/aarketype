const assert = require("assert")
const { createField, FIELD_TYPE } = require("ffield")
const { validateArchetype, createArchetype } = require("../../lib/archetype")


/////////
/////////


//Valid Archetype Object's Methods
const validDeriver = (item) => ({
    ukTotalCostGBP: (
        item.properties.priceGBP.data + 
        item.properties.ukPostGBP.data
    ),
    wrldTotalCostGBP: (
        item.properties.priceGBP.data + 
        item.properties.wrldPostGBP.data
    )
})

//Valid Archetype Objects
const validA = {
    //Identifier 
    identifier: createField(FIELD_TYPE.STRING, "tshirt"),
    //Properties
    properties: {
        name: FIELD_TYPE.STRING,
        priceGBP: FIELD_TYPE.NUMBER,
        description: FIELD_TYPE.STRING,
        ukPostGBP: FIELD_TYPE.NUMBER,
        wrldPostGBP: FIELD_TYPE.NUMBER
    },
    //(Optional properties must be set to null rather than undefined).
    variationFactors: null,
    derivedProperties: null,
    deriver: null,
    validators: null
}
const validB = {
    //Identifier 
    identifier: createField(FIELD_TYPE.STRING, "tshirt"),
    //Properties
    properties: {
        name: FIELD_TYPE.STRING,
        priceGBP: FIELD_TYPE.NUMBER,
        description: FIELD_TYPE.STRING,
        ukPostGBP: FIELD_TYPE.NUMBER,
        wrldPostGBP: FIELD_TYPE.NUMBER
    },
    //Variation Factors (Optional)
    variationFactors: {
        size: FIELD_TYPE.STRING,
        colourway: FIELD_TYPE.STRING
    },
    //Derived Properties (optional)
    derivedProperties: {
        ukTotalCostGBP: FIELD_TYPE.NUMBER,
        wrldTotalCostGBP: FIELD_TYPE.NUMBER
    },
    //Deriver (optional, compulsory if deriverProperties not null)
    deriver: validDeriver,
    validators: [
        //Restrict item sizes.
        (item) => {
            const validSizes = [
                "xs", "sm", "md", "lg", "xl"
            ]
            for (const size of item.variationFactors.size) {
                if (!validSizes.includes(size.data)) {
                    throw new Error(
                        `Size "${size.data}" is invalid.`
                    )
                }
            }
            return true
        },
        //Restrict colour ways.
        (item) => {
            const validColourways = [
                "black", "white"
            ]
            for (const colourway of item.variationFactors.colourway) {
                if (!validColourways.includes(colourway.data)) {
                    throw new Error(
                        `Colourway "${colourway.data}" is invalid.`
                    )
                }
            }
            return true
        }
    ]
}


//Invalid Archetype Objects
const invalidA = {
    //Identifier 
    identifier: createField(FIELD_TYPE.STRING, "tshirt"),
    //Properties
    properties: {
        name: FIELD_TYPE.STRING,
        priceGBP: FIELD_TYPE.NUMBER,
        description: FIELD_TYPE.STRING,
        ukPostGBP: FIELD_TYPE.NUMBER,
        wrldPostGBP: FIELD_TYPE.NUMBER
    }
    //Missing optional properties (should be set to null.)
}
const invalidB = {
    //Identifier 
    identifier: createField(FIELD_TYPE.STRING, "tshirt"),
    //Properties
    properties: "Not an object.",
    //(Optional properties must be set to null rather than undefined).
    variationFactors: null,
    derivedProperties: null,
    deriver: null,
    validators: null
}
const invalidC = {
    //Identifier 
    identifier: createField(FIELD_TYPE.STRING, "tshirt"),
    //Properties
    properties: {
        name: "These",
        priceGBP: "are",
        description: "not",
        ukPostGBP: "field",
        wrldPostGBP: "types"
    },
    //(Optional properties must be set to null rather than undefined).
    variationFactors: null,
    derivedProperties: null,
    deriver: null,
    validators: null
}
const invalidD = {
    //Identifier 
    identifier: "Not a field.",
    //Properties
    properties: {
        name: FIELD_TYPE.STRING,
        priceGBP: FIELD_TYPE.NUMBER,
        description: FIELD_TYPE.STRING,
        ukPostGBP: FIELD_TYPE.NUMBER,
        wrldPostGBP: FIELD_TYPE.NUMBER
    },
    //(Optional properties must be set to null rather than undefined).
    variationFactors: null,
    derivedProperties: null,
    deriver: null,
    validators: null
}
const invalidE = {
    //Identifier 
    identifier: createField(FIELD_TYPE.STRING, "tshirt"),
    //Properties
    properties: {
        name: FIELD_TYPE.STRING,
        priceGBP: FIELD_TYPE.NUMBER,
        description: FIELD_TYPE.STRING,
        ukPostGBP: FIELD_TYPE.NUMBER,
        wrldPostGBP: FIELD_TYPE.NUMBER
    },
    //(Optional properties must be set to null rather than undefined).
    variationFactors: {
        size: "Not",
        colourway: "field types..."
    },
    derivedProperties: null,
    deriver: null,
    validators: null
}
const invalidF = {
    //Identifier 
    identifier: createField(FIELD_TYPE.STRING, "tshirt"),
    //Properties
    properties: {
        name: FIELD_TYPE.STRING,
        priceGBP: FIELD_TYPE.NUMBER,
        description: FIELD_TYPE.STRING,
        ukPostGBP: FIELD_TYPE.NUMBER,
        wrldPostGBP: FIELD_TYPE.NUMBER
    },
    //Variation Factors
    variationFactors: {
        size: FIELD_TYPE.STRING,
        colourway: FIELD_TYPE.STRING
    },
    //Derived Properties
    derivedProperties: {
        ukTotalCostGBP: FIELD_TYPE.NUMBER,
        wrldTotalCostGBP: FIELD_TYPE.NUMBER
    },
    //Must define a deriver function if derived
    //properties are given.
    deriver: null,
    //Validator functions
    validators: null
}
const invalidG = {
    //Identifier 
    identifier: createField(FIELD_TYPE.STRING, "tshirt"),
    //Properties
    properties: {
        name: FIELD_TYPE.STRING,
        priceGBP: FIELD_TYPE.NUMBER,
        description: FIELD_TYPE.STRING,
        ukPostGBP: FIELD_TYPE.NUMBER,
        wrldPostGBP: FIELD_TYPE.NUMBER
    },
    //Variation Factors
    variationFactors: {
        size: FIELD_TYPE.STRING,
        colourway: FIELD_TYPE.STRING
    },
    //Derived Properties
    derivedProperties: {
        ukTotalCostGBP: FIELD_TYPE.NUMBER,
        wrldTotalCostGBP: FIELD_TYPE.NUMBER
    },
    //Deriver must be a function
    deriver: "Not a function",
    //Validator functions
    validators: null
}
const invalidH = {
    //Identifier 
    identifier: createField(FIELD_TYPE.STRING, "tshirt"),
    //Properties
    properties: {
        name: FIELD_TYPE.STRING,
        priceGBP: FIELD_TYPE.NUMBER,
        description: FIELD_TYPE.STRING,
        ukPostGBP: FIELD_TYPE.NUMBER,
        wrldPostGBP: FIELD_TYPE.NUMBER
    },
    //Variation Factors
    variationFactors: {
        size: FIELD_TYPE.STRING,
        colourway: FIELD_TYPE.STRING
    },
    //Derived Properties
    derivedProperties: {
        ukTotalCostGBP: "Not",
        wrldTotalCostGBP: "field types..."
    },
    //Deriver function
    deriver: validDeriver,
    //Validator functions
    validators: null
}
const invalidI = {
    //Identifier 
    identifier: createField(FIELD_TYPE.STRING, "tshirt"),
    //Properties
    properties: {
        name: FIELD_TYPE.STRING,
        priceGBP: FIELD_TYPE.NUMBER,
        description: FIELD_TYPE.STRING,
        ukPostGBP: FIELD_TYPE.NUMBER,
        wrldPostGBP: FIELD_TYPE.NUMBER
    },
    //Variation Factors
    variationFactors: {
        size: FIELD_TYPE.STRING,
        colourway: FIELD_TYPE.STRING
    },
    //Derived Properties
    derivedProperties: {
        ukTotalCostGBP: FIELD_TYPE.NUMBER,
        wrldTotalCostGBP: FIELD_TYPE.NUMBER
    },
    //Deriver function
    deriver: validDeriver,
    //Validator functions
    validators: "Not an array of functions"
}
const invalidJ = {
    //Identifier 
    identifier: createField(FIELD_TYPE.STRING, "tshirt"),
    //Properties
    properties: {
        name: FIELD_TYPE.STRING,
        priceGBP: FIELD_TYPE.NUMBER,
        description: FIELD_TYPE.STRING,
        ukPostGBP: FIELD_TYPE.NUMBER,
        wrldPostGBP: FIELD_TYPE.NUMBER
    },
    //Variation Factors
    variationFactors: {
        size: FIELD_TYPE.STRING,
        colourway: FIELD_TYPE.STRING
    },
    //Derived Properties
    derivedProperties: {
        ukTotalCostGBP: FIELD_TYPE.NUMBER,
        wrldTotalCostGBP: FIELD_TYPE.NUMBER
    },
    //Deriver function
    deriver: validDeriver,
    //Validator functions
    validators: [
        "Not an array",
        "of functions."
    ]
}

//

//Function that should create identical to
//'validB'
const createValidB = () => createArchetype(
    //Identifier 
    createField(FIELD_TYPE.STRING, "tshirt"),
    //Properties
    {
        name: FIELD_TYPE.STRING,
        priceGBP: FIELD_TYPE.NUMBER,
        description: FIELD_TYPE.STRING,
        ukPostGBP: FIELD_TYPE.NUMBER,
        wrldPostGBP: FIELD_TYPE.NUMBER
    },
    //Variation Factors (Optional)
    {
        size: FIELD_TYPE.STRING,
        colourway: FIELD_TYPE.STRING
    },
    //Derived Properties (optional)
    {
        ukTotalCostGBP: FIELD_TYPE.NUMBER,
        wrldTotalCostGBP: FIELD_TYPE.NUMBER
    },
    //Deriver (optional, compulsory if deriverProperties not null)
    validDeriver,
    //Validators (optional)
    [
        //Restrict item sizes.
        (item) => {
            const validSizes = [
                "xs", "sm", "md", "lg", "xl"
            ]
            for (const size of item.variationFactors.size) {
                if (!validSizes.includes(size.data)) {
                    throw new Error(
                        `Size "${size.data}" is invalid.`
                    )
                }
            }
            return true
        },
        //Restrict colour ways.
        (item) => {
            const validColourways = [
                "black", "white"
            ]
            for (const colourway of item.variationFactors.colourway) {
                if (!validColourways.includes(colourway.data)) {
                    throw new Error(
                        `Colourway "${colourway.data}" is invalid.`
                    )
                }
            }
            return true
        }
    ]
)


/////////
/////////


describe("Archetype Functions", () => {
    describe("validateArchetype", () => {
        it("Throws no errors for valid archetype objects.", () => {
            assert.doesNotThrow(() => validateArchetype(validA))
            assert.doesNotThrow(() => validateArchetype(validB))
        })
        it("Throws errors for all invalid archetype objects.", () => {
            assert.throws(() => validateArchetype(invalidA))
            assert.throws(() => validateArchetype(invalidB))
            assert.throws(() => validateArchetype(invalidC))
            assert.throws(() => validateArchetype(invalidD))
            assert.throws(() => validateArchetype(invalidE))
            assert.throws(() => validateArchetype(invalidF))
            assert.throws(() => validateArchetype(invalidG))
            assert.throws(() => validateArchetype(invalidH))
            assert.throws(() => validateArchetype(invalidI))
            assert.throws(() => validateArchetype(invalidJ))
        })
    })
    describe("createArchetype", () => {
        it("Creates the expected object.", () => {
            const expected = JSON.stringify(validB)
            const actual = JSON.stringify(createValidB())
            assert.equal(actual, expected)
            assert.equal(actual.deriver, expected.deriver)
        })
    })
})