const { createArchetype } = require("../../../lib/archetype")
const { FIELD_TYPE, createField } = require("ffield")

const tshirtArchetype = createArchetype(
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
    (item) => ({
        ukTotalCostGBP: (
            item.properties.priceGBP.data + 
            item.properties.ukPostGBP.data
        ),
        wrldTotalCostGBP: (
            item.properties.priceGBP.data + 
            item.properties.wrldPostGBP.data
        )
    }),
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

console.log(tshirtArchetype)

exports.tshirtArchetype = tshirtArchetype