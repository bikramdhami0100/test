"use client"
import Image from "next/image";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

const genAI = new GoogleGenerativeAI("AIzaSyBizymeEK7pHot_XeGDYBZEtxWdfwWvnj0");
export default function Home() {
const [loading,setLoading]=useState(false);
   const handler=async()=>{

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 12000,
      responseModalities: [
      ],
      responseMimeType: "text/plain",
    };
    
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});

      const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
      });
      const prompt = `Translate the following ${"English" ? `${"english"} ` : ''}text to ${"nepali"}: ${"Styles applied to these components use JavaScript objects rather than CSS, which is used on web. However, a lot of the properties will look familiar if you've previously used CSS on web."}`;
      const result = await chatSession.sendMessage(prompt);
  // TODO: Following code needs to be updated for client-side apps.
  const candidates = result.response.candidates;
  for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
    for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
      const part = candidates[candidate_index].content.parts[part_index];
      if(part.inlineData) {
        try {
          const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
          fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
          console.log(`Output written to: ${filename}`);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
      // const prompt = `Translate the following ${"English" ? `${"english"} ` : ''}text to ${"nepali"}: ${"Styles applied to these components use JavaScript objects rather than CSS, which is used on web. However, a lot of the properties will look familiar if you've previously used CSS on web."}`;
      // const result = await model.generateContent(prompt);
      
      console.log( result.response.text())
      if(result.response.text()){
        setLoading(false);
      }
    } catch (error) {
      console.log(error)
      throw error;
    }
   }
// handler();
  return (
   <div>
      hello world
      <br/>
      {
        loading&& <div>Loading ....</div>
      }
      <br/>
      <button onClick={handler} >submit</button>
   </div>
  );

}