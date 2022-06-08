 const json = {
     "title": "This is a question form powered by EY",
     "description": "this is a description, we can add rules here.",
    "questions": [
        {
            "name": "name",
            "type": "text",
            "title": "Please enter your name:",
            "placeHolder": "Jon Snow",
            "isRequired": true,
            "autoComplete": "name",
            "test" : "test"
        },{
            type: "rating",
            name: "satisfaction",
            title: "How satisfied are you with the Product?",
            minRateDescription: "Not Satisfied",
            maxRateDescription: "Completely satisfied"
        }, {
            "type": "radiogroup",
            "name": "car",
            "title": "What car are you driving?",
            "isRequired": true,
            "colCount": 4,
            "choices": [
                "Ford",
                "Vauxhall",
                "Volkswagen",
                "Nissan",
            ]
        },        
        {
            type: "comment",
            name: "suggestions",
            title: "What would make you more satisfied with the Product?"
        }
    ]
};
export default json;