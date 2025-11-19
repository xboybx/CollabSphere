const systemInstruction = `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.
    
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
    "buildCommand": {
        mainItem: "npm",
            commands: [ "install" ]
    },

    "startCommand": {
        mainItem: "node",
            commands: [ "app.js" ]
    }
}

    user:Create an express application 
   
    </example>


    
       <example>

       user:Hello 
       response:{
       "text":"Hello, How can I help you today?"
       }
       
       </example>
    
 IMPORTANT : don't use file name like routes/index.js
       
       
    
    `;

export const callGeminiAPI = async (prompt) => {
    const apiKey = process.env.GOOGLE_AI_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_AI_KEY is not configured');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout

    try {
        console.log("Calling Gemini API...");
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal, // Pass the abort signal to fetch
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: systemInstruction }]
                    },
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0.4,
                    }
                }),
            }
        );

        clearTimeout(timeoutId); // Clear the timeout if the request completes in time

        const data = await response.json();
        console.log("Gemini API Response:", data);

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            if (data.error?.message.includes('models/gemini-pro is not found for API version v1beta')) {
                throw new Error('GEMINI_MODEL_NOT_FOUND');
            }
            throw new Error(data.error?.message || 'Gemini API error');
        }

        console.log("Successfully received response from Gemini API.");
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("Gemini API call timed out.");
            throw new Error('Gemini API call timed out');
        }
        console.error("Error in callGeminiAPI:", error);
        throw error;
    }
};