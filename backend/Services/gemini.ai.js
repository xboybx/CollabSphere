
import { GoogleGenerativeAI } from "@google/generative-ai"


const genAI = new GoogleGenerativeAI("AIzaSyAyFIHigQcJR7lCWFMYRVg3HmEW3knft0Y");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
    },
    systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.
    
    Examples: 

    <example>
 
    response: {

    "text": "this is you fileTree structure of the express server",
    "fileTree": {
        "app.js": {
            file: {
                contents: "
                const express = require('express');

                const app = express();


                app.get('/', (req, res) => {
                    res.send('Hello World!');
                });


                app.listen(3000, () => {
                    console.log('Server is running on port 3000');
                })
                "
            
        },
    },

        "package.json": {
            file: {
                contents: "

                {
                    "name": "temp-server",
                    "version": "1.0.0",
                    "main": "index.js",
                    "scripts": {
                        "test": "echo \"Error: no test specified\" && exit 1"
                    },
                    "keywords": [],
                    "author": "",
                    "license": "ISC",
                    "description": "",
                    "dependencies": {
                        "express": "^4.21.2"
                    }
}

                
                "
                
                

            },

        },

    },
    // "buildCommand": {
    //     mainItem: "npm",
    //         commands: [ "install" ]
    // },

    // "startCommand": {
    //     mainItem: "node",
    //         commands: [ "app.js" ]
    // }
}

    user:Create an express application 
   
    </example>


    
       <example>

       user:Hello 
       response:{
       "text":"Hello, How can I help you today?"
       }
       
       </example>
    
 IMPORTANT : don't use file name like routes/index.js ansd routes/index.js
       
       
    `
});

export const generateResult = async (prompt) => {

    const result = await model.generateContent(prompt);

    return result.response.text()
}


// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: `AIzaSyAyFIHigQcJR7lCWFMYRVg3HmEW3knft0Y` });

// function parseMarkdownToFileTree(markdownText) {
//   const fileTree = {};
//   // Regex to match code blocks with language and optional filename in the info string
//   // e.g., ```javascript filename.js
//   const codeBlockRegex = /```(?:\w+)?\s*([\w\-.\/]+)?\n([\s\S]*?)```/gm;

//   let match;
//   while ((match = codeBlockRegex.exec(markdownText)) !== null) {
//     const filename = match[1] || `file_${match.index}.txt`;
//     const content = match[2];
//     fileTree[filename] = {
//       file: {
//         contents: content.trim(),
//       },
//     };
//   }

//   return fileTree;
// }
// // e.g., ```javascript filename.js
// // e.g., ```javascript filename.js
// // Regex to match code blocks with language and optional filename in the info string
// // Regex to match code blocks with language (e.g., ```javascript ... ```)
// // Regex to match code blocks with language (e.g., ```javascript ... ```)
// const fileTree = {};

// export const generateResult = async (prompt) => {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: prompt,
//       systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.

//     IMPORTANT: When responding to requests for code projects, you MUST respond with a JSON object with two keys: "text" and "fileTree". The "text" key contains a brief explanation or message for the user. The "fileTree" key contains an object where each key is a filename and the value is an object with a "file" key containing an object with a "contents" key holding the full code string for that file.

//     Example response:

//     {
//       "text": "Here is your express application.",
//       "fileTree": {
//         "app.js": {
//           "file": {
//             "contents": "const express = require('express');\nconst app = express();\napp.get('/', (req, res) => { res.send('Hello World!'); });\napp.listen(3000);"
//           }
//         },
//         "package.json": {
//           "file": {
//             "contents": "{ \"name\": \"temp-server\", \"version\": \"1.0.0\" }"
//           }
//         }
//       }
//     }

//     Always respond ONLY with this JSON object when the user requests code projects. Do NOT include markdown or any other formatting.

//     If the user says hello or non-code requests, respond with a simple JSON object with a "text" key only.

//     IMPORTANT : don't use file name like routes/index.js
       
       
//     `
//     });
//     // Extract content from candidates array
//     if (response?.candidates && response.candidates.length > 0) {
//       const content = response.candidates[0].content;
//       console.log("Raw AI response content:", content);  // Added logging
//       try {
//         const parsedContent = JSON.parse(content);
//         return parsedContent;
//       } catch (err) {
//         // If parsing fails, try to parse markdown to file tree
//         const fileTree = parseMarkdownToFileTree(content);
//         return {
//           text: "Here is your project with files.",
//           fileTree,
//         };
//       }
//     }
//     return response.text;
//   } catch (error) {
//     console.error("Error calling Gemini API:", error);
//     throw new Error("Failed to generate content. Please check your API key and network connection.");
//   }
// }
// // Regex to match code blocks with language (e.g., ```javascript ... ```)
// // Regex to match code blocks with language (e.g., ```javascript ... ```)
// const filePathRegex = /^[\s│]*[├└]──\s(.+)$/gm;

